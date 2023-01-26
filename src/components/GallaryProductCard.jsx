import React from "react";
import { Link } from "react-router-dom";

const GallaryProductCart = ({ product }) => {
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
      to={`/product/${product.category.id}-${product.id}`}
      className="product-card flex flex-direc"
    >
      <div className="img-box">
        <img src={product.photos[0]} alt="" />
      </div>
      <div className="details">
        <h3>{product.title}</h3>
      </div>
      <p className="price">{product.price} $</p>
    </Link>
  );
};
export default GallaryProductCart;
