import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCategories } from "../context/CategoiresContext";
import { useSetOut } from "../context/SetOutFucntions";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import { PicturesSlider } from "../components/PicturesSlider";
import SelectOptions from "../components/SelectOptions";
import { useMemo } from "react";

export default function SetOutProduct() {
  const history = useNavigate();
  let { productDirec } = useParams();
  const categoryId = productDirec.split("-")[0];
  const productId = parseInt(productDirec.split("-")[1]);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(<></>);
  const { products } = useCategories();
  const { addFavorite, addToCart } = useSetOut();
  const favBtn = useRef();
  const optionsData = {};
  console.log(products);
  const productData = useMemo(
    () =>
      products.find((product) => {
        if (
          product.category.id === categoryId &&
          parseInt(product.id) === parseInt(productId)
        )
          return true;
        return false;
      }),
    [products]
  );
  if (productData === undefined) return <></>;
  const { price, photos, title, details, options } = productData;
  function handleOrder() {
    addToCart(productDirec, quantity, optionsData).then(() => history("/cart"));
  }
  function setOption(optionName, options) {
    optionsData[optionName] = options;
  }
  const optionsEl = Object.keys(options)?.map((key, i) => {
    optionsData[key] = options[key][0];
    return (
      <SelectOptions
        changeOptions={setOption}
        optionName={key}
        options={[...options[key]]}
        key={key}
      />
    );
  });
  return (
    <div className="container">
      <main className="product-container flex">
        <div className="img-box flex justify-ce align-ce">
          <PicturesSlider photos={photos} />
        </div>
        <div className="details">
          <h2 className="title">{title}</h2>
          <p className="price">{price} $</p>
          <div>
            {optionsEl}
            <h3>description</h3>
            <p className="description">{details} </p>
          </div>
        </div>
        <div>
          <div className="quantity flex flex-direc">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              min="1"
            />
          </div>
          <div className="flex align-ce">
            <button
              className="btn-add"
              onClick={() => {
                addToCart(productDirec, quantity, optionsData);
                setNotification(<Popup text={title} title="added to cart" />);
                setTimeout(() => setNotification(<></>), 1000);
              }}
            >
              Add to Cart
            </button>
            <button
              ref={favBtn}
              className="btn-favorite"
              onClick={async () => {
                const isAdded = await addFavorite(productDirec, favBtn);
                setNotification(
                  <Popup title={isAdded ? "added" : "removed"} text={title} />
                );
                setTimeout(() => setNotification(<></>), 1000);
              }}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
          <button
            onClick={handleOrder}
            className="btn-buy flex justify-ce align-ce"
          >
            Buy Now
          </button>
        </div>
        {notification}
      </main>
    </div>
  );
}
