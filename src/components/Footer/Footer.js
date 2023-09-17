import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import website from "../../images/footer/project_website.png";
import calc from "../../images/footer/calculator.png";
import info from "../../images/footer/information.png";
import youtube from "../../images/footer/youtube.png";
import twitter from "../../images/footer/twitter.png";
import telegram from "../../images/footer/telegram.png";
import gitbook from "../../images/footer/gitbook.png";

export default function WalletCard() {
  let navigate = useNavigate();
  return (
    <div className="footerdiv">
      <footer id="footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <div class="row">
                <div class="col-sm-12 col-md-6 respmb">
                  <a
                    href="https://www.egoldproject.com/"
                    target="_blank"
                    style={{ color: "unset" }}
                  >
                    <div class="footerlist mb-3">
                      <div class="footerimg">
                        <img src={website} class="img-fluid" />
                      </div>
                      Project Website
                    </div>
                  </a>
                  <div
                    class="footerlist"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/calculator");
                    }}
                  >
                    <div class="footerimg">
                      <img src={calc} class="img-fluid" />
                    </div>
                    Mining Calculator
                  </div>
                </div>
                <div class="col-sm-12 col-md-6 ">
                  <a
                    href="https://egold.gitbook.io/egold/"
                    target="_blank"
                    style={{ color: "unset" }}
                  >
                    <div class="footerlist mb-3">
                      <div class="footerimg">
                        <img src={info} class="img-fluid" />
                      </div>
                      Project Information
                    </div>
                  </a>
                  <a
                    href="https://www.egoldstats.io/"
                    target="_blank"
                    style={{ color: "unset" }}
                  >
                    <div class="footerlist">
                      <div class="footerimg">
                        <img src={website} class="img-fluid" />
                      </div>
                      Egold Statistics
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-lg-4 social-links">
              {/* <a href="#" class="youtube" target="_blank">
                <img src={youtube} alt="" class="footersocialicon" />
              </a> */}
              <a
                href="https://twitter.com/egoldproject"
                class="twitter"
                target="_blank"
              >
                <img src={twitter} alt="" class="footersocialicon" />
              </a>
              <a
                href="https://t.me/egold_farm"
                class="telegram"
                target="_blank"
              >
                <img src={telegram} alt="" class="footersocialicon" />
              </a>
              <a
                href="https://egold.gitbook.io/egold/"
                class="telegram"
                target="_blank"
              >
                <img src={gitbook} alt="" class="footersocialicon" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div id="bottomFooter">
        <p class="text-center bottomFooterp">
          &copy; Copyright EGOLD Project 2023
        </p>
      </div>
    </div>
  );
}
