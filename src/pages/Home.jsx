import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Promises from "../components/Promises";
import DisplayProducts from "../components/Gallary";
import { useCategories } from "../context/CategoiresContext";
import "../css/Offers.css";
export default function Home() {
  const { categories, products } = useCategories();
  const cardCategories = categories.map(
    ({ id, picture, description, offer }) => {
      return (
        <Categories
          picture={picture}
          description={description}
          offer={offer}
          key={id}
          id={id}
        />
      );
    }
  );

  return (
    <div className="container">
      <Hero />
      <div className="offers grid ">{cardCategories}</div>
      <Promises />
      <DisplayProducts title="best sellers" products={products} />
    </div>
  );
}
