import React from 'react';
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";

const Navbar = () => {
  return (
    <div className='container nav-container'>
        <h1 style={{margin: "0"}}>SketchPen</h1>
        <ProfileIcon />
    </div>
  )
}

export default Navbar