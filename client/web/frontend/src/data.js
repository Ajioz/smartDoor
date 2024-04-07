import React from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaAdjust,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";

export const links = [
  {
    id: 1,
    url: "/instruction",
    text: "Instruction",
    icon: <FaAdjust />,
  },
  {
    id: 2,
    url: "/setting",
    text: "Setting",
    icon: <FaTools />,
  },
];

export const social = [
  {
    id: 1,
    color: "#3b5998",
    url: "https://www.facebook.com",
    icon: <FaFacebook />,
    target: "_blank",
  },
  {
    id: 2,
    color: "#00aced",
    url: "https://www.twitter.com",
    icon: <FaTwitter />,
    target: "_blank",
  },
  {
    id: 3,
    color: "#007bb6",
    url: "https://www.linkedin/in.com",
    icon: <FaLinkedin />,
    target: "_blank",
  },

  {
    id: 6,
    color: "#eee",
    url: "/",
    icon: <FaSignOutAlt />,
    target: "",
  },
];
