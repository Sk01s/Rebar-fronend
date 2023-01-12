import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";

const categoriesContext = React.createContext();

export function useCategories() {
  return useContext(categoriesContext);
}
export function CategoiresContext({ children }) {
  const history = useNavigate();
  const [categories, setGategories] = useState(() => []);
  const [products, setProducts] = useState(() => []);
  const categoriesCol = collection(db, "categories");
  const productsCol = collection(db, "products");
  useEffect(() => {
    const getCategories = async () => {
      let categoriesSnapshot = getDocs(categoriesCol);
      let productsSnapshot = getDocs(productsCol);
      [categoriesSnapshot, productsSnapshot] = await Promise.all([
        categoriesSnapshot,
        productsSnapshot,
      ]);
      if (
        categoriesSnapshot.empty === true ||
        productsSnapshot.empty === true
      ) {
        getCategories();
        if (window.location.pathname === "/403") return;
        history("/403");
      }
      setGategories(
        categoriesSnapshot?.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setProducts(
        productsSnapshot?.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    getCategories(db);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const value = {
    categories,
    products,
  };
  return (
    <categoriesContext.Provider value={value}>
      {children}
    </categoriesContext.Provider>
  );
}
