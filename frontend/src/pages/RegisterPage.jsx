import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRegister } from "../hooks/useAuth";
import Input from "../common/ui/Input.jsx";
import Button from "../common/ui/Button.jsx";
const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const { mutate: register, isPending, error } = useRegister();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field])
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username || form.username.length < 3)
      newErrors.username = "Username must bet at-least 3 characters";

    if (!form.email) newErrors.email = "Email is required";

    if (!form.password)
      newErrors.password = "Password must be al-least 6 characters";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Password do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form };
    delete payload.confirmPassword;
    register(payload);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-400">Start with 1000 free demo coins</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400 text-center">
                {error.response?.data?.message || "Something went wrong"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Username"
              value={form.username}
              onChange={handleChange("username")}
              placeholder="coolplayer"
              error={errors.username}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              error={errors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="••••••••"
              error={errors.confirmPassword}
            />
            <Button type="submit" loading={isPending} fullWidth>
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-primary hover:text-purple-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
