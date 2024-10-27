import { useCallback, useEffect, useMemo, useRef, useState, } from 'react'
// import './ProgressBar.css'
import { useSelector } from 'react-redux';

export default function ProgressBar({ progressBarRef, audioRef }) {
    const isPlaying = useSelector(state => state.audio.isPlaying)
    const playAnimationRef = useRef();
    const tooltipAnimationRef = useRef(null);
    const tooltipRef = useRef();
    const [isSeeking, setIsSeeking] = useState(false);

    const [time, setTime] = useState(0);
    const [tooltipTime, setTooltipTime] = useState(0);

    const mousePositionRef = useRef([0,0]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePositionRef.current = [e.pageX, e.pageY];
        };
        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    const formatTime = time => {
        const formattedMinutes = Math.floor((time / 60));
        const formattedSeconds = Math.floor(time % 60);
        return `${formattedMinutes.toString().padStart(2, '0')}:${formattedSeconds.toString().padStart(2, '0')}`;
    }

    const handleDragEnd = (e) => {
        e.stopPropagation();
        setIsSeeking(false);

        const newValue = progressBarRef.current?.value || 0

        if(audioRef.current.readyState > 0) {
            audioRef.current.currentTime = (newValue / 100.0) * audioRef.current.duration;
        }
    }

    const handleProgressDrag = useCallback((e) => {
        e.stopPropagation();
        setIsSeeking(true);

        const newValue = progressBarRef.current ? 
            progressBarRef.current.value 
            : 0

        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newValue}%`
        );
    }, [audioRef, progressBarRef]);

    const updateTime = useCallback(() => {

        setTime(audioRef.current?.currentTime || 0);

        playAnimationRef.current = requestAnimationFrame(updateTime);

    }, [audioRef, playAnimationRef, setTime]);

    const updateProgress = useCallback(() => {

        const newProgressTime = audioRef.current ? 
            (audioRef.current.currentTime / audioRef.current.duration) * 100.0 
            : 0

        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newProgressTime}%`
        );
        
        playAnimationRef.current = requestAnimationFrame(updateProgress);
    }, [audioRef, progressBarRef]);

    const updateProgressAndTime = () => {

        const newProgressTime = audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100.0 : 0
        
        progressBarRef.current.value = newProgressTime;

        setTime(audioRef.current?.currentTime || 0);

        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newProgressTime}%`
        );
        
        playAnimationRef.current = requestAnimationFrame(updateProgressAndTime)
    }

    // console.log("Progress Bar re-render")

    const updateTooltip = useCallback(() => {
        const progressBarBoundingBox = progressBarRef.current.getBoundingClientRect();
        const [mouseX] = mousePositionRef.current;
        const offsetX = mouseX - progressBarBoundingBox.left;
        // if(offsetX < 0) return
        const rangeLength = progressBarBoundingBox.right - progressBarBoundingBox.left;
        const tooltipT = (offsetX / rangeLength) * (audioRef.current.duration || 0)

        tooltipRef.current.style.setProperty(
            '--tooltip-pos',
            `${offsetX}`
        );
        debugger

        setTooltipTime(tooltipT < 0 ? 0 : tooltipT);

        // Continuously call updateTooltip
        tooltipAnimationRef.current = requestAnimationFrame(updateTooltip);
    }, [mousePositionRef, audioRef]);

    const startTooltipUpdate = (e) => {
        e.stopPropagation();
        if(!tooltipAnimationRef.current) {
            tooltipAnimationRef.current = requestAnimationFrame(updateTooltip);
        }
    }

    const stopTooltipUpdate = (e) => {
        e.stopPropagation();
        if(tooltipAnimationRef.current) {
            cancelAnimationFrame(tooltipAnimationRef.current);
            tooltipAnimationRef.current = null
        }
    }

    useEffect(() => {
        if(tooltipRef.current) {
            tooltipAnimationRef.current = requestAnimationFrame(updateTooltip)
        }
    }, [tooltipAnimationRef, tooltipAnimationRef, updateTooltip]);

    
    useEffect(() => {
        if (isPlaying && !isSeeking) {
            cancelAnimationFrame(playAnimationRef.current);
            playAnimationRef.current = requestAnimationFrame(updateProgressAndTime);
        } 
        if (!isPlaying && !isSeeking) {
            cancelAnimationFrame(playAnimationRef.current);
        }
        if(isSeeking && isPlaying) {
            cancelAnimationFrame(playAnimationRef.current);
            playAnimationRef.current = requestAnimationFrame(updateTime);
        }
    }, [isPlaying, updateProgressAndTime, updateTime, playAnimationRef, isSeeking]);

    const currentTime = useMemo(() => {
        return formatTime(time)
    }, [time]);

    const duration = useMemo(() => {
        return formatTime(audioRef.current?.duration || 0)
    }, [audioRef.current?.duration]);

    return (
        <div 
            className="progress-bar" 
            onBlur={() => handleDragEnd(new Event("blur"))}
            onMouseEnter={startTooltipUpdate}
            onMouseLeave={stopTooltipUpdate}>
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
            />
            <span className='time-display tooltip-time' ref={tooltipRef}>
                {formatTime(tooltipTime)}
            </span>
            <span className="time-display track-duration">
                {duration}
            </span>
        </div>
    )
}