import React, { useState } from "react";
import { Form, FormField, FormGroup } from "../theme/theme";

const ClickToCopy = ({item}) => {
  const [copyGasSuccess, setCopyGasSuccess] = useState("copy");
  const [copySnifferSuccess, setCopySnifferSuccess] = useState("copy");


  function copyGasToClipboard(e) {
    document.execCommand("copy");
    e.target.focus();

    setCopyGasSuccess("Copied!");
  }
  function copySnifferToClipboard(e) {
    document.execCommand("copy");
    e.target.focus();
    setCopySnifferSuccess("Copied!");
  }

  return (
    <Form>
      <p style={{ fontSize: "10px", color: "darkred" }}>
        Registered Device(s) ConnectID
      </p>
      {item?.map((connecId, index) => (
        <FormGroup key={index}>
          <FormField
            type="text"
            value={connecId.dbName}
            required
          />
          <span onClick={copyGasToClipboard}>{copyGasSuccess}</span>
          <br />
        </FormGroup>
      ))}
    </Form>
  );
};

export default ClickToCopy;
