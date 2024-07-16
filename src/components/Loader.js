import React, {useContext} from 'react'
import Lottie from 'react-lottie';
import animationData from '../assets/data/loader.json'
import {ApiContext} from "../context/api/apiContext";

export const Loader = () => {
    const {loading} = useContext(ApiContext);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <div style={{display: loading ? "block" : "none", position: "fixed", width: "100%", height: "100%", top: 0, left: 0, zIndex: 99, backgroundColor: "rgba(255,255,255,0.9)"}}>
            <div style={{position: "fixed", top: "50%", left: "50%", marginTop: "-125px", marginLeft: "-150px"}}>
                <Lottie options={defaultOptions} height={250} width={300}/>
            </div>
        </div>
    )
}
