import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

// Define the keyframes for the slide-in effect
const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const NavWrapper = styled.nav`
  background-color: ${(props) => (props.background ? "#64dd17" : "#ff5252")};
  position: fixed; // Changed from relative to fixed to stick at the top
  top: 0;
  width: 100%;
  height: 7vh;
  display: flex;
  animation: ${(props) => (props.animateOut ? slideOut : slideIn)} 0.5s ease-out
    forwards;
`;

const Nav = styled.nav`
  position: relative;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-family: monospace;
  font-weight: bolder;
`;

const Btn = styled.section`
  width: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-family: monospace;
  font-weight: bolder;
  &:hover {
    cursor: pointer;
    color: #333;
  }
`;

const StickyNav = ({ setShow, status, update, flag }) => {
  const [animateOut, setAnimateOut] = useState(false);

  // Function to handle closing the navbar
  const handleClose = () => {
    setAnimateOut(true); // Trigger the slideOut animation
  };

  useEffect(() => {
    // If animateOut is true, set a timeout to remove the navbar after the animation
    if (animateOut) {
      const timer = setTimeout(() => {
        setShow({ status: false });
      }, 500); // Match this duration with your animation duration
      return () => clearTimeout(timer);
    }
  }, [animateOut, setShow]);

  useEffect(() => {
    // Reset the animateOut state when status becomes true
    if (status) {
      setAnimateOut(false);
    }
  }, [status]);

  return (
    <>
      {status && (
        <NavWrapper background={flag} animateOut={animateOut}>
          <Nav>{update}</Nav>
          <Btn>
            <FaTimes onClick={handleClose} />
          </Btn>
        </NavWrapper>
      )}
    </>
  );
};

export default StickyNav;
