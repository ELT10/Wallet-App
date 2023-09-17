import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorCard(props) {
  let navigate = useNavigate();

  return (
    <>
      <div class="transictionconfirmsec mb20">
        <p class="text1 mb20" style={{ color: "red" }}>
          Something went wrong
        </p>
        <p
          class="text1"
          style={{
            fontSize: "11px",
            margin: "auto 10px",
            marginBottom: "15px",
          }}
        >
          {props.err}
        </p>
      </div>
    </>
  );
}
