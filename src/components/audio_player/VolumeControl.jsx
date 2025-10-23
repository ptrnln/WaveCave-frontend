import { useState, useEffect } from "react"
import { createPortal } from 'react-dom'
import "./VolumeControl.css"

export default function VolumeControl({ audioRef }) {
    const [volumeNumber, setVolumeNumber] = useState(localStorage.getItem('wavecave__volume_pref') * 100 ?? audioRef.current?.volume ?? 50)
    const [volumeLevel, setVolumeLevel] = useState(volumeNumber < 66 ? volumeNumber < 33 ? volumeNumber === 0 ? "muted" : "off" : "low" : "high");
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [volumeDisabled, setVolumeDisabled] = useState(true);

    useEffect(() => {
        if(!!audioRef.current) setVolumeDisabled(false)
    },[audioRef])

    return (
        <div className="volume-control container" onMouseOver={(e) => setShowVolumeSlider(true)} onMouseLeave={(e) => setShowVolumeSlider(false)}>
            <div className="hover">
                {(() => {switch(volumeLevel) {

                    case "high":
                        return (<i className="wc-volume-high"></i>)
                        break;

                    case "low":
                        return (<i className="wc-volume-low"></i>)
                        break;

                    case "off":
                        return(<i className="wc-volume-off" ></i>)
                        break;

                    case "muted":
                        return(<i className="wc-volume-muted"></i>)
                        break;

                    }})()}
            </div>
                {<div className="volume-slider-anchor">
                    <div className={"volume-slider container" + (showVolumeSlider ? "" : " hidden")}>
                    <input 
                        type="range"
                        orient="vertical" 
                        value={volumeNumber}
                        disabled={volumeDisabled}
                        onPointerLeave={(e) => {
                            localStorage.setItem('wavecave__volume_pref', `${+e.target.value / 100.0}`);
                        }}
                        onChange={(e) => {
                            audioRef.current.volume = e.target.value / 100
                            setVolumeNumber(audioRef.current.volume * 100)
                            if(e.target.value >= 66) {
                                if(volumeLevel !== "high") setVolumeLevel("high")
                            } else if(e.target.value >= 33) {
                                if(volumeLevel !== "low") setVolumeLevel("low")
                            } else if(e.target.value > 0) { if(volumeLevel !== "off") setVolumeLevel("off"); 
                            } else setVolumeLevel("muted")
                        }}/>
                    </div>
                </div>}
        </div>
    )
}