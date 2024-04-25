import React, { useEffect, useRef } from "react";
import {
  Button,
  Container,
  HOC,
  Header,
  InstructionContainer,
  InstructionInfo,
  Main,
  VerticalSide,
} from "../theme/theme";
import { FaArrowRight } from "react-icons/fa";
import { useGlobalContext } from "../context/context";
import Sidebar from "../components/Sidebar";

const Instruction = () => {
  const hasRan = useRef(false);
  const { control, showSidebar, fetchData, isToken, setShowSidebar } =
    useGlobalContext();

  useEffect(() => {
    const { status, token } = isToken();
    if (!hasRan.current) {
      if (status) fetchData(token);
      hasRan.current = true;
    }
  }, [fetchData, isToken]);

  return (
    <Container>
      <VerticalSide />
      <Button onClick={() => setShowSidebar(!showSidebar)}>
        <FaArrowRight />
      </Button>
      <Sidebar />
      <Main>
        <div className="instruct">
          <div className="left">
            left
            {control.item.map((item, index) => {
              return (
                <HOC key={index}>
                  <p>copy: {item.dbName}</p>
                </HOC>
              );
            })}
          </div>
          <div className="right">
            right
            <InstructionContainer>
              <InstructionInfo>
              <Header>
                <h3>Instructions</h3>
              </Header>
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
