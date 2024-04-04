import React from "react";
import logo from "../logo.png";
import { FaArrowLeft } from "react-icons/fa";
import { social, links } from "../data";
import { useGlobalContext } from "../context/context";
import {
  CloseBtn,
  Linka,
  Logo,
  Mylink,
  SidebarHeader,
  SocialIcon,
  SocialIconTag,
  LinkContainer,
} from "../theme/theme";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <aside className={`sidebar ${showSidebar && "show-sidebar"}`}>
      <section>
        <SidebarHeader>
          <Logo src={logo} alt="coding" />
          <CloseBtn onClick={() => setShowSidebar(!showSidebar)}>
            <FaArrowLeft />
          </CloseBtn>
        </SidebarHeader>
        <Mylink>
          {links.map((link) => {
            const { id, url, text, icon } = link;
            return (
              <LinkContainer key={id}>
                <Linka href={url}>
                  {icon}
                  &nbsp; &nbsp;
                  {text}
                </Linka>
              </LinkContainer>
            );
          })}
        </Mylink>
      </section>
      <SocialIcon>
        {social.map((social) => {
          const { id, color, icon, url, target } = social;
          return (
            <LinkContainer key={id}>
              <SocialIconTag href={url} target={target} color={color}>
                {icon}
              </SocialIconTag>
            </LinkContainer>
          );
        })}
      </SocialIcon>
    </aside>
  );
};

export default Sidebar;
