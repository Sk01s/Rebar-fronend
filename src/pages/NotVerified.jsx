import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authenticator";
import { useNavigate } from "react-router-dom";
const NotVerified = () => {
  const history = useNavigate();
  const { sendEmailVerification, checkForVerifiction, currentUser } = useAuth();
  const [waitngTime, setWaitingTime] = useState(
    JSON.parse(localStorage.getItem("waintingTime")) || 0
  );

  const timer = () => {
    const time = setInterval(() => {
      setWaitingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(time);
          return prevTime;
        }
        localStorage.setItem("waintingTime", JSON.stringify(prevTime - 1));
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const checkIterval = setInterval(() => {
      if (!currentUser) {
        clearInterval(checkIterval);
        history("/Tech-Mode");
      }
      if (currentUser?.emailVerified) {
        clearInterval(checkIterval);
        history("/Tech-Mode");
      }
    }, 1000);
    timer();
  }, []);
  checkForVerifiction();
  const handleSending = () => {
    if (waitngTime !== 0) return;
    setWaitingTime(60);
    timer();
    sendEmailVerification(currentUser);
  };

  return (
    <main className="notverified-container">
      <h2 className="title">Your email is not verified</h2>
      <div>left time to resend {waitngTime}</div>
      <button onClick={handleSending} disabled={waitngTime !== 0}>
        resend messege
      </button>
      <p>if could not find it check in the Span category</p>
    </main>
  );
};

export default NotVerified;
