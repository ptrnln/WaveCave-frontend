import { NavLink, Outlet } from "react-router-dom"
import './TrackView.css'
import { useDispatch, useSelector } from "react-redux";
import * as audioActions from '../../store/audioPlayer';
import * as trackActions from '../../store/track';
import { useEffect, useState } from "react";
import useParams from "../../hooks/useParams";
// import { useEffect } from "react";

export default function TrackView() {
    const dispatch = useDispatch();
    const { username, title } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);

    const titles = [
        `${title} by ${username} - WaveCave`,
    ]

    useEffect(() => {
        document.title = titles[Math.floor(Math.random() * titles.length)]
    }, [title, username])


    const track = useSelector(state => {
        let track;
        Object.keys(state.tracks).forEach(id => {
            if(state.tracks[id]?.artist?.username == username.replaceAll("@", "") && state.tracks[id]?.title == title){
                track = state.tracks[id]
            }
        })
        return track;
    })
    
    

    async function handleClick (e) {
        e.preventDefault(); 
        dispatch(audioActions.loadTracks([parseInt(track.id)]));
        dispatch(audioActions.playTrack());
    }

    const dateTrack = timestamp => {
        const release = new Date(timestamp);
        
        const timeAgoInSeconds = (Date.now() - release.getTime()) / 1000;

        if(timeAgoInSeconds < 60) {
            return "just now"
        }
        if(timeAgoInSeconds < 3600) {
            return `${Math.floor(timeAgoInSeconds / 60)} minutes ago`
        }
        if(timeAgoInSeconds < 86400) {
            return `${Math.floor(timeAgoInSeconds / 3600)} hours ago`
        }
        if(timeAgoInSeconds < 604800) {
            return `${Math.floor(timeAgoInSeconds / 86400)} days ago`
        }
        if(timeAgoInSeconds < 2592000) {
            return `${Math.floor(timeAgoInSeconds / 604800)} weeks ago`
        }
        if(timeAgoInSeconds < 31536000) {
            return `${Math.floor(timeAgoInSeconds / 2592000)} months ago`
        }
        return `${Math.floor(timeAgoInSeconds / 31536000)} years ago`
    }

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
            const trackData = await trackActions.getTrackByUserNameAndTitle(username.replaceAll("@", ""), title);
            dispatch(trackActions.receiveTrack(trackData));
        }})();
    }, [track, dispatch, username, title])

    return (
            isLoaded ?
                window.location.href.match(new RegExp('[^@/]+(?=/$|$)'))[0] === 'update' ?
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
                            <NavLink to={ `/@${ track.artist.username || '' }`}>
                                <i className="fa-solid fa-user" /> { track.artist.username || '' }
                            </NavLink> }
                        </div>
                        <div className="track-view date">
                            <i className="fa-solid fa-clock" /> { track && dateTrack(track.createdAt) }
                        </div>
                        <br />
                        <div className="track-view description">
                            <i className="fa-solid fa-comment" /> <p>{ track.description || '' }</p>
                        </div>

                        <div className="track-view genre">
                            <i className="fa-solid fa-radio" /> <p>{ track.genre || '' }</p>
                        </div>
                    </div>
                <button className="play-track button" onClick={ handleClick } >
                    <i className="fa-solid fa-play" style={{ letterSpacing: '5px' }}/>Play this track!
                </button>
                </div>
            </div>
        :
        <div className="track-view container">
        <h1>Loading...</h1>
        </div>

    )
}