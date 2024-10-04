// import { useEffect, useState } from "react"
import * as audioPlayerActions from '../../store/audioPlayer';
import { useDispatch, useSelector } from "react-redux";
// import './AudioControls.css';

export default function AudioControls({ handleNext, handlePrev }) {
    const dispatch = useDispatch();

    const isPlaying = useSelector(state => state.audio.isPlaying);
    const isShuffled = useSelector(state => state.audio.isShuffled);
    const isRepeating = useSelector(state => state.audio.isRepeating);
    const hasRepeated = useSelector(state => state.audio.hasRepeated);
    const queueLength = useSelector(state => state.audio.queue.original.length);
    const currentIndex = useSelector(state => state.audio.currentIndex);

    const togglePlay = (e) => {
        e.stopPropagation();
        if(isPlaying) {
            dispatch(audioPlayerActions.pauseTrack())
        } else {
            dispatch(audioPlayerActions.playTrack())
        }
    }

    const toggleShuffle = (e) => {
        e.preventDefault();
        if(isShuffled) {
            dispatch(audioPlayerActions.setShuffleOff());
        } else {
            dispatch(audioPlayerActions.setShuffleOn());
        }
    }

    const toggleRepeat = (e) => {
        e.preventDefault();
        switch(isRepeating) {
            case 'false':
                dispatch(audioPlayerActions.setRepeatOnce());
                break;
            case 'once':
                dispatch(audioPlayerActions.setRepeatAlways());
                break;
            case 'always':
                dispatch(audioPlayerActions.setRepeatFalse());
                break;
            default:
                break;
        }
    }

    const nextButtonDisabled = currentIndex === queueLength - 1 && 
            (isRepeating === 'once' && hasRepeated || isRepeating === 'false');

    return (
        <div className="audio-controls container">
            <div className="track-controls container">
                <button className="previous button" onClick={handlePrev}>
                    <i className="fa fa-step-backward"/>     
                </button>
                <button className="play-pause button" onClick={togglePlay}>
                {isPlaying ? 
                    <i className='fa fa-pause' />
                    :
                    <i className='fa fa-play'/>
                }
                </button>
                { nextButtonDisabled ?
                    <button className="next button" style={{color: "Grey", pointer: "default"}}>
                        <i className="fa fa-step-forward"></i>
                    </button>
                    :
                    <button className="next button" onClick={handleNext}>
                        <i className="fa fa-step-forward"></i>
                    </button>
                }
            </div>
            <div className="queue-controls container">
                <span style={{color: isShuffled ? "#f50" : "Black"}}>
                    <button 
                        id="shuffle-button" 
                        className="shuffle button"
                        onClick={toggleShuffle}>
                            <i className="fa fa-random"></i>
                    </button>
                </span>
                <span style={{
                    color: ["once","always"]
                                .some(v => v === isRepeating) ? 
                                    "#f50"
                                    :   
                                    "Black"}}>
                    <button className="repeat button">
                        <i 
                            className={
                                isRepeating === 'once' ? "wc-icon-cycle-1" : "wc-icon-cycle"
                            }
                            onClick={toggleRepeat}
                        ></i>
                    </button>
                </span>
            </div>
        </div>
    )
}