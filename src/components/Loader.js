import React from "react";

function Loader(props) {
  return (
    <>
      <p class="loading-text" style={{ color: "#b8c9fc", textAlign: "center" }}>
        {" "}
        <div class="loading"></div>
      </p>
    </>
  );
}
export default Loader;
