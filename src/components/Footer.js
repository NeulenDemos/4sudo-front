import React, {useContext} from "react";
import {Link} from 'react-router-dom'
import {ApiContext} from "../context/api/apiContext";
import {ReactComponent as LogoSmall} from "../assets/images/logo_small.svg"


export const Footer = () => {
    const {loading} = useContext(ApiContext);

    return (
        <div id="footer" style={{display: loading ? "none" : "flex"}}>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row">
                    <LogoSmall style={{height: "36px", marginRight: "15px", marginBottom: "10px"}}/>
                    <div className="d-flex flex-column align-items-start">
                        <span>4SU.DO</span>
                        <span>Copyright © 2021. All rights reserved.</span>
                    </div>
                </div>
                <span>Code licensed under an MIT-style License.</span>
                <span>Version 1.3.0.</span>
            </div>
            <div className="d-flex flex-row justify-content-between right-box">
                <div className="d-flex flex-column">
                    <span className="links">Links</span>
                    <Link to="/">Home</Link>
                    <Link to="/posts">Posts</Link>
                    <Link to="/users">Users</Link>
                </div>
                <div className="d-flex flex-column">
                    <span className="links">References</span>
                    <a href="https://github.com/naztar0" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://t.me/NrTrN" target="_blank" rel="noreferrer">Telegram</a>
                    <a href="https://github.com/naztar0/UcodeTrackWeb" target="_blank" rel="noreferrer">Source code</a>
                </div>
            </div>
        </div>
    );
}