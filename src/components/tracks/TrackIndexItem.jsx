import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import * as trackActions from '../../store/track'
import * as audioPlayerActions from '../../store/audioPlayer'
import './TrackIndexItem.css'
import csrfFetch from "../../store/csrf";
import routeToAPI from "../../store/api";

export default function TrackIndexItem({ track }) {
    const currentUser = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const tracks = useSelector(state => state.tracks)

    async function handleDelete (e) {
        
        e.preventDefault();

        const confirmation = window.confirm('Are you sure you want to delete this track?');

        if(!confirmation) return;

        await dispatch(audioPlayerActions.dequeueTrack(e.target.value));
        await dispatch(trackActions.removeTrack(e.target.value));

        const response = await csrfFetch(routeToAPI(`/api/tracks/${e.target.value}`), {
            method: 'DELETE'
        })
        
        if(response.ok) {
            let data = await response.json();
            return data;
        } else {
            console.alert('could not delete');
        }
    }

    const navToUpdate = () => {
        navigate(`/@/${encodeURIComponent(track.artist.username)}/${encodeURIComponent(track.title)}/update`)
    }

    return (
        <div className="track-index item">
            { track.photoUrl ? <img src={track.photoUrl} style={{"maxWidth": "80px"}} alt="" /> : <i className="fa-solid fa-compact-disc" style={{"fontSize": "80px"}}></i> }
            <div id={`track-${track.id}-details`} className="track-index details">
                <h2>{track.title || ''}</h2>
                <p>{track?.artist?.username || ''}</p>
            { track && <NavLink to={`/@/${encodeURIComponent(track?.artist?.username)}/${encodeURIComponent(track.title)}`}>See track</NavLink>}
            </div>
            
            { track?.artist?.id === currentUser?.id &&
            <div className="track-index controls">
                <button onClick={handleDelete} value={track.id}>Delete</button>
                <button onClick={navToUpdate}>Update</button>
            </div>
             }
        </div>
    )
}