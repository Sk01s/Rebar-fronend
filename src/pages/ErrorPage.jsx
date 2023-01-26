import React, { useEffect } from "react";
import { useCategories } from "../context/CategoiresContext";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const history = useNavigate();
  const { categories } = useCategories();
  useEffect(() => {
    if (categories.length !== 0) history(" ");
  }, [categories]);
  return <h1 className="error">Check your internet </h1>;
}
