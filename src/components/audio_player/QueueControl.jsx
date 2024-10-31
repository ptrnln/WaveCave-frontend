import { useSelector } from "react-redux"
import QueueItem from "./QueueItem";
import { useState, useCallback} from "react";
import './QueueControl.css'
// import * as playlistActions from '../../store/playlist.js'



export default function QueueControl () {
    const [display, setDisplay] = useState(false)
    // const currentIndex = useSelector(state => state.audio.currentIndex);
    const tracks =  useSelector(state => {
        const queue = state.audio.isShuffled ?
            state.audio.queue.shuffled
            : state.audio.queue.original
        return (queue
            .slice(state.audio.currentIndex + 1)
            .concat(queue.slice(0, state.audio.currentIndex)))
            .map(idx => state.tracks[idx])
    });

    const toggleDisplay = useCallback((e) => {
        e.preventDefault();
        setDisplay(!display);
    }, [display])

    const handlePlaylistSave = (e) => {
        e.preventDefault();
        
    }
    

    return (
        <div className="queue-control container">
            <button className="queue-control button" onClick={toggleDisplay} title="Playlist menu">
                <i className="fa-solid fa-music"/>
            </button>
            <div className={display ? "queue-control inner hidden" : "queue-control inner"}>
                <div className="queue-control-header">
                    <span>Next Up</span>
                    <button onClick={handlePlaylistSave}>Save Playlist</button>
                </div>
                <ul className="queue">
                    { tracks.map((track, i) => <li key={i}><QueueItem track={track}/></li>)}
                </ul>
            </div>
        </div>
    )
    
}