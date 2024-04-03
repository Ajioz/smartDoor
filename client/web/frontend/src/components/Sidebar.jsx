import React from "react";
import logo from "../logo.svg";
import { FaTimes } from "react-icons/fa";
import { social, links } from "../data";
import { useGlobalContext } from "../context/context";
import { CloseBtn, Linka, Logo, Mylink, SidebarHeader, SocialIcon, SocialIconTag } from "../theme/theme";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <aside className={`sidebar ${showSidebar && "show-sidebar"}`}>
      <SidebarHeader>
        <Logo src={logo} alt="coding" />
        <CloseBtn onClick={() => setShowSidebar(!showSidebar)}>
          <FaTimes />
        </CloseBtn>
      </SidebarHeader>
      <Mylink>
        {links.map((link) => {
          const { id, url, text, icon } = link;
          return (
            <li key={id}>
              <Linka href={url}>
                {icon}
                {text}
              </Linka>
            </li>
          );
        })}
      </Mylink>
      <SocialIcon>
        {social.map((social) => {
          const { id, url, icon } = social;
          return (
            <li key={id}>
              <SocialIconTag href={url}>{icon}</SocialIconTag>
            </li>
          );
        })}
      </SocialIcon>
    </aside>
  );
};

export default Sidebar;
