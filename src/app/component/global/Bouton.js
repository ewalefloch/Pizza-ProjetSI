import React from "react";

const Button = ({ text, onClick, color }) => {
  return (
    <button
      className={`px-6 py-2 text-lg font-semibold rounded-lg transition duration-300 ${color}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
