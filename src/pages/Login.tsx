import React, { useState, useContext } from "react";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../style/LoginPage.scss";
import img from '../assets/freepik__enhance__11709.png';
import googleIcon from '../assets/auth/Rectangle.svg';
import fbIcon from '../assets/auth/Rectangle-1.svg';
import SwiperDecoration from "../components/SwiperDecoration";
interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { dispatch } = useContext(UserContext);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  return (
  <div className="login-page">
    <div className="left-side-wrapper">
      <div className="wrapper">
      <Link to="/" className="logo l-reversed">Hireble</Link>
      <h1 className="login-title">Sign in</h1>
      <span className="create-account">Don’t have an account?  {<Link to="/register">Create now</Link>}</span>
      <LoginForm />
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
    <div className="right-side-wrapper">
      <div className="decoration-ball"></div>
      <div className="wrapper">
        <div className="card">
          <h2>
            Trusted by industry leaders
          </h2>
          <div className="companies-carousel-description-wrapper">
            <p>
            From Fortune 500 to cutting-edge startups - connect with employers actively seeking your talent.
          </p>
          <SwiperDecoration />
          </div>

        </div>
      </div>
    </div>
  </div>
);

}