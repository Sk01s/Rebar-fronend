import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/Authenticator";
import { useCategories } from "../context/CategoiresContext";
import { useSetOut } from "../context/SetOutFucntions";
import DisplayProducts from "../components/Gallary";
import AddAddressPopup from "../components/AddAddressPopup";
import SelectingAddressPopup from "../components/SelectingAddressPopup";
import CartProduct from "../components/CartProduct";
import { faL } from "@fortawesome/free-solid-svg-icons";
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
  const buyBtn = useRef();
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState();
  const [quantity, setQuanitiy] = useState();
  const [productsLocale, setProductLocale] = useState([]);
  const [price, setPrice] = useState(0);
  const [addressCreationPopup, createAddress] = useState(() => false);
  const [addressSelectionPopup, settingAddress] = useState(() => false);
  const [selectedAddress, setSelectedAddress] = useState();

  const [addressArray, setAddressArray] = useState(() => []);

  useEffect(() => {
    async function order() {
      if (!selectedAddress) return;
      const orderId = crypto.randomUUID();
      const order = createOrder();
      // await addOrder(order, orderId, selectedAddress);
      await checkout(order, orderId, selectedAddress);
    }
    order();
  }, [selectedAddress]);

  useEffect(() => {
    async function getProductForCart() {
      // if (product !== undefined)
      if (currentUser === null) {
        const product = JSON.parse(localStorage.getItem("cart"));
        return setProductLocale(
          product.map((product) => {
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
      }
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
    getProductForCart();
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
    setTimeout(() => {
      setIsBtnDisabled(false);
    }, 2000);
  }, [productsLocale]);

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
    const addresses = await getAddress();
    setAddressArray(addresses || []);

    if (addresses?.length == 0) {
      console.log("oppening");
      return createAddress(true);
    }
    settingAddress(true);
  }

  const productsCartsEl = productsLocale?.map((product, index) => {
    if (product[0] === undefined) return <></>;
    return (
      <CartProduct
        index={index}
        product={product}
        quantity={quantity}
        removeCartProduct={removeCartProduct}
        setPrice={setPrice}
        setProductLocale={setProductLocale}
        setQuanitiy={setQuanitiy}
        setQuanitiyDb={setQuanitiyDb}
        key={`${product[1]}-${product[0]?.id}`}
      />
    );
  });

  if (!isLoading && productsLocale?.length === 0)
    return (
      <div className="container">
        <DisplayProducts products={[]} title=" No product has been added" />
      </div>
    );
  return (
    <div className="cart-container container flex flex-direc align-ce gap-2">
      {productsCartsEl}
      {addressCreationPopup && (
        <AddAddressPopup
          setAddressArray={setAddressArray}
          close={createAddress}
        />
      )}
      {addressSelectionPopup && (
        <SelectingAddressPopup
          addressArray={addressArray}
          createAddress={createAddress}
          setSelectAddress={setSelectedAddress}
          toggle={settingAddress}
        />
      )}
      <div className="buy-details">
        <div className="sub-total-price">Subtotal : {price} $</div>
        <button
          disabled={isBtnDisabled}
          className="btn-buy"
          onClick={handleCheckout}
        >
          Check Out
        </button>
      </div>
    </div>
  );
}
