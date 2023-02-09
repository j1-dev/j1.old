import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed">
      <button
        className="button-still text-3xl"
        onClick={() => navigate(-1)}
      ></button>
    </div>
  );
}

export default BackButton;
