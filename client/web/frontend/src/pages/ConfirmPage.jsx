import React from "react";
import tick from "../images/tick.gif";
import Confirmation from "../components/ConfirmBox";

const ConfirmPage = () => {
  return (
    <>
      <Confirmation
        imgType={true}
        img={tick}
        msg={"Email Successfully Confirmed!"}
        action={"Login"}
      />
    </>
  );
};

export default ConfirmPage;
