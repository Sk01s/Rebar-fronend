import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

const CartProduct = ({
  product,
  setPrice,
  setQuanitiy,
  setQuanitiyDb,
  quantity,
  index,
  setProductLocale,
  removeCartProduct,
}) => {
  return (
    <div className="product-cart-card flex align-ce gap-1">
      <img src={product[0]?.photos?.[0]} alt="" />
      <span>{`${product[0]?.title} ${[...Object.keys(product[0].options)].map(
        (key) => `${key}: ${product[0].options[key]}`
      )}`}</span>
      <span className="flex gap-1 align-ce justify-ce">
        <button
          onClick={() => {
            setPrice(
              (prev) => parseFloat(prev) + parseFloat(product[0]?.price)
            );
            setQuanitiy((prev) => {
              return prev?.map((num, i) => {
                if (i === index) return num + 1;
                return num;
              });
            });
            setQuanitiyDb(
              quantity?.[index] + 1,
              `${product[1]}-${product[0]?.id}`
            );
          }}
          className="counter-btn flex align-ce justify-ce"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {quantity?.[index]}
        <button
          onClick={(e) => {
            if (quantity?.[index] === 1) {
              return;
            }
            setPrice(
              (prev) => parseFloat(prev) - parseFloat(product[0]?.price)
            );
            setQuanitiy((prev) => {
              return prev.map((num, i) => {
                if (i === index) return num - 1;
                return num;
              });
            });
            setQuanitiyDb(
              quantity?.[index] - 1,
              `${product[1]}-${product[0]?.id}`
            );
          }}
          className="counter-btn flex align-ce justify-ce"
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
      </span>
      <Link
        to={`/product/${product[1]}-${product[0]?.id}`}
        className="view-link"
      >
        view
      </Link>
      <span className="price">Price: {product[0]?.price} $</span>
      <button
        className="btn-remove pointer"
        onClick={() => {
          setProductLocale((prevProduct) => {
            return prevProduct.filter((produ) => {
              if (
                `${produ[1]}-${produ[0].id}` ===
                `${product[1]}-${product[0]?.id}`
              )
                return false;
              return true;
            });
          });

          setPrice(
            (prev) =>
              parseFloat(prev) -
              parseFloat(product[0]?.price) * parseFloat(quantity?.[index])
          );
          removeCartProduct(`${product[1]}-${product[0]?.id}`);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default CartProduct;
