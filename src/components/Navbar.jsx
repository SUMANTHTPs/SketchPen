import React from 'react';
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";

const Navbar = () => {
  return (
    <div className="container nav-container">
      <h1 className="multi-color-text" style={{ margin: "0" }}>
        <span>S</span>
        <span>k</span>
        <span>e</span>
        <span>t</span>
        <span>c</span>
        <span>h</span>
        <span>P</span>
        <span>e</span>
        <span>n</span>
      </h1>
      <ProfileIcon className="profile" />
    </div>
  );
}

export default Navbar