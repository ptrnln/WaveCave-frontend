import { useEffect, useState } from "react"
import TrackIndexItem from "./TrackIndexItem";
import { useDispatch, useSelector } from "react-redux";
import * as trackActions from '../../store/track'
import './TrackIndex.css'
import routeToAPI from "../../store/api";

export default function TrackIndex() {
    const [loaded, setLoaded] = useState(false);
    const tracks = useSelector(state => state.tracks)
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => { 
            const response = await fetch(routeToAPI('/api/tracks'))
            const tracksData = await response.json();
            dispatch(trackActions.receiveTracks(tracksData.tracks))
            setLoaded(true);
        })()
    }, [dispatch])

    return (
        <div className="track-index container">
            <h1>Tracks</h1>
            <ul
                className="track-index">
                {loaded && Object.values(tracks).map(track => <li key={track.id}><TrackIndexItem track={track} /></li>)}
            </ul>
        </div>
    )
}