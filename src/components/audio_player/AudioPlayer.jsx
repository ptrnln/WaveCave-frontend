// import './AudioPlayer.css'
import { useRef } from "react";
import TrackDisplay from "./TrackDisplay";
import AudioControls from './AudioControls';
import AudioItem from './AudioItem';
import { useDispatch, useSelector } from 'react-redux';
import * as audioPlayerActions from '../../store/audioPlayer';
import ProgressBar from './ProgressBar';
import QueueControl from './QueueControl';

export default function AudioPlayer() {
    const dispatch = useDispatch();
    const currentIndex = useSelector(state => state.audio.currentIndex)
    // const tracks = useSelector(state => state.tracks);
    // const isRepeating = useSelector(state => state.audio.isRepeating);
    // const hasRepeated = useSelector(state => state.audio.hasRepeated);
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
        if(audioRef.current.currentTime <= 3 || currentIndex === 0) {
            dispatch(audioPlayerActions.playPrev())
        } else {
            audioRef.current.currentTime = 0;
            if(!isPlaying) dispatch(audioPlayerActions.playTrack());
        }
    }
    
    // useEffect(() => {
    //     if(tracks.length === 1 && (isRepeating === 'always' || isRepeating === 'once' && !hasRepeated)) {
    //         audioRef.current.currentTime = 0
    //     }
    // }, [hasRepeated, tracks.length, isRepeating]);

    return (
        <div className="audio-player">
            <div className="inner">
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
                <QueueControl />
            </div>
        </div>
    )
}