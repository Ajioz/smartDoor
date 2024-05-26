import React, { useCallback, useEffect, useState } from "react";
import { Form, FormField, GroupForm } from "../theme/theme";

const ClickToCopy = ({ item }) => {
  const [vitals, setVitals] = useState(item);

  function copyGasToClipboard(e, id) {
    const newVitals = [...vitals]; // Create a copy of the vitals array
    const index = newVitals.findIndex((name) => name.id === id);
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

        // item has fixed amount of iterable based on the registered device on user account
        // however, each item has dbName and fName, which we intend to make into separate ite
        // I attempted straight process but could not achieve the purpose, hence I have to adopt th
        // procedural programming approach
        const db_name = item.map((detail) => ({
          dbName: detail.dbName,
        }));

        const newFname = item.filter((name) => name.fName !== "none");

        const new_fname = newFname.map((fname) => ({
          fName: fname.fName,
        }));

        const format = [...db_name, ...new_fname].map((item, index) => ({
          name: item.dbName || item.fName,
          id: index,
        }));

        setVitals(format);
      });
    },
    [setVitals, item]
  );

  useEffect(() => {
    delay(1000);
  }, [delay]);

  return (
    <Form>
      {vitals &&
        vitals.map((connectId, index) => {
          return (
            <GroupForm key={index}>
              <FormField
                type="text"
                value={connectId.name}
                onChange={(e) => e.target.value}
                required
              />
              <span onClick={(e) => copyGasToClipboard(e, connectId.id)}>
                {connectId.copy ? connectId.copy : "copy"}
              </span>
            </GroupForm>
          );
        })}
    </Form>
  );
};

export default ClickToCopy;
