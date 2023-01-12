import React, { useRef, useState } from "react";
import { useAuth } from "../context/Authenticator";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Login() {
  const [error, setError] = useState("");
  const email = useRef();
  const password = useRef();
  const { login, currentUser } = useAuth();
  const history = useNavigate();
  if (currentUser != undefined) history("/Tech-Mode");
  const handleSubmit = (e) => {
    e.preventDefault();
    const emailV = email.current.value;
    const passwordV = password.current.value;

    setError("");
    login(emailV, passwordV)
      .then((res) => {
        if (typeof res === "string")
          return setError(
            res
              .match(/\/[\s\S]*/)[0]
              .slice(1, -2)
              .replaceAll("-", " ")
          );
        if (!res?.user?.emailVerified) {
          return history("/Tech-Mode/notverified");
        }
        history("/Tech-Mode");
      })
      .catch((message) => {
        setError(
          message
            .match(/\/[\s\S]*/)[0]
            .slice(1, -2)
            .replaceAll("-", " ")
        );
      });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="container flex algin-ce justify-ce flex-direc signup-container"
    >
      <h2 className="text-ce">Login</h2>
      {error && <div className="error">{error}</div>}
      <label htmlFor="email">email</label>
      <input
        ref={email}
        type="text"
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
        autoComplete={"current-password".toString()}
        ref={password}
        required
      />
      <button className="btn-submit">log in</button>
      <h3 className="switch-sign-way-text flex gap-1 justify-ce ">
        forgot password
        <Link to="/Tech-Mode/reset">reset password</Link>
      </h3>
      <h3 className="switch-sign-way-text flex gap-1 justify-ce">
        You do not have an account
        <Link to="/Tech-Mode/signup">sign up</Link>
      </h3>
    </form>
  );
}
