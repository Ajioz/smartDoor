import React from "react";
import {
  FaAdjust,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaSignOutAlt,
  FaPlus,
  FaHome,
  FaDev,
} from "react-icons/fa";

const logOut = () => {
  localStorage.removeItem("lockToken");
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
    url: "/auth",
    text: "AuthDisplay",
    icon: <FaDev />,
  },
  {
    id: 4,
    url: "/add_doors",
    text: "Add Lock",
    icon: <FaPlus />,
  },
];

export const social = [
  {
    id: 1,
    color: "#3b5998",
    url: "https://www.facebook.com/AjiozInitiative",
    icon: <FaFacebook />,
    target: "_blank",
  },
  {
    id: 2,
    color: "#00aced",
    url: "https://twitter.com/ajioz_",
    icon: <FaTwitter />,
    target: "_blank",
  },
  {
    id: 3,
    color: "#007bb6",
    url: "https://www.linkedin.com/in/ajioz/",
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


export const control = {
  status: false,
  item: [
    {
      _id: 1,
      category: "doorLock",
      name: "Front Door",
      dbName: "frontDoor123445323",
    },
    {
      _id: 2,
      category: "spyCam",
      name: "Front Cam",
      dbName: "frontCam123445323",
    },
    {
      _id: 3,
      category: "doorLock",
      name: "Mid Door",
      dbName: "MidDoor123445323",
    },
    {
      _id: 4,
      category: "spyCam",
      name: "Mid Cam",
      dbName: "MidCam123445323",
    },
    {
      _id: 5,
      category: "doorLock",
      name: "Back Door",
      dbName: "BackDoor123445323",
    },
    {
      _id: 6,
      category: "spyCam",
      name: "Back Cam",
      dbName: "BackCam123445323",
    },
    {
      _id: 7,
      category: "doorLock",
      name: "Gate",
      dbName: "gate33h123445323",
    },
    {
      _id: 8,
      category: "spyCam",
      name: "Gate Cam",
      dbName: "gateCam123445323",
    },
    {
      _id: 9,
      category: "doorLock",
      name: "secutiyHouse",
      dbName: "secuityh123445323",
    },
    {
      _id: 10,
      category: "spyCam",
      name: "security Cam",
      dbName: "securityCam123445323",
    },
  ],
  loading: false,
};
