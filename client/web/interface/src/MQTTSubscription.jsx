import React, { useState, useEffect } from "react";
import AWSConfiguration from "./aws-iot-configuration.js";
import { Auth } from "aws-amplify";
import AWSIoTData from "aws-iot-device-sdk";
import Display from "./Display.jsx";

const MQTTSubscription = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();
  // const [message, setMessage] = useState({ id: "", msg: "" });
  const [value, setValue] = useState({
    id: "eGas/smartGas1709126023524661",
    msg: "",
  });

  //  Object to store sensor values
  const listComp = [
    { id: 1, dbName: "eGas/smartGas1709126023524661" },
    { id: 2, dbName: "eGas/officer1709126031363933" },
  ];

  // Add a variable to track the mounted state
  let isMounted = true;

  // Use the useEffect hook to update the mounted state
  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    connectToAwsIot();
  }, []); // the "[]" causes this to execute just once

  async function connectToAwsIot() {
    // mqtt clients require a unique clientId; we generate one below
    let clientId = "mqtt-explorer-" + Math.floor(Math.random() * 100000 + 1);

    // get credentials and, from them, extract key, secret key, and session token
    // Amplify's auth functionality makes this easy for us...
    let currentCredentials = await Auth.currentCredentials();
    let essentialCredentials = Auth.essentialCredentials(currentCredentials);

    // Create an MQTT client
    let newMqttClient = AWSIoTData.device({
      region: AWSConfiguration.region,
      host: AWSConfiguration.host,
      clientId: clientId,
      protocol: "wss",
      maximumReconnectTimeMs: 8000,
      debug: true,
      accessKeyId: essentialCredentials.accessKeyId,
      secretKey: essentialCredentials.secretAccessKey,
      sessionToken: essentialCredentials.sessionToken,
    });

    // On connect, update status
    newMqttClient.on("connect", function () {
      newMqttClient.subscribe(props.topicz);
      setIsConnected(true);
    });

    // add event handler for received messages
    newMqttClient.on("message", async function (topic, payload) {
      let rawMessage = payload.toString();
      let parseMessage = JSON.parse(rawMessage);
      if (parseMessage.sensor_a0) {
        if (isMounted) {
          setValue({ id: topic, msg: parseMessage.sensor_a0 });
        }
      } else {
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
          if (isMounted) {
            setValue({ ...value, id: topic, msg: rawMessage });
          }
        });
      }
    });
    // update state to track mqtt client
    setMqttClient(newMqttClient);
  }

  function handleUnsubscribe(e) {
    // stop submit button from refreshing entire page
    e.preventDefault();
    // end subscription; I think this could be added to the return() of the useEffect(), as an "onUnmount" handler,
    // but I received an erropr when I tried it. I might be doing something wrong but for now, it works with the commands
    // below...
    mqttClient.end(false);
    setIsConnected(false);
    // remove subscription from parent component, thus killing this component...
    props.removeSubscription(props.topicz);
  }

  return (
    <div className="MQTTSubscription">
      <h4>
        Status: "{props.sofTopicDisplay}" (
        {isConnected ? "connected" : "not connected"})
      </h4>
      <form onSubmit={handleUnsubscribe}>
        {isConnected && (
          <button className="btn" type="submit">
            Unsubscribe
          </button>
        )}
      </form>
      {listComp.map((item) => (
        <Display
          id={item.dbName}
          target={value.id}
          message={value.msg}
          key={item.id}
        />
      ))}
    </div>
  );
};

export default MQTTSubscription;
