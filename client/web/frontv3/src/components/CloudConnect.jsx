import React, { useState, useEffect, useCallback } from "react";
import AWSIoTData from "aws-iot-device-sdk";
import AWSConfiguration from "../aws-iotcore-configuration";
import { AWS } from "aws-sdk"; // Import for CognitoIdentityServiceProvider

const arrayRemove = (arr, value) => {
  return arr.filter((item) => item !== value);
};

const CloudConnect = ({ item }) => {
  // ALLOW USER TO SUBSCRIBE TO MQTT TOPICS
  const [desiredSubscriptionTopic, setDesiredSubscriptionTopic] = useState("#");
  const [desiredPublishTopic, setDesiredPublishTopic] = useState("0000");
  const [desiredPublishMessage, setDesiredPublishMessage] = useState(
    `{ "message": "Hello, world!" }`
  );
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  // isConnected and mqttClient strictly used for publishing;
  // Subscriptions are instead handled in child MQTTSubscription components
  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();

  useEffect(() => {
    connectToAwsIot();
  }, []); // the empty [] ensures only run once

  // The logic below create a new array of video and sensor connectID for parallel mqtt subscription

  /** GPT 3.5 and me */
  const subscribeStack = (arrObj) => {
    return arrObj.flatMap((subscriber) => {
      return subscriber.dbName.includes("spyCam")
        ? subscriber.dbName
        : [
            subscriber.dbName.replace("/", "/sensor/"),
            subscriber.dbName.replace("/", "/ack/"),
          ];
    });
  };

  /** helper method to publish data */
  const connectToAwsIot = async () => {
    // This connection/function is only for publishing messages;
    // Subscriptions each get their own child object with separate connections.

    // mqtt clients require a unique clientId; we generate one below
    let clientId = "smartlock-" + Math.floor(Math.random() * 100000 + 1);

    // get credentials using CognitoIdentityServiceProvider from aws-sdk v3
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider({
        region: AWSConfiguration.region,
      });
    const currentCredentials = await cognitoIdentityServiceProvider
      .getCurrentCredentials()
      .promise();

    // Extract accessKeyId, secretKey, and sessionToken
    const essentialCredentials = {
      accessKeyId: currentCredentials.Credentials.AccessKeyId,
      secretAccessKey: currentCredentials.Credentials.SecretAccessKey,
      sessionToken: currentCredentials.Credentials.SessionToken,
    };

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

    console.log(
      "Publisher trying to connect to AWS IoT for clientId:",
      clientId
    );

    // On connect, update status
    newMqttClient.on("connect", function () {
      setIsConnected(true);
      console.log("Publisher connected to AWS IoT for clientId:", clientId);
    });

    // update state to track mqtt client
    setMqttClient(newMqttClient);
  };

  const removeSubscription = (topic) => {
    // This function is passed to child components
    setSubscribedTopics(arrayRemove(subscribedTopics, topic));
  };

  const handleSubscriptionRequest = (e) => {
    // stop submit button from refreshing entire page
    e.preventDefault();
    if (subscribedTopics.includes(desiredSubscriptionTopic)) {
      console.log(
        `You are already subscribed to topic '${desiredSubscriptionTopic}'!`
      );
    } else {
      setSubscribedTopics(subscribeStack(item));
      console.log(`Subscribed to topics '${desiredSubscriptionTopic}'!`);
    }
  };

  const handlePublishRequest = (e) => {
    // stop submit button from refreshing entire page
    e.preventDefault();
    mqttClient.publish(desiredPublishTopic, desiredPublishMessage);
  };

  return (
    <div className="CloudConnect">
      <div className="thin-border">
        <b>Publisher status:</b> {isConnected ? "connected" : "Not connected"}
        <br />
        <br />
        <form onSubmit={handlePublishRequest}>
          <b>Publish to Topic:</b>
          <br />
          <input
            value={desiredPublishTopic}
            onChange={(e) => setDesiredPublishTopic(e.target.value)}
            placeholder="IoT Topic"
            type="text"
            name="desiredPublishTopic"
            required
          />
          <br />
          <br />
          <b>Publish Message:</b>
          <br />
          <input
            value={desiredPublishMessage}
            onChange={(e) => setDesiredPublishMessage(e.target.value)}
            placeholder="IoT Topic"
            type="text"
            name="desiredPublishTopic"
            required
          />
          <br />
          <br />
          <button type="submit">Publish</button>
          <br />
        </form>
      </div>
      <br />
      <div className="thin-border">
        <form onSubmit={handleSubscriptionRequest}>
          <b>Subscribe to Topic:</b>
          <br />
          <input
            value={desiredSubscriptionTopic}
            onChange={(e) => setDesiredSubscriptionTopic(e.target.value)}
            placeholder="IoT Topic"
            type="text"
            name="desiredSubscriptionTopic"
            required
          />
          <button type="submit">Subscribe</button>
          <br />
          <br />
        </form>
        <b>Subscriptions:</b> <br />
        {subscribedTopics.map((topic) => {
          return (
            <MQTTSubscription
              key={topic}
              topic={topic}
              removeSubscription={removeSubscription}
            />
          );
        })}
      </div>
    </div>
  );
};

