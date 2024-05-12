import React, { useCallback, useEffect, useState } from "react";
import { Form, FormField, GroupForm } from "../theme/theme";

const ClickToCopy = ({ item }) => {
  const [vitals, setVitals] = useState(item);

  function copyGasToClipboard(e, id) {
    const newVitals = [...vitals]; // Create a copy of the vitals array
    const index = newVitals.findIndex((name) => name._id === id);

    if (index > -1) {
      newVitals[index].copy = "Copied";
      setVitals(newVitals); // Update state with the modified array
      navigator.clipboard.writeText(newVitals[index].dbName);
      e.target.focus();
    }
  }

  const delay = useCallback(
    async (time) => {
      await new Promise((resolve) => {
        setTimeout(resolve, time);
        setVitals(item);
      });
    },
    [setVitals, item]
  );

  useEffect(() => {
    delay(1000);
  }, [delay]);

  return (
    <Form>
      {vitals && vitals.map((connectId, index) => {
        return (
          <GroupForm key={index}>
            <FormField
              type="text"
              value={connectId.dbName}
              onChange={(e) => e.target.value}
              required
            />
            <span onClick={(e) => copyGasToClipboard(e, connectId._id)}>
              {connectId.copy ? connectId.copy : "copy"}
            </span>
          </GroupForm>
        );
      })}
    </Form>
  );
};

export default ClickToCopy;
