import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  InstructionContainer,
  InstructionInfo,
  Main,
  VerticalSide,
} from "../theme/theme";
import { FaArrowRight } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import Sidebar from "../components/Sidebar";
import bgImg from "../images/bg-intro-desktop.png";
import ClickToCopy from "../components/Click2Copy";
import door from "../images/sample.jpg";
import cam from "../images/spyCam.jpg";
import { useLocation } from "react-router-dom";
// import { control } from "../data";

// const doorImg = { doorLock: door, spyCam: cam };
const doorImg = [door, cam];

const Instruction = (props) => {
  const hasRan = useRef(false);
  const { control, showSidebar, fetchData, isToken, setShowSidebar } =
    useGlobalContext();
  const { state } = useLocation();

  const [stateFlag, setStateFlag] = useState({ flag: false, singleItem: [] });

  useEffect(() => {
    const { status, token } = isToken();
    if (!hasRan.current) {
      if (status) fetchData(token);
      hasRan.current = true;
    }
  }, [fetchData, isToken]);

  const loadState = useCallback(() => {
    setStateFlag({
      flag: state?.flag,
      singleItem: state?.singleItem,
    });
  }, [state?.flag, state?.singleItem]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  return (
    <Container background="#006064" imageurl={bgImg}>
      <VerticalSide />
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaArrowRight />
      </Button>
      <Sidebar />
      <Main>
        <div className="instruct">
          <div className="left">
            {!stateFlag.flag && (
              <p style={{ fontSize: "10px", color: "darkred" }}>
                Registered Device(s) ConnectID
              </p>
            )}
            {stateFlag.flag ? (
              <>
                <div className="img">
                  <img
                    src={
                      stateFlag.singleItem[0].category === "doorLock"
                        ? doorImg[0]
                        : doorImg[1]
                    }
                    alt="itemDetail"
                  />
                </div>
                <p>{stateFlag.singleItem[0].name}</p>
                <div className="connect-ids">
                  <ClickToCopy item={stateFlag.singleItem} />
                </div>
              </>
            ) : (
              <div className="connect-ids">
                <ClickToCopy {...control} />
              </div>
            )}
          </div>
          <div className="right">
            <InstructionContainer>
              <InstructionInfo>
                <div className="mode">
                  <p>Setting Up Mode</p>
                </div>

                <ol>
                  <li>Turn on the device</li>
                  <li>
                    Search for <cite>doorLock or spyCam</cite> <b>hotspot</b>{" "}
                    and connect to it
                  </li>
                  <li>Copy below url into your browser and press enter</li>
                  <li>
                    {" url=>"}
                    <span
                      style={{
                        background: "white",
                        padding: "0 15px",
                        color: "#000",
                      }}
                    >
                      http://192.168.4.1
                    </span>{" "}
                    &nbsp; {`${"->"}`} a form will pop up
                  </li>
                  <li>Enter your router details into the form that pops up</li>
                  <li>Copy connectID from list of registered device below </li>
                  <li>
                    Paste it into the popped form <b>connectID</b> section
                  </li>
                  <li>
                    Verify all info and click <b>Program</b>
                  </li>
                </ol>

                <div className="mode">
                  <p>Pro Tip</p>
                </div>

                <ul>
                  <li>If the above setting was successful</li>
                  <li>The device will automatically restarts itself</li>
                  <li>This is valid, to use the provided credentials</li>
                  <li>Ensure your router can communicate over the internet</li>
                  <li>Static green LED indicate device connected to WiFi</li>
                  <li>Blinking LED indicate connection established</li>
                  <li>
                    If the device is away from configured router, #2 begins{" "}
                  </li>
                </ul>
              </InstructionInfo>
            </InstructionContainer>
          </div>
        </div>
      </Main>
    </Container>
  );
};

export default Instruction;
