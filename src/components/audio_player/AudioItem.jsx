import { useEffect } from "react";
import { useSelector } from "react-redux"; 

export default function AudioItem({ audioRef, handleNext }) {

    const currentTrackTitle = useSelector(state => {
        const { queue, isShuffled, currentIndex } = state.audio

        if(isShuffled) {
            return state.tracks[queue.shuffled[currentIndex]]?.title
        }
        return state.tracks[queue.original[currentIndex]]?.title
    });

    const currentTrackId = useSelector(state => {
        const { queue, isShuffled, currentIndex } = state.audio

        if(isShuffled) {
            return state.tracks[queue.shuffled[currentIndex]]?.id
        }
        return state.tracks[queue.original[currentIndex]]?.id
    });

    const currentTrackFileType = useSelector(state => {
        const { queue, isShuffled, currentIndex } = state.audio

        if(isShuffled) {
            return state.tracks[queue.shuffled[currentIndex]]?.fileType
        }
        return state.tracks[queue.original[currentIndex]]?.fileType
    
    });

    const currentTrackLocalSource = useSelector(state => {
        const { queue, isShuffled, currentIndex } = state.audio

        if(isShuffled) {
            return state.tracks[queue.shuffled[currentIndex]]?.localSource
        }
        return state.tracks[queue.original[currentIndex]]?.localSource
    });

    const currentTrackSource = useSelector(state => {
        const { queue, isShuffled, currentIndex } = state.audio

        if(isShuffled) {
            return state.tracks[queue.shuffled[currentIndex]]?.sourceUrl
        }
        return state.tracks[queue.original[currentIndex]]?.sourceUrl
    })

    const isPlaying = useSelector(state => state.audio.isPlaying);
    
    useEffect(() => {
        (async () => {
            if (isPlaying && (currentTrackLocalSource || currentTrackSource) && audioRef.current.paused) {
                try {
                    await audioRef.current.play();
                } catch(e) {
                    // Error handling...
                }
            } else if (!isPlaying && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        })();
    }, [isPlaying, currentTrackLocalSource]);

    useEffect(() => {
        if(currentTrackId) audioRef.current.load()
    }, [currentTrackId, audioRef])
    
    const audio = <audio 
    className={`audio-track ${currentTrackTitle || ''}`}
    ref={audioRef}
    preload="auto"
    onEnded={handleNext}>
                {currentTrackLocalSource &&
                <source src={currentTrackLocalSource} type={`audio/${currentTrackFileType}`}/>}
                {currentTrackSource &&
                <source src={currentTrackSource} type={`audio/${currentTrackFileType}`}/>}
        </audio>

    return audio;
}