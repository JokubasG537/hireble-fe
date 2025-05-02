import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import Loader from "../components/Loader";
import RegisterStep1UserForm from "../components/RegisterStep1UserForm";
import RegisterStep2CompanyForm from "../components/RegisterStep2CompanyForm";

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
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useApiMutation<{ user: any; token: string }, RegisterForm>(
    "/users/register",
    "POST"
  );

  const handleUserSubmit = async () => {
    setError(null);
    registerMutation.mutate(form, {
      onSuccess: (data) => {
        dispatch({ type: "LOGIN", payload: { user: data.user, token: data.token } });
        if (form.role === "user") {
          navigate("/login");
        } else {
          setCurrentStep(2);
        }
      },
      onError: (err: any) => {
        setError(err.message || "Registration failed");
      },
    });
  };

  if (registerMutation.isLoading) return <Loader />;

  return (
    <div>
      <h2>Register {currentStep > 1 ? `- Step ${currentStep}` : ""}</h2>

      {currentStep === 1 && (
        <RegisterStep1UserForm
          form={form}
          setForm={setForm}
          onSubmit={handleUserSubmit}
          isLoading={registerMutation.isLoading}
          error={error}
        />
      )}

      {currentStep === 2 && <RegisterStep2CompanyForm />}
    </div>
  );
}
