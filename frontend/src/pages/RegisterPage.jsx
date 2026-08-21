import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";

import API from "../services/api.js";
import MainLogo from "../assets/task management logo.png";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await API.post("/auth/register", data);
      navigate("/auth/login");
      console.log("Registered Successfully", response);
    } catch (err) {
      console.error(err.response?.data?.message);
      toast.error(
        err.response?.data?.message || "Registration Failed. Please try again.",
      );
    }
  };
  return (
    <main className="register-page">
      <img src={MainLogo} alt="logo" className="page-logo" />
      <div className="register__container">
        <h2 className="register-title">Create an Account</h2>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {/*  Name Field */}
          <div className="register-form__group">
            <label htmlFor="name" className="register-form__label">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Ram Kumar"
              id="name"
              className={`register-form__input ${errors.name ? "register-form__input--error" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <span className="register-form__error">
                {errors.name.message}
              </span>
            )}
          </div>
          {/*  Email Field */}
          <div className="register-form__group">
            <label htmlFor="email" className="register-form__label">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              id="email"
              className={`register-form__input ${errors.email ? "register-form__input--error" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <span className="register-form__error">
                {errors.email.message}
              </span>
            )}
          </div>
          {/*  Password Field */}
          <div className="register-form__group">
            <label htmlFor="password" className="register-form__label">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              id="password"
              className={`register-form__input ${errors.password ? "register-form__input--error" : ""}`}
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
              <span className="register-form__error">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* submit button */}
          <button className="register-form__submit" type="submit">
            Sign up
          </button>
        </form>
        <p className="auth-form__link-section">
          Already Registered?
          <Link to="/auth/login" className="auth-form__link">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
