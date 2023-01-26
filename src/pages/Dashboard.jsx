/* eslint-disable eqeqeq */
import React from "react";
import { useAuth } from "../context/Authenticator";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, signout } = useAuth();
  const history = useNavigate();
  const handleSignOut = () => {
    signout();
    history(" ");
  };
  return (
    <article className="dashboard container">
      <h1>Your Account</h1>
      <p>Email : {currentUser.email}</p>
      <button onClick={handleSignOut}>sign out </button>
    </article>
  );
}
