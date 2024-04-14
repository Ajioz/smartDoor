import React from 'react'
import ExpiredBox from '../components/ConfirmBox';
import notAllowed from "../images/notAllowed.avif";

const Expired = () => {
  return (
    <ExpiredBox
      imgType={false}
      img={notAllowed}
      msg={"We were unable to find a valid token. Your token may have expired"}
      action={"Send"}
    />
  );
}

export default Expired