# aws-amplify-react-iot-pub-sub-using-cp

## Overview

This is a very basic AWS Amplify + AWS IoT Javascript SDK + React project that combines basic authentication via Amazon Cognito with AWS IoT Core pubsub via the aws-iot-device-sdk

(1) allows user to signup, signin and signout
(2) when user signs up, it creates Cognito user pool and Identity pool.
(3) when a user signs-in, authenticate via Cognito, it creates IoT policy and attaches with the cognito identity and allows the user perform pub/sub using that identity
(4) subscribe to one or more topics and
(5) publish messages to a user-specified topic.

The functionality is similar to (though simpler, less pretty) version of the "Test" tab in the AWS IoT console:

## Prerequisites

Refer: https://docs.amplify.aws/start/getting-started/installation/q/integration/js

1. Before we begin, make sure you have the following installed:
   Node.js v12.x or later

   ```sh
      node -v
   ```

   npm v5.x or later

   ```sh
      npm -v
   ```

   git v2.14.1 or later

   ```sh
      git --version
   ```

2. Install amplify cli
   npm install -g @aws-amplify/cli
3. Create IAM user in your AWS account

   a. Login to IAM console
   b. Go to "Users" and click "Add User", select both access types (copy the access key, secret key and the console password)

4. Configure Amplify to use your AWS account

   amplify configure

   Example:

   Sign in to your AWS administrator account:
   https://console.aws.amazon.com/
   Press Enter to continue

   Ignore the browser and hit enter in the shell

   Specify the AWS Region: us-east-1
   Specify the username of the new IAM user:
   ? user name: <iam user your created above>
   Complete the user creation using the AWS console
   https://console.aws.amazon.com/iam/home?region=us-east-1#/users$new?step=final&accessKey&userNames=iotsampleappuser&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess
   Press Enter to continue

   Enter the access key of the newly created user:

   ? accessKeyId: <enter access key copied from above step>
   ? secretAccessKey: <enter secret key copied from above step>

   This would update/create the AWS Profile in your local machine
   ? Profile Name: <profile name> #copy the profile name you will need it later

## Screenshots


![signup](./images/signup.png)
![login](./images/login.png)
![demo1](./images/demo1.png)
![demo2](./images/demo2.png)

## Local Deployment (website on localhost)

1. Clone the repo

```sh
git clone https://github.com/aws-samples/aws-amplify-react-iot-pub-sub-using-cp
```

2. move to project root

```sh
cd aws-amplify-react-iot-pub-sub-using-cp
```

3. Install dependencies

```sh
npm install
```

2. Initialize Amplify

```sh
amplify init
```

Note: It is recommended to run this command from the root of your app directory
? Do you want to use an existing environment? Yes
? Choose the environment you would like to use: (Use arrow keys)
❯ test
? Select the authentication method you want to use: AWS profile
? Please choose the profile you want to use sampleappprofile

3. Push / create your backend

```
amplify push
```

? Are you sure you want to continue? Yes

4. Navigate to the [AWS IoT web console](https://console.aws.amazon.com/iot/home?) and:

1. Click **Settings** in the lower left, and copy your **Endpoint** to a text file; you'll need this later. It would look similar to below:


    ```
    a2p5nqoyw6nu1b-ats.iot.us-east-1.amazonaws.com
    ```

5. Navigate to the [Cognito Console](https://console.aws.amazon.com/cognito/home?) and:

1. Click **Manage Identity Pools** (not user pools)
1. Click the pool name for your app, it should look similar to `cognito81d9f49f_identitypool_81d9f49f_test`
1. Copy the **Sample Code** link on left, and in the code example, copy your **Identity Pool ID** to a text file; you'll need this later. It will look like `us-east-1:bf43e8cf-2a9d-410b-ab6b-3da084908fa7`

1. Open `src/aws-iot-configuration.js` and:

1. set the **endpoint** to the value from above. Be sure to prefix the endpoint value with `wss://` (for websockets) and add a suffix of `/mqtt`, as in the example below.

1. Set the **host** to the endpoint value as-is.

1. Specify your AWS **region**

1. Set the pool ID to the Cognito Pool ID you gathered from above.

```js
// src/aws-iot-configuration.js
var awsIotConfiguration = {
  endpoint: "wss://a2p524qoyw6nu1b-ats.iot.us-east-1.amazonaws.com/mqtt",
  region: "us-east-1",
  poolId: "us-east-1:bf52e8cf-2a9d-410b-ab6b-3da084908fa7",
  host: "a2p524qoyw6nu1b-ats.iot.us-east-1.amazonaws.com",
};
```

3. Open `src/aws-iotcore-configuration.js` and:
   1. set the **endpoint** Iot control plane endpoint for the region
   2. specify your AWS **region**
   3. specify policy to attach to the authenticated cognito identity

```js
// src/aws-iotcore-configuration.js
var awsIotConfiguration = {
  endpoint: "https://iot.us-east-1.amazonaws.com",
  region: "us-east-1",
  apiVersion: "2015-05-28",
  policy:
    '{"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": [ "iot:Subscribe" ], "Resource": ["arn:aws:iot:us-east-1:123456789012:topicfilter/*"]},{"Effect": "Allow","Action": [ "iot:Connect" ],"Resource": ["arn:aws:iot:us-east-1:123456789012:client/*"] },{"Effect": "Allow","Action": [ "iot:Publish","iot:Receive" ],"Resource": ["arn:aws:iot:us-east-1:123456789012:topic/*"]}]}',
};
```

7. Navigate to the [AWS IAM Console](https://console.aws.amazon.com/iam/home?#/roles) and search for the IAM role for your authorized Cognito Identity pool users.
   It will have a name similar to `arn:aws:iam::123456790:role/amplify-awsamplifyreacttempl-test-115859-authRole` and have a creation time that matches the date your deploying this project. Be sure to select the `authRole`, not the `unauthRole`

1. Click **Attach Policies**
1. Search for and select the `AWSIoTFullAccess` policy

1. Run the website locally

```
npm run start
```

5. Navigate to `localhost:3000`, sign up, and test!
