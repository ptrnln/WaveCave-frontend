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

    
    return (
        <div className="audio-controls container">
            <div className="track-controls container">
                <button className="previous button" onClick={handlePrev} alt="Previous" title='Previous track/Replay' disabled={queueLength === 0}>
                    <i className="fa fa-step-backward"/>     
                </button>
                <button className="play-pause button" onClick={togglePlay} alt="Play" title='Play track' disabled={queueLength === 0}>
                {isPlaying ? 
                    <i className='fa fa-pause icon-fixed-size' />
                    :
                    <i className='fa fa-play icon-fixed-size'/>
                }
                </button>
                <button className="next button" onClick={handleNext} title="Next track" 
                    disabled={
                        queueLength === 0 || (currentIndex === queueLength - 1 && (isRepeating === 'false' || (isRepeating === 'once' && hasRepeated))) }>
                    <i className="fa fa-step-forward"></i>
                </button>
            </div>
            <div className="queue-controls container">
                <button 
                    id="shuffle-button" 
                    className={"shuffle button" + (isShuffled ? " active" : "")}
                    onClick={toggleShuffle}
                    disabled={queueLength === 0}
                    title='Shuffle playlist'>
                            <i className="fa fa-random"></i>
                </button>
                <button 
                    aria-label="Repeat playlist"
                    id="repeat-button"
                    className={"repeat button" + (isRepeating !== 'false' ? ` ${isRepeating}` : "")} 
                    disabled={queueLength === 0}
                    onClick={toggleRepeat}
                    title='Repeat playlist'>
                    {isRepeating === 'once' ? (
                        <i className="wc wc-cycle-1-duotone"><span className="path1"></span><span className="path2"></span></i>
                    ) : (
                        <i className="wc wc-cycle"></i>
                    )}
                </button>
            </div>
        </div>
    )
}