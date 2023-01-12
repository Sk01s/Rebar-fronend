import React, { useEffect, useState } from "react";
import { useCategories } from "../context/CategoiresContext";
import { db } from "../firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/Authenticator";
import Gallary from "../components/Gallary";

import { useNavigate } from "react-router-dom";

export default function FavoritePage() {
  const history = useNavigate();
  const [favoProduct, setFavoriteProduct] = useState();
  const { currentUser } = useAuth();
  const { categories, products } = useCategories();
  useEffect(() => {
    if (!currentUser) return history("/Tech-Mode/login");
    if (!currentUser?.emailVerified) return history("/Tech-Mode/notverified");
    const FavoriteList = async () => {
      setFavoriteProduct(null);
      const favList = await getDoc(doc(db, "favorite", currentUser?.uid));
      setFavoriteProduct(() => {
        const { list } = favList.data();
        return products.filter((product) => {
          const productDirectory = `${product.category.id}-${product.id}`;
          if (list.includes(productDirectory)) return true;
          return false;
        });
      });
    };
    FavoriteList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, currentUser]);
  return (
    <div className="container">
      <Gallary title="Favorites" products={favoProduct} />
    </div>
  );
}
