import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmCard(props) {
  let navigate = useNavigate();

  return (
    <>
      <div class="transictionconfirmsec mb20">
        <p class="text1 mb20">Transaction Confirmed </p>

        <a
          href={"https://bscscan.com/tx/" + props.tx}
          target="_blank"
          class="btn-outline-grey mb20"
        >
          View Transaction
        </a>
        {props.manage == "true" && (
          <a
            class="btn-outline-grey"
            onClick={() => {
              navigate("/manage");
            }}
          >
            Manage Miner
          </a>
        )}
      </div>
    </>
  );
}
