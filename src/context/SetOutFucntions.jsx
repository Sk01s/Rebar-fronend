import React, { useContext, useState } from "react";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "./Authenticator";
import { useNavigate } from "react-router-dom";
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

  async function getList(collection) {
    const docs = await getDoc(doc(db, collection, currentUser?.uid));
    const docData = docs.data();

    return docData;
  }
  async function addAddress(addressDetails) {
    const { firstname, lastname, country, state, street, city, zipcode } =
      addressDetails;
    const { address } = await getList("address");
    address?.filter((address) => {
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

  async function checkout(order) {
    const respons = await fetch(
      `${
        import.meta.env.VITE_APP_API_HOST_LINK
      }/payment/create-checkout-session`,
      {
        body: JSON.stringify({
          userId: currentUser.uid,
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
    let { list } = await getList("cart");
    list = list.filter((product) => {
      if (product.directory === productDirectory) return false;
      return true;
    });
    setCartProducts({ list });
    await updateDoc(doc(db, "cart", currentUser.uid), {
      list,
    });
  }
  async function addToCart(directory, quantity) {
    if (quantity < 1) return;
    if (currentUser === null) history("/Tech-Mode/signup");
    let { list } = await getList("cart");
    let neededToOrgnize;

    function deleteProduct(directory) {
      list = list.filter((product) => {
        if (product.directory === directory) return false;
        return true;
      });
    }

    list.forEach((product) => {
      if (neededToOrgnize === true) return;
      if (
        product.directory === directory &&
        parseInt(product.quantity) !== parseInt(quantity)
      )
        return deleteProduct(product.directory);
      if (
        product.directory === directory &&
        parseInt(product.quantity) === parseInt(quantity)
      )
        return (neededToOrgnize = true);
      neededToOrgnize = false;
    });
    if (neededToOrgnize) return;

    list.push({ quantity, directory });
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
    if (currentUser === null) history("/Tech-Mode/signup");

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
      const cartProducts = await getList("cart");
      if (cartProducts === undefined) return createCart();
      return cartProducts.list;
    }
    return cartProducts;
  }
  async function getAddress() {
    if (address?.[0] === undefined) {
      const addressArray = await getList("address");
      if (addressArray === undefined) return createAddress();
      setAddress(addressArray.address);
      return addressArray.address;
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
