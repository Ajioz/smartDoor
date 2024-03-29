# This Project is about developing DOOR SECURITY

Door Security is an open source project intended to secure home, office and public structure!

This repo contains three major folders, viz.

<ol>
    <li>firmware</li>
    <li>client</li>
    <li>gen_demo_sample</li>
</ol>

## The Firmware Directory

This directory contains cpp code written in Arduino.

Four sub-directory are contain there in, viz.

<ol>
    <li><strong>esp32Camera</strong>: Dedicated for camera functions</li>
    <li><strong>keypad_fingerSensor_v1</strong>: Dedicated for keypad and fingerprint functions, a version 1 </li>
    <li><strong>keypad_fingerSensor_v1</strong>: Dedicated for keypad and fingerprint functions, a version 2.  This version contains finger-print programmable functionality, however, the program function was commented out due to mcu insufficient flash memory, to have both the keypad and fingerprint in program mode all blended together, an mcu with larger flash memory is required.</li>
    <li><strong>smart_door</strong>: Dedicated to integrate all necessary firmware code together as a <em>single entity</em></li>
</ol>

## The Client Directory

`Key things to note`

The client is built with ReactJs and react-native for:

<ol>
    <li>Web</li>
    <li>Android, and</li>
    <li>iOS devices</li>
</ol>

_Web and mobile App would contain keypad, which may replace hardware keypad, however they would have the soft-keypad to access the home, even if in the future it won't replace the hardware keypad_

## The gen_demo_sample Directory

This sub directory contains generated image of the finished, though not completely exact, but close to finish.

## Pro Tip.

Feature of the security door includes but not limited to:

<ul>
    <li>Proximity sensor (LD2410) to detect the presence of human and activate, the fingerprint reader, surveillance CAM, create a vibration alert of the monitoring device (mobile phone)</li>
    <li>Keypad for input password to access the home</li>
    <li>Camera for surveillance, which would only be active when human is detected</li>
    <li>AWS IoT core serverless for remote control and monitoring</li>
</ul>

In the future this code will be extended to contain, latest tech as found needed for this solution

Author : [Ajiroghene Sunny](https://github.com/Ajioz)

Feel free to indicate interest as we build along...
