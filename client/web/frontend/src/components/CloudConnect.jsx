import { useState, useEffect, useCallback } from "react";
import Amplify, { Auth } from "aws-amplify";
import awsmobile from "./aws-exports";
import AWSIoTData from "aws-iot-device-sdk";
import AWSConfiguration from "./aws-iot-configuration";
import { toast } from "react-toastify";

Amplify.configure(awsmobile);

const toastParam = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const CloudConnect = ({ item, keypad, setValue, findTopic }) => {
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [mqttClient, setMqttClient] = useState();

  // Add a variable to track the mounted state
  let isMounted = true;

  // Use the useEffect hook to update the mounted state
  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * The logic below create a new array of video and sensor connectID for
   * parallel mqtt subscription -->  GPT 3.5 and me
   */
  const subscribeStack = useCallback(
    (arrObj) => {
      return arrObj.flatMap((subscriber) => {
        return subscriber.dbName.includes("spyCam")
          ? subscriber.dbName
          : [
              subscriber.dbName.replace("/", "/sensor/"),
              subscriber.dbName.replace("/", "/ack/"),
            ];
      });
    },
    [item]
  );

  const isNumeric = (inputString) => {
    // This regex will match any string that contains anything other than digits
    let pattern = /[^0-9]/;
    // If the pattern is found in the inputString, return false
    const state = !pattern.test(inputString);
    return state ? inputString : " ";
  };

  // Helper method to check if keypad has value
  const checkState = (obj) => {
    return Object.entries(obj).every(([key, value]) => {
      return value !== "" && value !== " ";
    });
  };

  useEffect(() => {
    setSubscribedTopics(subscribeStack(item));
  }, [subscribeStack]);

  /** helper method to publish data */
  const connectToAwsIot = async () => {
    try {
      // This connection/function is only for publishing messages;
      // Subscriptions each get their own child object with separate connections.

      // mqtt clients require a unique clientId; we generate one below
      let clientId = "smart-lock-" + Math.floor(Math.random() * 100000 + 1);

      // get credentials and, from them, extract key, secret key, and session token
      // Amplify's Auth functionality makes this easy for us...
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
        newMqttClient.subscribe(subscribedTopics); //added subscribers
        setIsConnected(true);
        console.log(
          "Publisher and subscribers connected to AWS IoT for clientId:",
          clientId
        );
      });

      // add event handler for received messages
      newMqttClient.on("message", async function (topic, payload) {
        try {
          let rawMessage = payload.toString();
          let parseMessage = JSON.parse(rawMessage);
          findTopic(topic, parseMessage);
          console.log(topic, parseMessage);
          if (parseMessage.sensor_a0) {
            if (isMounted) {
              setValue({ id: topic, msg: parseMessage.sensor_a0 });
            }
          } else {
            await new Promise((resolve) => {
              setTimeout(resolve, 2000);
              if (isMounted) {
                setValue({ id: topic, msg: rawMessage });
              }
            });
          }
        } catch (error) {
          console.log(error.message);
        }
      });

      // update state to track mqtt client
      setMqttClient(newMqttClient);
    } catch (error) {
      console.log(error.message);
      return toast.warning(error.message, toastParam);
    }
  };

  useEffect(() => {
    console.log("loading subscribedTopics...");
    if (subscribedTopics.length > 0) {
      console.log("loaded subscribedTopics!");
      connectToAwsIot();
    }
  }, [subscribedTopics]);

  const handlePublishRequest = useCallback(() => {
    const validate = isNumeric(keypad.code);
    mqttClient.publish(keypad.dbName, validate);
  }, [keypad]);

  useEffect(() => {
    checkState(keypad) && handlePublishRequest();
  }, [handlePublishRequest]);

  const checkConnect = useCallback(() => {
    if (isConnected) {
      toast.success("You're in cloud ☁️", toastParam);
      setIsConnected(false);
    }
  }, [isConnected]);

  useEffect(() => {
    checkConnect();
  }, [checkConnect]);

  return null;
};

export default CloudConnect;
