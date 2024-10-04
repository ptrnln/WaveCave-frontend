import { useNavigate } from 'react-router-dom';
import './TrackDisplay.css'
import { useSelector } from "react-redux";


export default function TrackDisplay() {
    const navigate = useNavigate();
    
    const currentTrack = useSelector(state => {
        if(state.audio.isShuffled) {
            return state.tracks[state.audio.queue.shuffled[state.audio.currentIndex]]
        }
        return state.tracks[state.audio.queue.original[state.audio.currentIndex]]
    }, /* (a, b) => {
        if (!a || !b) return false
        // const filteredkeys = Object.keys(a).filter(k => !['photoUrl', 'sourceUrl', 'artist'].includes(k));
        // const aObj = new Object();
        // const bObj = new Object();
        // filteredkeys.forEach(e => {
        //     aObj[e] = a[e]
        //     bObj[e] = b[e]
        // });

        return a.id == b.id
    } */)

    const navToTrack = (e) => {
        e.preventDefault();
        navigate(`/@/${encodeURIComponent(currentTrack.artist.username)}/${encodeURIComponent(currentTrack.title)}`);
    }

    return currentTrack ?
           ( <div className="track-display"
            onClick={navToTrack}
            style={{"cursor":"pointer"}}>
                    { currentTrack.photoUrl ? 
                        <img className="track-display photo-display"
                            width={30}
                            height={30}
                            src={currentTrack.photoUrl}
                            />
                        :
                        <i className='fa-solid fa-compact-disc track-display photo-display'/>
                    }
                    <div className="track-details">
                        <span className="track-details title">
                            {currentTrack.title || ''}
                        </span>
                        <span className="track-details artist-name">
                            {currentTrack.artist.username || ''}
                        </span>
                    </div>
    
        </div> )
        :
        false
}