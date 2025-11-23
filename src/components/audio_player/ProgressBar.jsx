import { useCallback, useEffect, useMemo, useRef, useState, } from 'react'

import { useSelector } from 'react-redux';

export default function ProgressBar({ progressBarRef, audioRef }) {
    const isPlaying = useSelector(state => state.audio.isPlaying)
    const playAnimationRef = useRef();
    const tooltipAnimationRef = useRef(null);
    const tooltipRef = useRef();
    const [time, setTime] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [tooltipTime, setTooltipTime] = useState(0);

    const mousePositionRef = useRef([0,0]);

    const isDisabled = useMemo(() => {
        return audioRef.current?.readyState === 0
    }, [audioRef])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const handlePointerMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.pageX;
            const clientY = e.touches ? e.touches[0].clientY : e.pageY;
            
            mousePositionRef.current = [clientX, clientY];
        };
    
        window.addEventListener('mousemove', handlePointerMove, {signal});
        window.addEventListener('touchmove', handlePointerMove, {signal});
    
        return () => {
            controller.abort();
        };
    }, []);

    const formatTime = time => {
        const formattedMinutes = Math.floor((time / 60)).toString().padStart(2, '0');
        const formattedSeconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const handleDragEnd = (e) => {
        e.stopPropagation();
        if(!isSeeking) return
        setIsSeeking(false);

        const newValue = progressBarRef.current?.value || 0

        if(audioRef.current.readyState > 0) {
            audioRef.current.currentTime = 
                (newValue / 100.0) * audioRef.current.duration;
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
    }, [progressBarRef]);

    const updateTime = useCallback(() => {
        setTime(audioRef.current.currentTime || 0);
        playAnimationRef.current = requestAnimationFrame(updateTime);
    }, [audioRef, playAnimationRef]);

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

    const updateProgressAndTime = useCallback(() => {

        setTime(audioRef.current?.currentTime || 0);

        const newProgressTime = audioRef.current ? 
            (audioRef.current.currentTime / audioRef.current.duration) * 100.0 
            : 0
        
        progressBarRef.current.value = newProgressTime;

        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${newProgressTime}%`
        );
        
        playAnimationRef.current = requestAnimationFrame(updateProgressAndTime);
    }, [setTime, audioRef, progressBarRef])

    const updateTooltip = useCallback(() => {
        const progressBarBoundingBox = progressBarRef.current.getBoundingClientRect();
        const [mouseX] = mousePositionRef.current;
        const rangeLength = progressBarBoundingBox.right - progressBarBoundingBox.left;
        const offsetX = Math.max(
            0, 
            Math.min(
                mouseX - progressBarBoundingBox.left,  
                rangeLength
            )
        );
        const tooltipT = (offsetX / rangeLength) * (audioRef.current.duration || 0)

        tooltipRef.current.style.setProperty(
            '--tooltip-pos',
            `${offsetX}`
        );

        setTooltipTime(tooltipT < 0 ? 0 : tooltipT);

        tooltipAnimationRef.current = requestAnimationFrame(updateTooltip);
    }, [progressBarRef, mousePositionRef, audioRef]);

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
    }, [tooltipAnimationRef, updateTooltip]);

    
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

    useEffect(() => {
        const progressBar = progressBarRef.current;
        if(!progressBar) return;
        progressBar.addEventListener('mousedown', handleProgressDrag);
        progressBar.addEventListener('touchstart', handleProgressDrag);
    
        return () => {
            try {
                progressBar.removeEventListener('mousedown', handleProgressDrag);
                progressBar.removeEventListener('touchstart', handleProgressDrag);
            }
            catch(e) {
                console.error(e);
            }
        };
    }, [progressBarRef, handleProgressDrag]);

    const currentTime = useMemo(() => {
        return formatTime(time || 0)
    }, [time]);

    const duration = useMemo(() => {
        return formatTime(time || 0)
    }, [time]);

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
                onTouchStart={handleProgressDrag}
                onTouchEnd={handleDragEnd}
                style={{"minWidth":"50px"}}
                disabled={isDisabled}
            />
            <span className='time-display tooltip-time' ref={tooltipRef} style={{"zIndex":"2"}}>
                {formatTime(tooltipTime)}
            </span>
            <span className="time-display track-duration">
                {duration}
            </span>
        </div>
    )
}