import React from "react";
import tick from "../images/tick.gif";
import ConfirmBox from "../components/ConfirmBox";

const ConfirmPage = () => {
  return (
    <>
      <ConfirmBox
        imgType={true}
        img={tick}
        msg={"Enter The Code You Received"}
        action={"confirm"}
      />
    </>
  );
};

export default ConfirmPage;
