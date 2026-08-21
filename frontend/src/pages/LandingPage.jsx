import { Link } from "react-router-dom";
import {
  ListTodo,
  CloudSun,
  Paperclip,
  Mail,
  ShieldCheck,
  Filter,
} from "lucide-react";

import MainLogo from "../assets/task management favicon.png";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  {
    icon: ShieldCheck,
    title: "Your tasks, private to you",
    description:
      "Every task belongs to your account. No one else can see or edit them.",
  },
  {
    icon: CloudSun,
    title: "Live weather on every task",
    description:
      "Add a location to a task and see the current weather right on the card.",
  },
  {
    icon: Paperclip,
    title: "Attach files",
    description: "Add a screenshot, document, or reference file to any task.",
  },
  {
    icon: Mail,
    title: "Email updates",
    description:
      "Get an email when you create a task, and again when you mark it done.",
  },
  {
    icon: Filter,
    title: "Filter and search",
    description:
      "Find tasks fast by status, priority, due date, or a quick search.",
  },
  {
    icon: ListTodo,
    title: "A simple task board",
    description: "Create, edit, and delete tasks from one clean dashboard.",
  },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <main className="landing">
      <header className="landing__header">
        <div className="landing__brand">
          <img src={MainLogo} alt="logo" className="landing__brand-icon" />
          <span className="landing__brand-text">Narigiri</span>
        </div>
        <Link
          to={user ? "/dashboard" : "/auth/login"}
          className="landing__nav-cta"
        >
          {user ? "Go to Dashboard" : "Login"}
        </Link>
      </header>

      <section className="landing__hero">
        <h1 className="landing__hero-title">
          Keep track of your tasks, simply.
        </h1>
        <p className="landing__hero-subtitle">
          Create tasks with a due date and location, attach files, and see the
          weather for each one — all in one place, just for you.
        </p>
        <div className="landing__hero-actions">
          {user ? (
            <Link
              to="/dashboard"
              className="landing__btn landing__btn--primary"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="landing__btn landing__btn--primary"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="landing__btn landing__btn--secondary"
              >
                Create an account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="landing__features">
        {features.map(({ icon: Icon, title, description }) => (
          <div className="landing__feature" key={title}>
            <Icon className="landing__feature-icon" />
            <h3 className="landing__feature-title">{title}</h3>
            <p className="landing__feature-description">{description}</p>
          </div>
        ))}
      </section>

      <footer className="landing__footer">
        <p>
          Narigiri — built with the MERN stack. Developed by{" "}
          <span>N. Srinu Vinay Kumar</span>
        </p>
      </footer>
    </main>
  );
};

export default LandingPage;
