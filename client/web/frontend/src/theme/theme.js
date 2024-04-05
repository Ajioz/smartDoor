import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${(prop) => prop.imageUrl});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: ${(prop) => prop.background || "#212121"};
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;

  /* Tablet */
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    overflow-y: scroll;
  }

  /* Mobile */
  @media only screen and (max-width: 568px) {
    flex-direction: column;
    overflow-y: scroll;
    margin: 20 auto;
    background-size: cover;
  }
`;

export const DashboardMain = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;
export const UpperSection = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 300px;
  background-color: inherit;
  padding: 20px 0px;
`;

export const Notify = styled.section`
  width: 30%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #9e9e9e;

  img {
    color: #fff;
    width: 70px;
    margin-top: 20px;
  }

  h3 {
    color: #fff;
    font-size: 20px;
  }
`;

export const ChipContainer = styled.section`
  background-color: inherit;
  width: 30%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Circle = styled.section`
  height: 65px;
  width: 65px;
  border-radius: 50%;
  background-color: #1a237e;
  border: 12px solid #bbdefb;
`;

export const Rectangle = styled.section`
  height: 40px;
  width: 78%;
  margin: -5px;
  background-color: #bbdefb;
  display: flex;
  justify-content: center;
  align-items: center;
  h5 {
    font-family: monospace;
    margin-left: -20px;
    font-weight: 300;
    font-size: 18px;
    color: #424242;
  }
`;

export const LowerSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 900px;
  background-color: inherit;
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
  @media only screen and (max-width: 560px) {
    margin: 0;
    padding-top: 10px;
    padding-bottom: -10px;
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
  @media only screen and (max-width: 560px) {
    width: 90%;
    overflow-y: scroll;
    h1 {
      font-size: 28px;
      letter-spacing: -0.29px;
      text-align: center;
      padding: 0;
      margin: 10px 0 0 0;
    }
    p {
      text-align: center;
      margin-top: 0;
      padding-bottom: 0px;
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
  width: 75%;
  height: 40px;
  padding: 5px 25px;
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
  @media only screen and (max-width: 560px) {
    width: fit-content;
    width: 50%;
  }
`;

export const VerticalSide = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 60px;
  height: 100vh;
  background-color: #263238;
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 1rem;
  box-shadow: hsl(360, 67%, 44%);
`;
export const LinkContainer = styled.li`
  margin-left: -20px;
  margin-right: 10px;
`;

export const Button = styled.button`
  position: fixed;
  top: 2rem;
  left: 0.2rem;
  font-size: 2rem;
  background: transparent;
  border-color: transparent;
  color: #bdbdbd;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  margin-left: -20px;
  margin-right: 10px;
`;

export const CloseBtn = styled.button`
  font-size: 1.75rem;
  background: transparent;
  border-color: transparent;
  color: #bdbdbd;
  cursor: pointer;
  margin-top: 0.2rem;
  &:hover {
    color: #fff;
  }
`;

export const Mylink = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
`;

export const SocialIcon = styled.ul`
  justify-self: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.2rem;
  width: 80%;
`;

export const SocialIconTag = styled.a`
  font-size: 1.5rem;
  margin: 0 0.5rem;
  color: ${(props) => props.color};
  &:hover {
    color: #fff;
  }
`;

export const Linka = styled.a`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  text-transform: capitalize;
  padding: 1rem 0.1rem;
  margin: 1rem 0.5rem;
  color: #e0e0e0;
  letter-spacing: 0.1rem;
  &:hover {
    color: #fff;
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

// Video Styled Components
export const VideoPlayerContainer = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 20px;
`;

export const Video = styled.video`
  width: 100%;
  display: block;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const PlayButton = styled.button`
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
`;

// Keypad Styled Components
export const KeypadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #263238;
  border: 4px solid #ddd;
  border-radius: 50px;
  padding: 10px;
  height: fit-content;
  width: 180px;
`;

export const KeypadButton = styled.button`
  height: 40px;
  width: 40px;
  margin: 5px;
  font-size: 1.2rem;
  border: 2px solid transparent;
  background-color: #00838f;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #333;
    color: #ddd;
  }
`;

export const Display = styled.div`
  margin-top: 20px;
  font-size: 2.5rem;
  color: #fff;
  height: 50px;
`;
