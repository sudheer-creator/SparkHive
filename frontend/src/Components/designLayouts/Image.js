import React from "react";

const Image = ({ imgSrc, className }) => {
  return <img className={className} style={{height:"200px", objectFit:"cover"}}src={imgSrc} alt={imgSrc} />;
};

export default Image;
