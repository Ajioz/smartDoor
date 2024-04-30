import React, { useState, useEffect, useCallback } from "react";
import Amplify, { Auth } from "aws-amplify";
import awsmobile from "./aws-exports";
import AWSIoTData from "aws-iot-device-sdk";
import AWSConfiguration from "./aws-iot-configuration.js";
Amplify.configure(awsmobile);

const arrayRemove = (arr, value) => {
  return arr.filter((item) => item !== value);
};

const CloudConnect = ({item}) => {
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

  /**Mine */
  // const subscribeStack = (arrObj) => {
  //   return arrObj.map((subscriber) => {
  //     if (subscriber.dbName.includes("spyCam")) return subscriber.dbName;
  //     let sensor = subscriber.dbName.split("/")
  //     sensor[1] = "/sensor/";
  //     return sensor.join("");
  //   });
  // };

  /**Gimini */
  // const subscribeStack = (arrObj) => {
  //   return arrObj.map((subscriber) => {
  //     // Check for "spyCam" first for efficiency
  //     if (subscriber.dbName.includes("spyCam")) return subscriber.dbName;
  //     // Use map to modify the dbName for other subscribers
  //     return subscriber.dbName.replace(/\/([^/]+)\//, "/sensor/");
  //   });
  // };

  /**Meta AI */
  // const subscribeStack = (arrObj) => {
  //   return arrObj.map((subscriber) => {
  //     const dbName = subscriber.dbName;
  //     return dbName.includes("spyCam")
  //       ? dbName
  //       : dbName.replace(/\/[^\/]+/, "/sensor/"); //small error
  //   });
  // };

  /**GPT 3.5 */
  const subscribeStack = (arrObj) => {
    return arrObj.map((subscriber) => {
      return subscriber.dbName.includes("spyCam")
        ? subscriber.dbName
        : subscriber.dbName.replace("/", "/sensor/");
    });
  };

  /** helper method to publish data */
  const connectToAwsIot = async () => {
    // This connection/function is only for publishing messages;
    // Subscriptions each get their own child object with separate connections.

    // mqtt clients require a unique clientId; we generate one below
    let clientId = "smartlock-" + Math.floor(Math.random() * 100000 + 1);

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
    console.log(
      "Subscriber trying to connect to AWS IoT for clientId:",
      clientId
    );
    // On connect, update status
    newMqttClient.on("connect", function () {
      setIsConnected(true);
      newMqttClient.subscribe(props.topic);
      console.log("Connected to AWS IoT for clientId:", clientId);
      console.log(`Subscribed to ${props.topic}`);
    });

    // add event handler for received messages
    newMqttClient.on("message", function (topic, payload) {
      let myDate =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      let newMessage = `${myDate} - topic '${topic}' - \n ${payload.toString()}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage);
    });

    // update state to track mqtt client
    setMqttClient(newMqttClient);
  }, [setMqttClient, props.topic]);

  useEffect(() => {
    connectToAwsIot();
    // return () => {
    //   console.log(`Ended subscription to '${props.topic}'...`); // this gets called when component is destroyed...
    // };
  }, [connectToAwsIot]); // the "[]" causes this to execute just once

  const handleUnsubscribe = (e) => {
    // stop submit button from refreshing entire page
    e.preventDefault();

    // end subscription; I think this could be added to the return() of the useEffect(), as an "onUnmount" handler,
    // but I received an erropr when I tried it. I might be doing something wrong but for now, it works with the commands
    // below...
    mqttClient.end(false);
    setIsConnected(false);

    // remove subscription from parent component, thus killing this component...
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
