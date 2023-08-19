import React, { useContext, useState, useId } from "react";
import { setDoc, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { useAuth } from "./Authenticator";
import { json, useNavigate } from "react-router-dom";
import { db } from "../firebase-config";

const SetOutFunction = React.createContext();

export function useSetOut() {
  return useContext(SetOutFunction);
}

export async function createAddress(user) {
  await setDoc(doc(db, "address", user.uid), {
    address: [],
  });
}
export async function createCart(user) {
  await setDoc(doc(db, "cart", user.uid), {
    list: [],
  });
}
export async function createFavList(user) {
  await setDoc(doc(db, "favorite", user.uid), {
    list: [],
  });
}

export function SetOut({ children }) {
  const [favProducts, setFavProducts] = useState({ list: [] });
  const [cartProducts, setCartProducts] = useState({ list: [] });
  const [address, setAddress] = useState({ list: [] });
  const history = useNavigate();
  const { currentUser } = useAuth();

  async function getList(collection, segment) {
    let data;
    if (currentUser == undefined) {
      data = JSON.parse(localStorage.getItem(collection));
    } else {
      const docs = await getDoc(doc(db, collection, currentUser?.uid));
      data = docs.data()[segment];
    }
    return data;
  }

  async function addAddress(addressDetails) {
    const { firstname, lastname, country, state, street, city, zipcode } =
      addressDetails;
    if (currentUser == undefined) {
      let address = JSON.parse(localStorage.getItem("address")) || [];

      address = address?.filter((address) => {
        if (
          address?.firstname === firstname &&
          address?.lastname === lastname &&
          address?.country === country &&
          address?.state === state &&
          address?.street === street &&
          address?.city === city &&
          address?.zipcode === zipcode
        )
          return false;
        return true;
      });
      address.push({
        firstname,
        lastname,
        country,
        city,
        state,
        street,
        zipcode,
      });

      localStorage.setItem("address", JSON.stringify(address));
      return;
    }

    let { address } = await getList("address");

    address = address?.filter((address) => {
      if (
        address.firstname === firstname &&
        address.lastname === lastname &&
        address.country === country &&
        address.state === state &&
        address.street === street &&
        address.city === city &&
        address.zipcode === zipcode
      )
        return false;
      return true;
    });
    address.push({
      firstname,
      lastname,
      country,
      city,
      state,
      street,
      zipcode,
    });

    await setDoc(
      doc(db, "address", currentUser.uid),
      {
        address,
      },
      { merge: true }
    );
  }

  async function checkout(order, orderId, address) {
    const respons = await fetch(
      `${
        import.meta.env.VITE_APP_API_HOST_LINK      }/payment/create-checkout-session`,
      {
        body: JSON.stringify({
          userId: currentUser?.uid || localStorage.getItem("customerId"),
          orderId,
          address,
          items: order,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await respons.json();

    const { url } = data;
    window.location = url;
  }
  async function setQuanitiyDb(number = Number, directory) {
    let { list } = await getList("cart");
    list = list.map((product) => {
      if (product?.directory === directory)
        return { ...product, quantity: number };
      return product;
    });
    setCartProducts({ list });
    await setDoc(
      doc(db, "cart", currentUser.uid),
      {
        list,
      },
      {
        merge: true,
      }
    );
  }
  async function removeCartProduct(productDirectory) {
    let list = await getList("cart", "list");
    list = list.filter((product) => {
      if (product.directory === productDirectory) return false;
      return true;
    });
    setCartProducts({ list });
    if (currentUser == undefined) {
      localStorage.setItem("cart", JSON.stringify(list));
    }
    await updateDoc(doc(db, "cart", currentUser.uid), {
      list,
    });
  }
  async function addToCart(directory, quantity, options) {
    if (quantity < 1) return;
    if (currentUser === null) {
      let CartProduct = JSON.parse(localStorage.getItem("cart"));
      if (CartProduct == null) CartProduct = [];
      let isDuplicated;

      function deleteProduct(directory) {
        CartProduct = CartProduct.filter((product) => {
          if (product.directory === directory) return false;
          return true;
        });
      }
      CartProduct.forEach((product) => {
        if (isDuplicated === true) return;
        if (product.directory === directory) {
          if (parseInt(product.quantity) !== parseInt(quantity))
            return deleteProduct(product.directory);
          Object.keys(product.options).map((key) => {
            if (product.options[key] !== options[key]) {
              return deleteProduct(product.directory);
            }
          });
        }
        if (
          product.directory === directory &&
          parseInt(product.quantity) === parseInt(quantity) &&
          !Object.keys(product.options)
            .map((key) => {
              if (product.options[key] !== options[key]) {
                return false;
              }
            })
            .includes(false)
        )
          return (isDuplicated = true);
        isDuplicated = false;
      });
      if (isDuplicated) return;
      CartProduct.push({ quantity, directory, options });
      setCartProducts({ CartProduct });
      localStorage.setItem("cart", JSON.stringify(CartProduct));
    }
    let { list } = await getList("cart");
    let isDuplicated;

    function deleteProduct(directory) {
      list = list.filter((product) => {
        if (product.directory === directory) return false;
        return true;
      });
    }
    list.forEach((product) => {
      if (isDuplicated === true) return;
      if (product.directory === directory) {
        if (parseInt(product.quantity) !== parseInt(quantity))
          return deleteProduct(product.directory);
        Object.keys(product.options).map((key) => {
          if (product.options[key] !== options[key]) {
            return deleteProduct(product.directory);
          }
        });
      }
      if (
        product.directory === directory &&
        parseInt(product.quantity) === parseInt(quantity) &&
        !Object.keys(product.options)
          .map((key) => {
            if (product.options[key] !== options[key]) {
              return false;
            }
          })
          .includes(false)
      )
        return (isDuplicated = true);
      isDuplicated = false;
    });
    if (isDuplicated) return;
    list.push({ quantity, directory, options });
    setCartProducts({ list });
    await updateDoc(
      doc(db, "cart", currentUser.uid),
      {
        list,
      },
      { merge: true }
    );
  }
  async function addFavorite(directory) {
    if (currentUser === null) history("/signup");

    const favCollect = await getList("favorite");
    let list;
    let isAdded;
    if (favCollect.list.includes(directory)) {
      list = favCollect.list.filter((product) => {
        return product !== directory;
      });
      isAdded = false;
    } else {
      favCollect.list.push(directory);
      list = favCollect.list;
      isAdded = true;
    }

    setFavProducts({ list });
    await setDoc(
      doc(db, "favorite", currentUser.uid),
      {
        list,
      },
      { merge: true }
    );
    return isAdded;
  }
  async function addOrder(items, id, address) {
    await setDoc(
      doc(db, "orders", currentUser?.uid || localStorage.getItem("customerId")),
      {
        isPayed: false,
        id,
        address,
        items,
      }
    );
  }
  async function getFavProducts() {
    if (favProducts?.[0] === undefined) {
      const favProducts = await getList("favorite");
      if (favProducts === undefined) return createFavList();
      return favProducts.list;
    }
    return favProducts;
  }
  async function getCartProducts() {
    if (cartProducts?.[0] === undefined) {
      const cartProducts = await getList("cart", "list");
      if (cartProducts === undefined) return createCart();
      return cartProducts;
    }
    return cartProducts;
  }
  async function getAddress() {
    if (address?.[0] === undefined) {
      const addressArray = await getList("address", "address");
      if (addressArray === undefined) return createAddress();
      setAddress(addressArray);
      return addressArray;
    }
    return address;
  }
  const value = {
    createCart,
    createAddress,
    createFavList,
    addFavorite,
    addToCart,
    addAddress,
    addOrder,
    checkout,
    getFavProducts,
    getCartProducts,
    getAddress,
    removeCartProduct,
    setQuanitiyDb,
  };

  return (
    <SetOutFunction.Provider value={value}>{children}</SetOutFunction.Provider>
  );
}
