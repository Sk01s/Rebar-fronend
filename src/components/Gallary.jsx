import React from "react";
import GallaryProductCart from "./GallaryProductCard";
export default function DisplayProducts({ title, products }) {
  let number = 1;
  const productsCards = products?.map((product) => {
    return (
      <GallaryProductCart product={product} key={`${product[1]}${number++}`} />
    );
  });

  return (
    <div className="products-section">
      <h2 className="title">{title}</h2>
      <div className="products-container grid justify-ce">{productsCards}</div>
    </div>
  );
}
