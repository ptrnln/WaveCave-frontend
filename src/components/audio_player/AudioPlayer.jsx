// import './AudioPlayer.css'
import { useRef } from "react";
import TrackDisplay from "./TrackDisplay";
import AudioControls from './AudioControls';
import AudioItem from './AudioItem';
import { useDispatch, useSelector } from 'react-redux';
import * as audioPlayerActions from '../../store/audioPlayer';
import ProgressBar from './ProgressBar';
import QueueControl from './QueueControl';
import VolumeControl from "./VolumeControl";

export default function AudioPlayer() {
    const dispatch = useDispatch();
    const currentIndex = useSelector(state => state.audio.currentIndex)
    const isPlaying = useSelector(state => state.audio.isPlaying);
    const audioRef = useRef();
    const progressBarRef = useRef();
    
    const handleNext = (e) => {
        e.preventDefault();
        dispatch(audioPlayerActions.playNext());
        if(!isPlaying) dispatch(audioPlayerActions.playTrack());
    }
    
    const handlePrev = (e) => {
        e.preventDefault();
        if(audioRef.current?.currentTime >= 3 || currentIndex === 0) {
            audioRef.current.currentTime = 0;
            if(!isPlaying) dispatch(audioPlayerActions.playTrack());
        } else {
            dispatch(audioPlayerActions.playPrev())
        }
    }
    
    return (
        <>
            <div id="slide-tab"><i className="fa-solid fa-chevron-up"></i></div>
            <div className="audio-player container">
                <div className="audio-player inner">
                    <AudioControls {...{
                        handleNext,
                        handlePrev,
                    }}/>
                    <ProgressBar {...{
                        audioRef,
                        progressBarRef,
                    }}/>
                    <AudioItem {...{
                        audioRef,
                        progressBarRef,
                        handleNext
                    }}/>
                    <TrackDisplay />
                    <QueueControl {...audioRef}/>
                    <VolumeControl {...{audioRef}}/>
                </div>
            </div>
        </>
    )
}