import React from "react";
import { Footer, Header, InstructionInfo } from "../theme/theme";

const Instruction = () => {
  return (
    <>
      <Header>
        <h3>Instructions</h3>
      </Header>

      <InstructionInfo>
        <div className="mode">
          <p>Setting Up Mode</p>
        </div>

        <ol>
          <li>Turn on the device</li>
          <li>
            Search for <cite>doorLock or spyCam</cite> <b>hotspot</b> and
            connect to it
          </li>
          <li>Copy below url into your browser and press enter</li>
          <li>
            {" url=>"}
            <span style={{ background: "white", padding: "0 15px" }}>
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
          <li>If the device is away from configured router, #2 begins </li>
        </ul>
      </InstructionInfo>
      <Footer>
        <h3>Proudly Ajiozi</h3>
      </Footer>
    </>
  );
};

export default Instruction;
