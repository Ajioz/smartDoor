import React from "react";
import {
  ChipContainer,
  Notify,
  Circle,
  Rectangle,
  Linka,
} from "../theme/theme";
import human from "../images/human.svg";
import { FaHome } from "react-icons/fa";

export const AlertNotify = (props) => {
  return (
    <Notify>
      {props.status ? (
        <img src={human} alt="Human Crossing" />
      ) : (
        <Linka>
            <FaHome size={"50px" } />
        </Linka>
      )}
      <h3>{props.status ? "Human Detected" : "Human far away"}</h3>
    </Notify>
  );
};

export const Boardchip = () => {
  return (
    <ChipContainer>
      <Rectangle>
        <h5>Dashboard</h5>
      </Rectangle>
      <Circle></Circle>
    </ChipContainer>
  );
};
