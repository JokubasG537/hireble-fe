import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import Loader from "../components/Loader";
import RegisterStep1UserForm from "../components/RegisterStep1UserForm";
import RegisterStep2CompanyForm from "../components/RegisterStep2CompanyForm";
import "../style/Register.scss";
import SwiperDecoration from "../components/SwiperDecoration";
import { AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";
import googleIcon from "../assets/auth/Rectangle.svg";
import fbIcon from "../assets/auth/Rectangle-1.svg";
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  role: "user" | "recruiter";
}

export default function Register() {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState(null);
  const [step1Error, setStep1Error] = useState(null);
  const [step2Error, setStep2Error] = useState(null);

  const registerMutation = useApiMutation<{ user: any; token: string }, RegisterForm>(
    "/users/register",
    "POST"
  );

  const validateForm = () => {
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!form.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleUserSubmit = async () => {
    setStep1Error(null);
    setError(null);
    if (!validateForm()) return;
    registerMutation.mutate(form, {
      onSuccess: (data) => {
        dispatch({ type: "LOGIN", payload: { user: data.user, token: data.token } });
        if (form.role === "user") {
          setError("Registration successful! Please login.");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setDirection("forward");
          setCurrentStep(2);
        }
      },
      onError: (err: any) => {
        setStep1Error(err.message || "Registration failed");
      },
    });
  };

  const goBackToStep1 = () => {
    setDirection("backward");
    setCurrentStep(1);
  };

  if (registerMutation.isLoading) return <Loader />;


  const pageVariants = {
    initial: (direction: string) => ({
      x: direction === "forward" ? 300 : -300,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === "forward" ? -300 : 300,
      opacity: 0
    })
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

return (
  <div className="register-page">
    <div className="left-side-wrapper">
      <AnimatePresence mode="wait" initial={false}>
        {currentStep === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="form-container"
          >
            <div className="step-container">
              {step1Error && <div className="error-message">{step1Error}</div>}
              <div className="wrapper">
                <Link to="/" className="logo l-reversed">Hireble</Link>
                <h1 className="login-title">Register</h1>
                <span className="create-account">
                  Already have an account? <Link to="/login">Log in</Link>
                </span>

                <RegisterStep1UserForm
                  form={form}
                  setForm={setForm}
                  onSubmit={handleUserSubmit}
                  isLoading={registerMutation.isLoading}
                  error={step1Error}
                />

                <div className="other-login-options">
                  <span className="divider">or</span>
                  <div className="login-options">
                    <button className="login-opt">
                      <img src={googleIcon} alt="google icon" />
                      Sign in with Google
                    </button>
                    <button className="login-opt">
                      <img src={fbIcon} alt="fb icon" />
                      Sign in with Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="form-container"
          >
            <div className="step-container">
              {step2Error && <div className="error-message">{step2Error}</div>}
              <RegisterStep2CompanyForm />
              {/* <button onClick={goBackToStep1} className="back-btn">
                Back to Step 1
              </button> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="right-side-wrapper">
      <div className="wrapper">
        <div className="card">
          <h2>Trusted by industry leaders</h2>
          <div className="companies-carousel-description-wrapper">
            <p>
              From Fortune 500 to cutting-edge startups – connect with employers actively seeking your talent.
            </p>
            <SwiperDecoration />
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
