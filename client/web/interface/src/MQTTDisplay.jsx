import React, { useState, useEffect, useCallback } from "react";
import Amplify, { Auth } from "aws-amplify";
import awsmobile from "./aws-exports.js";
import AWSIoTData from "aws-iot-device-sdk";
import AWSConfiguration from "./aws-iot-configuration.js";
import MQTTSubscription from "./MQTTSubscription.jsx";
import { useGlobalContext } from "./context.js";

Amplify.configure(awsmobile);

/*
Note - I attempted to use Amplify PubSub for IoT message handling but found that
it lacked adequate functionality to handle multiple subscriptions easily. Therefore, 
I opted to use aws-iot-devide-sdk which proved much easier to use. 
*/

//######################################################################################
// function arrayRemove(arr, value) {
//   // REMOVE SPECIFIC ITEM BY VALUE FROM AN ARRAY
//   return arr.filter(function (ele) {
//     return ele !== value;
//   });
// }

//######################################################################################
let types = [{ name: "Select" }];
let savedItems = [];
let value;

function MQTTDisplay({ setIsConnected, isConnected }) {
  const { saveItem } = useGlobalContext();

  // ALLOW USER TO SUBSCRIBE TO MQTT TOPICS
  const [desiredSubscriptionTopic, setDesiredSubscriptionTopic] = useState("#");
  const [desiredPublishTopic, setDesiredPublishTopic] = useState("#");
  const [desiredPublishMessage, setDesiredPublishMessage] =
    useState(`{"data": "0"}`);
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [sofTopicDisplay, setSofTopicDisplay] = useState("default");
  const [error, setError] = useState(false);

  // isConnected and mqttClient strictly used for publishing;
  // Subscriptions are instead handled in child MQTTSubscription components
  // const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();

  const subscribe = useCallback(() => {
    const subscription = connectToAwsIot();
    if (saveItem.length > 0) {
      savedItems = JSON.parse(saveItem);
      savedItems.map((item) => types.push(item));
    }
    return () => {
      subscription.unsubscribe();
    };
  }, [saveItem]);

  useEffect(() => {
    subscribe();
  }, [subscribe]); // the empty [] ensures only run once

  async function connectToAwsIot() {
    try {
      // This connection/function is only for publishing messages;
      // Subscriptions each get their own child object with separate connections.

      // mqtt clients require a unique clientId; we generate one below
      let clientId =
        "iotcognito-cp-sampleapp-" + Math.floor(Math.random() * 100000 + 1);

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

      // console.log( "Publisher trying to connect to AWS IoT for clientId:", clientId );
      // On connect, update status
      newMqttClient.on("connect", function () {
        setIsConnected(true);
        // console.log("Publisher connected to AWS IoT for clientId:", clientId);
      });
      // update state to track mqtt client
      setMqttClient(newMqttClient);
    } catch (error) {
      // console.log(error);
      setError(true);
    }
  }

  /**
   * Login details
   * @param {
   * username: Ajioz
   * password: Onoriode1!
   * }
   */

  function removeSubscription(topic) {
    // This function is passed to child components
    console.log("leaving topic: ", topic);
    setSubscribedTopics([]);
    setDesiredSubscriptionTopic("#");
    setDesiredPublishTopic("#");
    setSofTopicDisplay("default");
    // setSubscribedTopics(arrayRemove(subscribedTopics, topic));
  }


  function handleSubscriptionRequest() {
    // stop submit button from refreshing entire page
    if (subscribedTopics.includes(desiredSubscriptionTopic)) {
      console.log(`You are already subscribed to topic '${sofTopicDisplay}'!`);
    } else {
      setSubscribedTopics([desiredSubscriptionTopic]);
      console.log(`Subscribed to topic '${sofTopicDisplay}'!`);
    }
  }

  function handlePublishRequest(e) {
    // stop submit button from refreshing entire page
    e.preventDefault();
    if (isConnected) {
      mqttClient.publish(desiredPublishTopic, desiredPublishMessage);
    }
  }

  const handleSubscriptions = (e) => {
    e.preventDefault();
    value = e.target.value;
    removeSubscription(desiredSubscriptionTopic);
    setSofTopicDisplay("");
    setDesiredSubscriptionTopic(value);
    setDesiredPublishTopic(value);
    /*
      filterSubscription(subscribedTopics, value);
      This is an ice breaking logic, which sample the real name of the object...
    */
    setSofTopicDisplay(types.find((item) => item.dbName === value).name);
  };

  const request = useCallback(() => {
    let clear = setTimeout(() => {
      handleSubscriptionRequest();
    }, 1000);
    return () => {
      clearTimeout(clear);
    };
  }, [handleSubscriptionRequest]);

  useEffect(() => {
    request();
  }, [request]);

  return (
    <div className="MQTTDisplay">
      {!error ? (
        <>
          <div className="mqtt-display">
            <p>
              Publisher status:{" "}
              <strong>{isConnected ? "Connected" : "Not Connected"}</strong>
            </p>
            <form className="mqtt-form">
              <label>Publish Message</label>
              <div>
                <div className="form-group">
                  <input
                    className="form-field"
                    value={desiredPublishMessage}
                    onChange={(e) => setDesiredPublishMessage(e.target.value)}
                    placeholder="IoT Topic"
                    type="text"
                    name="desiredPublishTopic"
                    disabled={!isConnected}
                    required
                  />
                  <span onClick={handlePublishRequest} type="submit">
                    Publish
                  </span>
                </div>
              </div>
            </form>
          </div>

          <div className="mqtt-display">
            <form
              // onSubmit={handleSubscriptionRequest}
              className="form-group mqtt-display"
            >
              <h3>Subscribed to {`${sofTopicDisplay}`} Topic</h3>
              <div className="select">
                <select
                  name="type"
                  id="standard-select"
                  onChange={handleSubscriptions}
                  disabled={!isConnected}
                >
                  {types.map((items, index) => (
                    <option
                      key={index}
                      value={
                        items.hasOwnProperty("dbName")
                          ? items.dbName
                          : items.name
                      }
                    >
                      {items.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <h4>Subscriptions:</h4>
            <br />
            {subscribedTopics.length > 0 &&
              subscribedTopics.map((topic) => {
                return (
                  <MQTTSubscription
                    key={topic}
                    topicz={topic}
                    sofTopicDisplay={sofTopicDisplay}
                    removeSubscription={removeSubscription}
                  />
                );
              })}
          </div>
        </>
      ) : (
        <div className="error">
          <p>Something not right with your network!</p>
        </div>
      )}
    </div>
  );
}

export default MQTTDisplay;
