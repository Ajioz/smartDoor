import React from "react";
import {
  FaAdjust,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaSignOutAlt,
  FaPlus,
  FaHome,
} from "react-icons/fa";

const logOut = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export const links = [
  {
    id: 1,
    url: "/dashboard",
    text: "Dashboard",
    icon: <FaHome />,
  },
  {
    id: 2,
    url: "/info",
    text: "Instruction",
    icon: <FaAdjust />,
  },
  {
    id: 3,
    url: "/add_doors",
    text: "More Door",
    icon: <FaPlus />,
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
    click: logOut,
    icon: <FaSignOutAlt />,
    target: "",
  },
];
