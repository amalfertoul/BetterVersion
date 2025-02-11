import React from "react";
import '../styles/PinIt.css'

const PinIt = () => {
  return (
    <label className="container">
      <input type="checkbox" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 75 100"
        className="pin"
      >
        <line
          strokeWidth="12"
          stroke="black"
          y2="100"
          x2="37"
          y1="64"
          x1="37"
        ></line>
        <path
          strokeWidth="10"
          stroke="black"
          d="M16.5 36V4.5H58.5V36V53.75V54.9752L59.1862 55.9903L66.9674 67.5H8.03256L15.8138 55.9903L16.5 54.9752V53.75V36Z"
        ></path>
      </svg>
    </label>
  );
};

export default PinIt;
