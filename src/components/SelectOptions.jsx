import React, { useRef, useMemo } from "react";
import "../css/SelectOption.css";
const SelectOptions = ({ optionName, options, changeOptions }) => {
  console.log(options);
  const optionsEl = useRef([]);

  const handleSelection = (index) => {
    const target = optionsEl.current[index];
    optionsEl.current = optionsEl.current.map((option) => {
      option.classList?.remove("active");
      return option;
    });
    target.classList.add("active");
    changeOptions(optionName, target.innerText);
  };
  const optionsElements = useMemo(
    () =>
      options.map((option, i) => {
        return (
          <span
            ref={(v) => (optionsEl.current[i] = v)}
            key={`${option}-${i}`}
            className="option"
            onClick={() => handleSelection(i)}
          >
            {option}
          </span>
        );
      }),
    []
  );
  return (
    <div className="option-selector">
      <h3>{optionName} :</h3>
      <div className="selector-bar">{optionsElements}</div>
    </div>
  );
};

export default SelectOptions;
