import app from "../app.js";
import supertest from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";
import { setupDB, closeDB, clearDB } from "./setup.js";
import { PasswordReset } from "../models/index.js";
import crypto from "crypto";
const request = supertest(app);

const registerUser = (overrides = {}) =>
  request.post("/api/v1/auth/register").send({
    username: "testuser",
    email: "test@test.com",
    password: "password123",
    ...overrides,
  });

const loginUser = (overrides = {}) =>
  request.post("/api/v1/auth/login").send({
    email: "test@test.com",
    password: "password123",
    ...overrides,
  });

beforeAll(async () => await setupDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

//register
describe("POST /api/v1/auth/register", () => {
  it("should register a new user and returns a new token", async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.username).toBe("testuser");
    expect(res.body.data.user.balance).toBe(1000);
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it("should reject duplicate email", async () => {
    await registerUser();
    const res = await registerUser();
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should reject duplicate username", async () => {
    await registerUser();
    const res = await registerUser({ email: "other@test.com" });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should reject invalid email format", async () => {
    const res = await registerUser({ email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject short password", async () => {
    const res = await registerUser({ password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject short username ", async () => {
    const res = await registerUser({ username: "ab" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should set refresh token as HTTPOnly cookie", async () => {
    const res = await registerUser();

    const cookie = res.headers["set-cookie"];
    expect(cookie).toBeDefined();
    expect(cookie.some((c) => c.includes("refreshToken"))).toBe(true);
    expect(cookie.some((c) => c.includes("HttpOnly"))).toBe(true);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("should login with correct credentials", async () => {
    await registerUser();
    const res = await loginUser();
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe("test@test.com");
  });

  it("should reject wrong password", async () => {
    await registerUser();
    const res = await loginUser({ password: "wrong-password" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject non-existent email", async () => {
    const res = await loginUser({ email: "nobody@test.com" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/v1/auth/me", () => {
  it("should return current user with valid token", async () => {
    const reg = await registerUser();
    const { accessToken } = reg.body.data;

    const res = await request
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.username).toBe("testuser");
  });

  it("should reject user with no token", async () => {
    const res = await request.get("/api/v1/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject request with fake token", async () => {
    const res = await request
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer fake-jwt-token`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/v1/auth/logout", () => {
  it("should logout and clear cookie", async () => {
    const reg = await registerUser();
    const { accessToken } = reg.body.data;

    const res = await request
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("POST /api/v1/auth/forgot-password", () => {
  it("should return 200 for a registered email", async () => {
    await registerUser();

    const res = await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 200 even for a unregistered email", async () => {
    const res = await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "nobody@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      "If that email exists , a reset link has been shared",
    );
  });

  it("should create a PasswordReset record in DB for valid email", async () => {
    await registerUser();
    const res = await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@test.com" });

    const records = await PasswordReset.find({});
    expect(records.length).toBe(1);
  });

  it("should delete a old request token when a new one is required", async () => {
    await registerUser();

    await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@test.com" });

    await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@test.com" });

    const records = await PasswordReset.find({});
    expect(records.length).toBe(1);
  });

  it("should reject invalid email format", async () => {
    const res = await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should not expose raw token in JSON", async () => {
    await registerUser();

    const res = await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@test.com" });

    expect(JSON.stringify(res.body)).not.toMatch(/token/i);
  });

  it("should store hashed token in DB - not in raw token in DB", async () => {
    await registerUser();

    const res = await request
      .post("/api/v1/auth/forgot-password")
      .send({ email: "test@test.com" });

    const record = await PasswordReset.findOne({}).select("+token");

    expect(record.token).toHaveLength(64);
    expect(record.token).toMatch(/^[a-f0-9]+$/);
  });
});

describe("POST /api/v1/auth/reset-password", () => {
  const setupReset = async () => {
    await registerUser();

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const { User } = await import("../models/index.js");
    const user = await User.findOne({ email: "test@test.com" });

    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    return { rawToken, userId: user._id };
  };

  it("should reset password with a valid token", async () => {
    const { rawToken } = await setupReset();
    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should allow login with new password after reset", async () => {
    const { rawToken } = await setupReset();

    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    const loginRes = await request
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "newpassword123" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.accessToken).toBeDefined();
  });

  it("should reject login with old password after reset", async () => {
    const { rawToken } = await setupReset();

    await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    const loginRes = await request
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "password123" });

    expect(loginRes.status).toBe(401);
  });

  it("should reject invalid token", async () => {
    await setupReset();

    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ token: "completelyfaketoken", password: "newpassword123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject reuse of same token", async () => {
    const { rawToken } = await setupReset();
    await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "anotherpassword" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should delete reset record after successfully reset", async () => {
    const { rawToken } = await setupReset();

    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    const records = await PasswordReset.find({});
    expect(records.length).toBe(0);
  });

  it("should invalidate all session after reset", async () => {
    const { rawToken } = await setupReset();

    await request
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "password123" });

    await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    const { Session } = await import("../models/index.js");
    const sessions = await Session.find({ isActive: true });
    expect(sessions.length).toBe(0);
  });

  it("should reject short new password", async () => {
    const { rawToken } = await setupReset();

    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ token: rawToken, password: "123" });

    expect(res.status).toBe(400);
  });

  it("should reject missing token", async () => {
    const res = await request
      .post("/api/v1/auth/reset-password")
      .send({ password: "newpassword123" });

    expect(res.status).toBe(400);
  });
});
