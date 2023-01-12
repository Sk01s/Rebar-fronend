import React, { useRef } from "react";

export const PicturesSlider = ({ photos }) => {
  const imgsEl = useRef([]);
  const buttonEl = useRef([]);
  const addImgRef = (el) => {
    if (el && !imgsEl.current.includes(el)) {
      imgsEl.current.push(el);
    }
  };
  const addButtonRef = (el) => {
    if (el && !buttonEl.current.includes(el)) {
      buttonEl.current.push(el);
    }
  };
  const showPic = (index) => {
    imgsEl.current.forEach((img, idx) => {
      const button = buttonEl.current[idx];
      button.classList.remove("active");
      img.classList.remove("active");
      if (index === idx) {
        img.classList.add("active");
        button.classList.add("active");
      }
    });
  };
  const pictures = photos.map((photo, index) => {
    return (
      <React.Fragment key={index}>
        <img
          className={`${index === 0 ? "active" : ""}`}
          src={photo}
          alt=""
          ref={addImgRef}
        />
        <button
          style={{ translate: `0 calc(${index}rem + 100% * ${index})` }}
          className={`${index === 0 ? "active" : ""}`}
          ref={addButtonRef}
          onMouseOver={() => showPic(index)}
        >
          {" "}
          <img className="active" src={photo} alt="" />
        </button>
      </React.Fragment>
    );
  });

  return <>{pictures}</>;
};
