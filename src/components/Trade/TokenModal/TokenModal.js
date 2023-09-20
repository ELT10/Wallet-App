import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import IndiToken from "./IndiTokens";

export default function TokenModal(props) {
  const [modalV, setmodalV] = useState(false);
  const toggleModal = () => {
    setmodalV(!modalV);
  };

  const updateValue = (newValue) => {
    toggleModal();
    props.updateParentValue(newValue);
  };


  return (
    <>
      <a
        class="selecttokendrop"
        onClick={() => {
          toggleModal();
        }}
      >
        <span class="float-right fromreactspan" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <span
              className={props.datatok.find((item) => item.label == props.currenttoken).icon}
            ></span>
          {props.currenttoken}{" "}
        </span>
      </a>

      <Modal
        isOpen={modalV}
        toggle={toggleModal}
        size="md"
        centered="true"
        backdrop="static"
        backdropClassName="tokenswapmodalbg"
        className="modalswap"
      >
        <ModalBody
          style={{
            padding: "0px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <div
            class="modal-dialog modal-dialog-centered"
            style={{ margin: "0px" }}
          >
            <div class="modal-content">
              <div
                class="modal-header wallettokenheaderbg"
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <h1 class="modal-title fs-5" id="staticBackdropLabel">
                  Select a Token
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    toggleModal();
                  }}
                ></button>
              </div>
              <div class="modal-body" style={{ backgroundColor: "white" }}>
                <div class="walletpopup">

                  <div class="wallettokenrows">
                    <IndiToken token="BNB" name="BNB"  datatok={props.datatok} first="true" updateParentValue={updateValue}/>
                    <IndiToken token="BNB" name="WBNB"  datatok={props.datatok} updateParentValue={updateValue}/>
                    <IndiToken token="BUSD" name="BUSD"  datatok={props.datatok} updateParentValue={updateValue}/>
                    <IndiToken token="EGOLD" name="EGOLD" datatok={props.datatok} updateParentValue={updateValue}/>
                    {/* <IndiToken token="CBK" name="CBK(Mining Credits)" datatok={props.datatok} updateParentValue={updateValue}/> */}
                  </div>
                </div>
              </div>
              <div
                class="modal-footer lightblue-bg"
                style={{ borderRadius: "10px" }}
              >
                <p class="walletpopupfooterp">
                  All conversions from BNB to WBNB are executed on a 1:1 ratio.
                  Please make sure you have sufficient BNB balance to pay
                  various transaction fees on the network.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
