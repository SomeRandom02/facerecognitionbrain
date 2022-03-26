import React from "react";
import Tilty from 'react-tilty';
import './Logo.css';
import brain from './brain.png'

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilty className='Tilt br2 shadow-2'reverse axis="x" scale={1.2} perspective={900} reset={true} style={{ height: 100, width: 100}}>
                <div className="pa3"><img style={{paddingTop:'0px'}} alt='logo' src={brain}/></div>
            </Tilty>
        </div>
    )
}


export default Logo