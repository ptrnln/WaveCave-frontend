import { useCallback, useEffect, useMemo, useRef, useState, } from 'react'
// import './ProgressBar.css'
import { useSelector } from 'react-redux';

export default function ProgressBar({ progressBarRef, audioRef }) {
    const isPlaying = useSelector(state => state.audio.isPlaying)
    const playAnimationRef = useRef();
    const [isSeeking, setIsSeeking] = useState(false);

    const [time, setTime] = useState(0);

    const [hoverTime, setHoverTime] = useState(0.0);

    const handleDragEnd = (e) => {
        const newValue = progressBarRef.current ? progressBarRef.current.value : 0
        debugger
        if(audioRef.current.readyState > 0) {
            audioRef.current.currentTime = (newValue / 100.0) * audioRef.current.duration;
        }
        setIsSeeking(false);

        playAnimationRef.current = requestAnimationFrame(updateProgress);
    }

    const handleProgressDrag = useCallback((e) => {
        e.stopPropagation();
        const newValue = progressBarRef.current ? progressBarRef.current.value : 0
        // debugger
        // debugger 
        // if(audioRef.current.readyState > 0) {
        //     audioRef.current.pause();
        //     audioRef.current.currentTime = (newValue / 100.0) * audioRef.current.duration;
        //     audioRef.current.play();
        // }

        setIsSeeking(true)

        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newValue}%`
        );
    }, [audioRef, progressBarRef]);

    const updateProgress = useCallback(() => {
        const newProgressTime = audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100.0 : 0
        debugger
        setTime(audioRef.current?.currentTime || 0);
        progressBarRef.current.value = newProgressTime;
        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newProgressTime}%`
        );
        if(!isSeeking) playAnimationRef.current = requestAnimationFrame(updateProgress);
    }, [audioRef, progressBarRef, isSeeking /*progressBarRef.current?.value, handleProgressChange*/]);

    const updateHoverTime = useCallback(() => {

    }, [audioRef])

    const formatTime = time => {
        const formattedMinutes = Math.floor(time / 60)
        const formattedSeconds = Math.floor(
            formattedMinutes === 0 ? 
            time : time % 60);
        return `${formattedMinutes.toString().padStart(2, '0')}:${formattedSeconds.toString().padStart(2, '0')}`;
    }
    
    useEffect(() => {
        if (isPlaying && !isSeeking) {
            playAnimationRef.current = requestAnimationFrame(updateProgress);
        } 
        if (!isPlaying || isSeeking) {
            cancelAnimationFrame(playAnimationRef.current);
        }
    }, [isPlaying, updateProgress, playAnimationRef, isSeeking]);

    const currentTime = useMemo(() => {
        return formatTime(time)
    }, [time])

    const hoverT = useMemo(() => {
        return formatTime(hoverTime);
    }, [hoverTime])

    const duration = useMemo(() => {
        return formatTime(audioRef.current?.duration || 0)
    }, [audioRef.current?.duration])


    return (
        <div className="progress-bar">
            <span className="time-display current-time">
                {currentTime}
            </span>
            <input 
                id='progress-bar'
                type="range" 
                ref={progressBarRef}
                step={0.0001}
                defaultValue={0}
                onInput={handleProgressDrag}
                onMouseUp={handleDragEnd}
                // onMouseUp={handleProgressChange}
            />
            <span className='time-display hover-time'>
                {hoverT}
            </span>
            <span className="time-display track-duration">
                {duration}
            </span>
        </div>
    )
}