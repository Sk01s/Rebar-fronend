import React, { useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { createFavList, createCart, createAddress } from "./SetOutFucntions";
import { auth } from "../firebase-config";

const AuthContext = React.createContext();

function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password).catch(
    (error) => error.message
  );
}

function signout() {
  signOut(auth);
}
export function useAuth() {
  return useContext(AuthContext);
}
export function Authenticator({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function signup(email, password, setError) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((data) => {
        // creating a customer on stripe
        fetch(
          `${import.meta.env.VITE_APP_API_HOST_LINK}/payment/create-customer`,
          {
            body: JSON.stringify({
              userId: auth.currentUser.uid,
              email,
            }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        sendEmailVerification(auth.currentUser);
        createAddress(auth.currentUser);
        createCart(auth.currentUser);
        createFavList(auth.currentUser);
        return data;
      })
      .catch((error) => {
        setError(error.message.match(/:.+\(/)[0].slice(1, -1));
        throw error;
      });
  }
  function checkForVerifiction() {
    const checkForVerifictionInterval = setInterval(() => {
      auth?.currentUser?.reload().then((ok) => {
        if (auth.currentUser.emailVerified) {
          setCurrentUser(auth.currentUser);
          clearInterval(checkForVerifictionInterval);
        }
      });
    }, 1000);
  }

  useEffect(() => {
    const unsubercibe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      return unsubercibe;
    });
  });

  const value = {
    auth,
    signout,
    login,
    signup,
    currentUser,
    sendEmailVerification,
    sendPasswordResetEmail,
    checkForVerifiction,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
