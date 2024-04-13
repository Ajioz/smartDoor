import React from "react";
import email from "../images/confirmed.jpg";
import Confirmation from "../components/ConfirmBox";

const Status = () => {
  return (
    <>
      <Confirmation
        imgType={true}
        img={email}
        msg={"Email Already Confirmed, no further action required!"}
        action={"Login"}
      />
    </>
  );
};

export default Status;
