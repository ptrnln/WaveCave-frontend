import { NavLink, Outlet, useParams } from "react-router-dom"
import './TrackView.css'
import { useDispatch, useSelector } from "react-redux";
import * as audioActions from '../../store/audioPlayer';
import * as trackActions from '../../store/track';
import { useEffect, useState } from "react";
// import { useEffect } from "react";

export default function TrackView() {
    const dispatch = useDispatch();
    // const data = useLoaderData();
    const { username, title } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);

    const track = useSelector(state => {
        // debugger
        let track;
        Object.keys(state.tracks).forEach(id => {
            state.tracks[id]
            if(state.tracks[id]?.artist?.username == username && state.tracks[id]?.title == title){
                track = state.tracks[id]
            }
        })
        return track;
    })

    // const track = Object.values(data)[0];

    // const { id, description, genre, artist, photoUrl, /* createdAt */ } = Object.values(useLoaderData())[0];
    
    

    async function handleClick (e) {
        e.preventDefault();
        // const trackData = await 
        dispatch(audioActions.loadTracks([track.id]));
        dispatch(audioActions.playTrack());
    }

    // const dateTrack = timestamp => {
    //     const release = new Date(timestamp);
    //     const now = new Date();

    //     const timeAgoInSeconds = (now - release) / 1000;

    //     return "not implemented"
    // }

    // useEffect(() => {
    //     if(!track) {
    //             const getTrackInfo = async () => {
    //             const response = await fetch(`/api/users/${track.username}/tracks/${track.title}`);
                
    //             if(response.ok) {
    //                 const data = await response.json();

    //                 dispatch(trackActions.receiveTrack(data.track))
    //             }
    //         }
    //         getTrackInfo();
    //     }
    // }, [])

    useEffect(() => {
        (async () => {
        if(track) {
            setIsLoaded(true);
        } else {
            dispatch(trackActions.receiveTrack(await 
                Object.values(trackActions.getTrackByUserNameAndTitle(username, title))[0]));
        }})();
    }, [track, dispatch, username, title])

    return (
            isLoaded ?
                window.location.href.match(new RegExp('[^/]+(?=/$|$)'))[0] === 'update' ?
            <Outlet />
            :
            <div className="track-view container">
                <br />
                <h1 className="track-view title">{ track.title || '' }</h1>
                <br />
                <div className="track-view body">
                    { track.id && (
                        <button className="play-track overlay" onClick={ handleClick }>
                            <i className="fa-solid fa-play-circle" />
                            { track.photoUrl ? 
                                <img src={ track.photoUrl } /> 
                                : 
                                <i className="fa-solid fa-compact-disc" />
                            }
                        </button>
                    )}
                    <div className="track-view details">
                        <div className="track-view artist-info">
                            { track.artist &&
                            <NavLink to={ `/@/${ track.artist.username || '' }`}>
                                <i className="fa-solid fa-user" /> { track.artist.username || '' }
                            </NavLink> }
                        </div>
                        {/* <div className="track-view date">
                            <i className="fa-solid fa-clock" /> { track && dateTrack(track.createdAt) }
                        </div> */}
                        <br />
                        <div className="track-view description">
                            <i className="fa-solid fa-comment" /> <p>{ track.description || '' }</p>
                        </div>

                        <div className="track-view genre">
                            <i className="fa-solid fa-radio" /> <p>{ track.genre || '' }</p>
                        </div>
                    </div>
                <button className="play-track button" onClick={ handleClick } >
                    <i className="fa-solid fa-play" /> Play this track!
                </button>
                </div>
            </div>
        :
        <div className="track-view container">
        <h1>Loading...</h1>
        </div>

    )
}