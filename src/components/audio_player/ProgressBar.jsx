import { useCallback, useEffect, useRef, useState } from 'react'
// import './ProgressBar.css'
import { useSelector } from 'react-redux';

export default function ProgressBar({ progressBarRef, audioRef }) {
    const isPlaying = useSelector(state => state.audio.isPlaying)
    const playAnimationRef = useRef();

    const [time, setTime] = useState(0);

    const handleProgressChange = (e) => {
        e.stopPropagation()
        
        const newValue = progressBarRef.current ? progressBarRef.current.value : 0
        audioRef.current.currentTime = (progressBarRef.current.value / 100.0) * audioRef.current.duration;
        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newValue}%`
        );
    };

    const updateProgress = useCallback(() => {
        const newValue = audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100.0 : 0
        setTime(audioRef.current?.currentTime || 0);
        progressBarRef.current.value = newValue;
        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newValue}%`
        );
        playAnimationRef.current = requestAnimationFrame(updateProgress);
    }, [audioRef, progressBarRef, /*progressBarRef.current?.value, handleProgressChange*/]);
    
    useEffect(() => {
        if (isPlaying) {
            playAnimationRef.current = requestAnimationFrame(updateProgress);
        } 
        if (!isPlaying) {
            cancelAnimationFrame(playAnimationRef.current);
        }
    }, [isPlaying, updateProgress, playAnimationRef]);

    const formatTime = time => {
        const formattedMinutes = Math.floor(time / 60)
        const formattedSeconds = Math.floor(
            formattedMinutes === 0 ? 
            time : time % 60);
        return `${formattedMinutes}`.padStart(2, '0') + ':' + `${formattedSeconds}`.padStart(2, '0');
    }

    return (
        <div className="progress-bar">
            <span className="time-display current-time">
                {formatTime(time || 0)}
            </span>
            <input 
                type="range" 
                ref={progressBarRef}
                step={0.0001}
                defaultValue={0}
                onChange={handleProgressChange}
            />
            <span className="time-display track-duration">
                {formatTime(audioRef.current?.duration || 0)}
            </span>
        </div>
    )
}