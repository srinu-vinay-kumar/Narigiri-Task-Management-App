import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import { Link } from "react-router-dom";
import MainLogo from "../assets/task management logo.png";

const loginSchema = z.object({
  email: z.string().email("Please a valid email"),
  password: z.string().min(8, "Password is required"),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/login", data);
      login(response.data);
      console.log("logged in successfully", response);
    } catch (err) {
      console.error(err.response?.data?.message);
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <main className="login-page">
      <img src={MainLogo} alt="logo" className="page-logo" />
      <div className="login__container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {/* email field */}
          <div className="login-form__group">
            <label htmlFor="email" className="login-form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className={`login-form__input ${errors.email ? "login-form__input--error" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <span className="login-form__error">{errors.email.message}</span>
            )}
          </div>
          {/* password field */}
          <div className="login-form__group">
            <label htmlFor="password" className="login-form__label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              className={`login-form__input ${errors.password ? "login-form__input--error" : ""}`}
              {...register("password")}
            />
            <button
              type="button"
              className="form__password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="login-form__error">
                {errors.password.message}
              </span>
            )}
          </div>
          <button type="submit" className="login-form__submit">
            Sign In
          </button>
        </form>
        <p className="auth-form__link-section">
          Not a user?
          <Link to="/auth/register" className="auth-form__link">
            Register Here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
