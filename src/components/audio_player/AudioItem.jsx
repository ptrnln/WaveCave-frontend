import { useEffect } from "react";
import { useSelector } from "react-redux"; 
// import * as audioPlayerActions from '../../store/audioPlayer';

export default function AudioItem({ audioRef, handleNext }) {
    // const dispatch = useDispatch();

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
    
    

    const currentTrackSourceUrl = useSelector(state => {
        const { queue, isShuffled, currentIndex } = state.audio

        if(isShuffled) {
            return state.tracks[queue.shuffled[currentIndex]]?.sourceUrl
        }
        return state.tracks[queue.original[currentIndex]]?.sourceUrl
    });

    const isPlaying = useSelector(state => state.audio.isPlaying);
    // const volume = useSelector(state => state.audio.volume);
    
    useEffect(() => {
        (async () => {
            
            if(isPlaying && currentTrackId) {
                try {  
                    await audioRef.current.play();
                }
                catch(e) {
                    try {
                        // await audioRef.current.load();

                        audioRef.current.oncanplaythrough = async (e) => {
                            e.preventDefault();
                            
                            await audioRef.current.play();
                        }
                    }
                    catch(err) {
                        console.error(err, e);
                    }
                }
            }
            if(!isPlaying) {
                audioRef.current.oncanplaythrough = undefined;

                if (!audioRef.current.paused) audioRef.current.pause();
            }
        })();
    }, [isPlaying, audioRef, currentTrackId])

    useEffect(() => {
        (async () => { 
            if(currentTrackId) {
                await audioRef.current.load()
        }})();
    }, [audioRef, currentTrackId, currentTrackLocalSource])

    const audio = <audio 
            className={`audio-track ${currentTrackTitle || ''}`}
            ref={audioRef}
            onEnded={handleNext}>
                {currentTrackSourceUrl &&
                <source src={currentTrackSourceUrl} type={`audio/${currentTrackFileType}`}/>}
                {currentTrackLocalSource &&
                <source src={currentTrackLocalSource} type={`audio/${currentTrackFileType}`}/>}
        </audio>

    return audio;
}