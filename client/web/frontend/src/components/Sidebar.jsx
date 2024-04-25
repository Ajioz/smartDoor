import React from "react";
import logo from "../logo.png";
import { FaArrowLeft } from "react-icons/fa";
import { social, links } from "../data";
import { useGlobalContext } from "../context/context";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { showSidebar, setShowSidebar } = useGlobalContext();
  return (
    <aside className={`sidebar ${showSidebar && "show-sidebar"}`}>
      <section>
        <SidebarHeader>
          <Logo
            src={logo}
            alt="coding"
            onClick={() => navigate("/dashboard")}
          />
          <CloseBtn onClick={() => setShowSidebar(!showSidebar)}>
            <FaArrowLeft />
          </CloseBtn>
        </SidebarHeader>
        <Mylink>
          {links.map((link) => {
            const { id, url, text, icon } = link;
            return (
              <LinkContainer key={id}>
                <Linka onClick={() => setShowSidebar(!showSidebar)}>
                  <Link to={url}>
                    {icon}
                    &nbsp; &nbsp;
                    {text}
                  </Link>
                </Linka>
              </LinkContainer>
            );
          })}
        </Mylink>
      </section>
      <SocialIcon>
        {social.map((social) => {
          const { id, color, icon, url, target, click } = social;
          return (
            <LinkContainer key={id}>
              <SocialIconTag
                href={url}
                onClick={click}
                target={target}
                color={color}
              >
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
