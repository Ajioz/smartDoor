import React from "react";
import { FaBars } from "react-icons/fa";
import { useGlobalContext } from "./context";

const Dashboard = () => {
   const { showModal, setShowModal, showSidebar, setShowSidebar } =
     useGlobalContext();
   return (
     <main>
       <button
         className="sidebar-toggle"
         onClick={() => setShowSidebar(!showSidebar)}
       >
         <FaBars />
       </button>
       <button className="btn" onClick={() => setShowModal(!showModal)}>
         show Modal
       </button>
     </main>
   );
};

export default Dashboard;
