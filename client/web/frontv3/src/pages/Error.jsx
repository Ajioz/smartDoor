import React from "react";
import styled from "styled-components";
import { Backbtn } from "../theme/theme";
import pageNotFound from "../images/page-not-found.png";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  max-width: 1440px;
`;

const Container = styled.div`
  position: absolute;
  width: 786px;
  min-width: 200px;
  top: 50%;
  left: 50%;
  padding: 0 2%;
  margin: 0 auto;
  transform: translate(-50%, -50%);
  text-align: center;
  @media only screen and (max-width: 560px) {
    width: "100%";
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 400px;
  object-fit: contain;
  @media only screen and (max-width: 600px) {
    height: "auto";
  }
`;

const Error = () => {
  const navigate = useNavigate();
  return (
    <Wrap>
      <Container>
        <Image src={pageNotFound} alt={pageNotFound} />
        <p
          variant="body1"
          fontSize={{ mobile_0: 30, mobile_393: 40 }}
          fontWeight={400}
          mb={{ mobile_0: 0, mobile_393: 1 }}
        >
          Nothing to see here
        </p>
        <div
          width={{ mobile_0: "100%", tablet_600: "419px" }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          margin={"0 auto"}
        >
          <p variant="caption" fontSize={12} fontWeight={400} mb={1}>
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </p>
        </div>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Backbtn width="60%" onClick={() => navigate("/")}>
            <FaArrowLeft /> take me back to homepage
          </Backbtn>
        </section>
      </Container>
    </Wrap>
  );
};

export default Error;
