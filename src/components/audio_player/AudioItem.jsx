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

    const isPlaying = useSelector(state => state.audio.isPlaying);
    // const volume = useSelector(state => state.audio.volume);
    
    useEffect(() => {
        (async () => {
            // First update the source if needed
            if (currentTrackLocalSource && !audioRef.current.src.includes(currentTrackLocalSource)) {
                audioRef.current.src = currentTrackLocalSource;
                await audioRef.current.load();
            }

            // Then handle play/pause state
            if(isPlaying && currentTrackLocalSource) {
                try {
                    await audioRef.current.play();
                }
                catch(e) {
                    try {
                        audioRef.current.oncanplaythrough = async (e) => {
                            e.preventDefault();
                            if (isPlaying) {
                                await audioRef.current.play();
                            }
                        }
                    }
                    catch(err) {
                        console.error(err);
                    }
                }
            }
            if(!isPlaying) {
                audioRef.current.oncanplaythrough = null;
                if (!audioRef.current.paused) audioRef.current.pause();
            }
        })();
    }, [isPlaying, audioRef, currentTrackLocalSource])

    const audio = <audio 
            className={`audio-track ${currentTrackTitle || ''}`}
            ref={audioRef}
            preload="auto"
            onEnded={handleNext}>
                {currentTrackLocalSource &&
                <source src={currentTrackLocalSource} type={`audio/${currentTrackFileType}`}/>}
        </audio>

    return audio;
}