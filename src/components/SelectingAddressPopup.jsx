import { faL } from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useState } from "react";

export const SelectingAddressPopup = ({
  addressArray,
  setSelectAddress,
  toggle,
  createAddress,
}) => {
  const [index, setIndex] = useState(0);
  const addressEl = useRef([]);
  const setActive = (index) => {
    addressEl.current.map((element, i) => {
      if (i === index) {
        element.className = "active";
      } else {
        element.className = "";
      }
    });
    setIndex(index);
  };
  return (
    <div className="address-setter-popup">
      <div>
        <span>country</span>
        <span>city</span>
        <span>state</span>
        <span>street</span>
        <span>zipcode</span>
      </div>

      {addressArray?.map((address, index) => {
        return (
          <div
            ref={(e) => (addressEl.current[index] = e)}
            key={index}
            onClick={() => setActive(index)}
            className={index === 0 ? "active" : ""}
          >
            <span>{address.country}</span>
            <span>{address.city}</span>
            <span>{address.state}</span>
            <span>{address.street}</span>
            <span>{address.zipcode}</span>
          </div>
        );
      })}
      <section className="action-btns">
        <button
          // disabled={index== undefined ? true : false}
          onClick={() => {
            console.log(addressArray[index]);

            setSelectAddress(addressArray[index]);
            toggle(false);
          }}
        >
          Select address
        </button>
        <button onClick={() => createAddress(true)}>Add address</button>
      </section>
    </div>
  );
};
export default SelectingAddressPopup;
