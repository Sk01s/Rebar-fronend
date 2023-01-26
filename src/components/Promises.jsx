import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckFast,
  faCube,
  faMoneyBill1Wave,
  faEarthAmericas,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import "../css/Promises.css";
export default function Promises() {
  return (
    <div className="promises-container grid gap-2 ">
      <div className="promise-card flex align-ce gap-3">
        <FontAwesomeIcon icon={faTruckFast} />
        <h3>Curb-side pickup</h3>
      </div>
      <div className="promise-card flex align-ce gap-3">
        <FontAwesomeIcon icon={faCube} />
        <h3>Free shipping on orders over $50</h3>
      </div>
      <div className="promise-card flex align-ce gap-3">
        <FontAwesomeIcon icon={faMoneyBill1Wave} />
        <h3>compatitive prices guaranteed</h3>
      </div>
      <div className="promise-card flex align-ce gap-3">
        <FontAwesomeIcon icon={faEarthAmericas} />
        <h3>Available to you 24/7</h3>
      </div>
    </div>
  );
}
