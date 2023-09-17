import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function BackButtonwState({ Title, ReRoute, Stateval }) {
  let navigate = useNavigate();
  console.log("rerooute==", ReRoute);
  return (
    <>
      <div
        class="backbtnsec mb20"
        style={{ cursor: "pointer", position: "relative" }}
      >
        <a
          class="backbtn"
          onClick={() => {
            navigate("/" + ReRoute, { state: Stateval });
          }}
        >
          <IoArrowBackCircleOutline
            style={{ margin: "0px", fontSize: "28px" }}
          />
          <span class="backtext">Back</span>{" "}
        </a>

        <div class="backheadmed">{Title}</div>
        <div></div>
      </div>
    </>
  );
}
