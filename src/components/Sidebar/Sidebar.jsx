import React, { useState } from "react";
import Home from "../Home/Home";
import "./Sidebar.css";
import { CgFormatJustify, CgClose } from "react-icons/cg";
import SidebarList from "./SidebarList";


const Sidebar = ({changeTheme}) => {
  const [expandSidebar, setExpandSidebar] = useState(false);

  const handleExpandClick = () => {
    setExpandSidebar(!expandSidebar);
  };

  return (
    <div className="container-fluid sidebar-section">
      <div className={ expandSidebar ? "sidebar-expand sidebar" : "sidebar"}>

        <div className="icon-for-sidebar-expand">
          <div className="icon" onClick={handleExpandClick}>
            {expandSidebar ? (
                <CgClose size={30} color="#ffffff" />
            ) : (
                <CgFormatJustify size={30} color="#ffffff"/>
            )}
          </div>
        </div>

        <SidebarList expandSidebar={expandSidebar}/>

      </div>

      <div className="container">
        <Home changeTheme={changeTheme}/>
      </div>

    </div>
  );
};

export default Sidebar;
