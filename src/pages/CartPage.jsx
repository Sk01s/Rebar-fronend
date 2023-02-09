import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/Authenticator";
import { useCategories } from "../context/CategoiresContext";
import { useSetOut } from "../context/SetOutFucntions";
import DisplayProducts from "../components/Gallary";
import AddressPopup from "../components/AddAddressPopup";
export default function CartPage() {
  const { categories, products } = useCategories();
  const { currentUser } = useAuth();
  const {
    setQuanitiyDb,
    removeCartProduct,
    getCartProducts,
    checkout,
    getAddress,
  } = useSetOut();
  const [isLoading, setIsLoading] = useState();
  const [quantity, setQuanitiy] = useState();
  const [productsLocale, setProductLocale] = useState([]);
  const [price, setPrice] = useState(0);
  const [addressPopup, setAddressPopup] = useState();
  const history = useNavigate();

  const calculatePrice = () => {
    setPrice(() => {
      return productsLocale.reduce((acc, next) => {
        if (next[0]?.price === undefined) return 0;
        return (
          parseFloat(acc) + parseFloat(next[0]?.price) * parseFloat(next[2])
        );
      }, 0);
    });
  };
  useEffect(() => {
    async function getProductByCart() {
      if (currentUser === null) {
        history("/login");
        return setProductLocale(null);
      }
      if (!currentUser.emailVerified) history("/notverified");
      const list = await getCartProducts();

      setProductLocale(
        // creating an array of products and orginizing them to create cart product
        list.map((product) => {
          const categoryId = product.directory.slice(0, 20);
          const productId = product.directory.slice(21);
          const { options } = product;
          const prod = {
            ...products.find((product) => {
              if (
                product.category.id === categoryId &&
                parseInt(product.id) === parseInt(productId)
              )
                return true;
              return false;
            }),
          };
          prod["options"] = options;
          return [prod, categoryId, parseInt(product.quantity)];
        })
      );
      if (productsLocale.length === 0) setIsLoading(false);
    }
    getProductByCart();
  }, [categories, currentUser]);
  useEffect(() => {
    function setStates() {
      if (productsLocale[0] === undefined) return;
      setIsLoading(true);
      setQuanitiy(() => {
        return productsLocale?.map((product) => product?.[2]);
      });
      calculatePrice();

      setIsLoading(false);
    }
    setStates();
  }, [productsLocale]);
  const productsCartsEl = productsLocale?.map((product, index) => {
    if (product[0] === undefined) return <></>;
    return (
      <div
        className="product-cart-card flex align-ce gap-1"
        key={`${product[1]}-${product[0]?.id}`}
      >
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
  });
  function createOrder() {
    return productsLocale.map((product, index) => {
      const { options } = product[0];
      return {
        id: `${product[1]}-${product[0].id}`,
        quantity: quantity[index],
        options,
      };
    });
  }
  async function handleCheckout() {
    const order = createOrder();
    const addressArray = await getAddress();
    if (addressArray.length === 0) return setAddressPopup(true);
    checkout(order);
  }
  if (!isLoading && productsLocale?.length === 0)
    return (
      <div className="container">
        <DisplayProducts products={[]} title=" No product has been added" />
      </div>
    );

  return (
    <div className="cart-container container flex flex-direc align-ce gap-2">
      {productsCartsEl}
      {addressPopup && <AddressPopup />}
      <div className="buy-details">
        <div className="sub-total-price">Subtotal : {price} $</div>
        <button className="btn-buy" onClick={handleCheckout}>
          Check Out
        </button>
      </div>
    </div>
  );
}
