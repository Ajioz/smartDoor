import React from 'react'
import Confirmation from '../components/ConfirmBox';
import notAllowed from "../images/notAllowed.avif";

const Expired = () => {
  return (
    <Confirmation
      imgType={false}
      img={notAllowed}
      msg={"We were unable to find a valid token. Your token may have expired"}
      action={"Login"}
    />
  );
}

export default Expired