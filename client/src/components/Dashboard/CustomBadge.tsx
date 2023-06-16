import React from "react";

const CustomBadge = ({ color }: { color: string }) => {
  return (
    <div
      style={{
        width: "7px",
        aspectRatio: "1 / 1",
        borderRadius: "50%",
        backgroundColor: color,
        flexShrink: "0",
      }}
    ></div>
  );
};

export default CustomBadge;
