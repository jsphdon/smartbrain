import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import logo from './logo.png'

const Logo = () => {
  return(
    <div className="ma4 mt0">
      <Tilt className="Tilt br2 shadow-2" options={{ max : 40 }} style={{ height: 200, width: 200, borderRadius:25 }} >
        <div className="Tilt-inner pa3"> <img alt="smart-brain Logo" src={logo} style={{ paddingTop: '22px'}}/> </div>
      </Tilt>
    </div>
  );
}

export default Logo;