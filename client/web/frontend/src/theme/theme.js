import styled from "styled-components";
import bgImg from "../images/bg-intro-desktop.png";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${bgImg});
  background-color: ${(prop) => prop.background};
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;

  /* Tablet */
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    overflow-y: scroll;
  }
`;

export const QuickInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  /* Tablet */
  @media only screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

export const ContentWrapper = styled.div`
  width: 70%;
  color: #fff;

  h1 {
    font-weight: bold;
    font-size: 50px;
    letter-spacing: -0.52px;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
    line-height: 26px;
    font-weight: 500;
    margin-right: 10px;
  }

  /* TABLET */
  @media only screen and (max-width: 768px) {
    h1 {
      letter-spacing: -0.29px;
      text-align: center;
      padding: 0 12px;
      margin-bottom: 20px;
    }

    p {
      text-align: center;
    }
  }

  /* MOBILE */
  @media only screen and (max-width: 460px) {
    h1 {
      font-size: 28px;
      letter-spacing: -0.29px;
      text-align: center;
      padding: 0 12px;
      margin-bottom: 20px;
    }

    p {
      text-align: center;
    }
  }
`;

export const Wrapper = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  /* TABLET */
  @media only screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  /* MOBILE */
  @media only screen and (max-width: 460px) {
    /* padding: 10px; */
  }
`;

export const FormWrapper = styled.div`
  width: 80%;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  padding: 0 0px 10px 0;

  /* LAPTOP */
  @media only screen and (max-width: 1115px) {
    width: 100%;
  }
`;

export const FormHeader = styled.div`
  border-radius: 10px 10px 0 0;
  background-color: #eee;
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-bottom: 20px;
  h3 {
    font-family: monospace;
    font-size: 25px;
  }
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: #777;
  font-family: "Raleway", sans-serif;
  font-size: 0.8em;
  margin: 0.5em 0;
  position: relative;
`;

export const Input = styled.input`
  outline: none;
  width: 35ch;
  height: 40px;
  padding: 5px 25px;
  /* margin: 0 auto; */
  /* background-color: #3d3b48; */
  font-size: 16px;
  font-weight: 200;
  color: #3d3b48;
  border-radius: 30px;
  border: ${(props) => props.border || "1px solid #4299e1"};
`;

export const ClaimBtn = styled.button`
  width: 40%;
  height: 45px;
  background-color: #38cc8b;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 0.27px;
  line-height: 20px;
  border-radius: 30px;
  border: none;
  box-shadow: 0px 2px 0px #70c09d;
  cursor: pointer;
  margin: 0 0 -10px 0;
`;

export const Button = styled.button`
  position: fixed;
  top: 2rem;
  left: 3rem;
  font-size: 2rem;
  background: transparent;
  border-color: transparent;
  color: hsl(205, 78%, 60%);
  transition: all 0.3s linear;
  cursor: pointer;
  animation: bounce 2s ease-in-out infinite;
`;

export const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
`;

export const CloseBtn = styled.button`
  font-size: 1.75rem;
  background: transparent;
  border-color: transparent;
  color: hsl(205, 78%, 60%);
  transition: all 0.3s linear;
  cursor: pointer;
  color: hsl(360, 67%, 44%);
  margin-top: 0.2rem;
  &:hover {
    color: hsl(360, 71%, 66%);
  }
`;

export const Mylink = styled.ul`
  list-style-type: none;
`;

export const SocialIcon = styled.ul`
  justify-self: center;
  display: flex;
  padding-bottom: 2rem;
`;

export const SocialIconTag = styled.a`
  font-size: 1.5rem;
  margin: 0 0.5rem;
  color: hsl(205, 78%, 60%);
  transition: all 0.3s linear;
  &:hover {
    color: hsl(205, 86%, 17%);
  }
`;

export const Linka = styled.a`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  text-transform: capitalize;
  padding: 1rem 1.5rem;
  color: hsl(209, 34%, 30%);
  transition: all 0.3s linear;
  letter-spacing: 0.1rem;
  &:hover {
    background: hsl(210, 36%, 96%);
    color: hsl(211, 39%, 23%);
  }
`;

export const Logo = styled.img`
  justify-self: center;
  height: 40px;
`;

export const Info = styled.p`
  font-size: 11px;
  font-weight: bold;
  color: #bab7d4;
  line-height: 26px;
  margin: 0;

  /* MOBILE */
  @media only screen and (max-width: 460px) {
    margin-top: 10px;
    text-align: center;
    line-height: 15px;
  }
`;

export const Adhoc = styled.span`
  cursor: pointer;
  color: #ff7979;
`;

export const Text = styled.p`
  color: #fc8181;
  font-size: 0.75rem;
  text-align: left;
  margin-top: 0.25rem;
`;
