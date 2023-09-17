import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dataVal from "../../data/Abis.json";
import { Spinner } from "reactstrap";
import loader from "../../images/loader.png";

export default function LoaderCard(props) {
  let navigate = useNavigate();

  return (
    <>
      {" "}
      <div class="awaitingconfirmsec mb20">
        <p class="text1 mb20">Awaiting confirmation</p>
        <img src={loader} alt="Loader" class="loader-image" />
      </div>
    </>
  );
}