//######################################################################################
const MQTTSubscription = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();
  const [messages, setMessages] = useState([]);

  const connectToAwsIot = useCallback(async () => {
    // mqtt clients require a unique clientId; we generate one below
    let clientId = "mqtt-explorer-" + Math.floor(Math.random() * 100000 + 1);

    // Get credentials using CognitoIdentityServiceProvider from aws-sdk v3
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider({
        region: AWSConfiguration.region,
      });
    const currentCredentials = await cognitoIdentityServiceProvider
      .getCurrentCredentials()
      .promise();

    // Extract accessKeyId, secretKey, and sessionToken
    const essentialCredentials = {
      accessKeyId: currentCredentials.Credentials.AccessKeyId,
      secretKey: currentCredentials.Credentials.SecretAccessKey,
      sessionToken: currentCredentials.Credentials.SessionToken,
    };

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
    console.log(
      "Subscriber trying to connect to AWS IoT for clientId:",
      clientId
    );

    // On connect, update status and subscribe
    newMqttClient.on("connect", function () {
      setIsConnected(true);
      newMqttClient.subscribe(props.topic);
      console.log("Connected to AWS IoT for clientId:", clientId);
      console.log(`Subscribed to ${props.topic}`);
    });

    // Add event handler for received messages
    newMqttClient.on("message", function (topic, payload) {
      let myDate =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      let newMessage = `${myDate} - topic '${topic}' - \n ${payload.toString()}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage);
    });

    // Update state to track mqtt client
    setMqttClient(newMqttClient);
  }, [setMqttClient, props.topic]);

  useEffect(() => {
    connectToAwsIot();
    // Cleanup function (optional): Unsubscribe on component unmount
    return () => {
      if (mqttClient) {
        mqttClient.end(false);
      }
    };
  }, [connectToAwsIot]);

  const handleUnsubscribe = (e) => {
    // Stop submit button from refreshing entire page
    e.preventDefault();

    // End subscription
    mqttClient.end(false);
    setIsConnected(false);

    // Remove subscription from parent component
    props.removeSubscription(props.topic);
  };

  return (
    <div className="MQTTSubscription">
      Topic Filter: "{props.topic}" (
      {isConnected ? "connected" : "not connected"})
      <form onSubmit={handleUnsubscribe}>
        <button type="submit">Unsubscribe</button>
      </form>
      <br />
      <br />
      {messages.map((message, index) => {
        return (
          <li key={index} className="markdown">
            {message}
          </li>
        );
      })}
    </div>
  );
};

export default CloudConnect;
