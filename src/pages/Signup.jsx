import React, { useRef, useState } from "react";
import { useAuth } from "../context/Authenticator";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signup() {
  const submitButton = useRef();
  const [error, setError] = useState("");
  const email = useRef();
  const password = useRef();
  const passwordConfrimation = useRef();
  const { signup, currentUser } = useAuth();
  const history = useNavigate();

  if (currentUser != undefined) history("/Tech-Mode");

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitButton.current.disabled = true;

    const emailV = email.current.value;
    const passwordV = password.current.value;
    const passwordConfrimationV = passwordConfrimation.current.value;

    if (passwordV !== passwordConfrimationV) {
      submitButton.current.disabled = false;
      return setError("Passwords do not match");
    }
    setError("");
    signup(emailV, passwordV, setError).then(
      () => {
        history("/Tech-Mode/notverified");
        submitButton.current.disabled = false;
      },
      () => (submitButton.current.disabled = false)
    );
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="container flex algin-ce justify-ce flex-direc signup-container"
    >
      <h2 className="text-ce">Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <label htmlFor="email">email</label>
      <input
        ref={email}
        type="email"
        placeholder="your email"
        id="email"
        name="email"
        autoComplete={"email".toString()}
        required
      />
      <label htmlFor="password">password</label>
      <input
        type="password"
        placeholder="your password"
        id="password"
        name="password"
        autoComplete={"new-password".toString()}
        ref={password}
        required
      />
      <label htmlFor="passPword-confirmation">confirm password </label>
      <input
        type="password"
        placeholder="confirm your password"
        id="password-confirmation"
        autoComplete={"new-password".toString()}
        ref={passwordConfrimation}
        required
      />
      <button ref={submitButton} className="btn-submit">
        Create account
      </button>
      <h3 className="switch-sign-way-text flex gap-2 justify-ce">
        You have an account
        <Link to="/Tech-Mode/login">Log In</Link>
      </h3>
    </form>
  );
}
