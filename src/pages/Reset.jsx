import React, { useState } from "react";
import { useAuth } from "../context/Authenticator";
const Reset = () => {
  const [message, setMessage] = useState();
  const { auth, sendPasswordResetEmail } = useAuth();
  return (
    <form
      className="container flex algin-ce justify-ce flex-direc signup-container"
      onSubmit={(e) => {
        e.preventDefault();
        sendPasswordResetEmail(auth, e.currentTarget.email.value).then(() => {
          setMessage("email had been sent successfully");
        });
      }}
    >
      <h2 className="text-ce">reset password</h2>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" required />
      <button className="btn-submit">send reset email</button>
      {message && <div className="message error">{message}</div>}
    </form>
  );
};

export default Reset;
