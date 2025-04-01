import React from "react";
import { Link } from "react-router-dom";

export default function FourOFour() {
  return (
    <div className="flex flex-col items-center justify-center">
      <span>404</span>
      <span>{"Page Not Found :("}</span>
      <Link to={"/"}>
        <button>Return Home</button>
      </Link>
    </div>
  );
}
