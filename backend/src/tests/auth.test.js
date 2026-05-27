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
      .set(
      "Authorization",
      `Bearer ${accessToken}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
