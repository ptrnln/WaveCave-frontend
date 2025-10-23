import { NavLink, Outlet, useLoaderData } from "react-router-dom"
import './TrackView.css'
import { useDispatch, useSelector } from "react-redux";
import * as audioActions from '../../store/audioPlayer';
import { useEffect, useState } from "react";
import useParams from "../../hooks/useParams";
import Loading from "../../Loading";

export default function TrackView() {
    const dispatch = useDispatch();
    // const { username, title } = useParams();

    const track = useLoaderData();
    const date = new Date(track.createdAt);
    const [isLoaded, setIsLoaded] = useState(false);

    const titles = [
        `Vibing to ${track.title} by ${track.username} - WaveCave`,
    ]

    useEffect(() => {
        if(track.title && track.artist.username) {
            document.title = titles[Math.floor(Math.random() * titles.length)]
        }
    }, [track.title, track.username])

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
            return `${Math.floor(timeAgoInSeconds / 60)} minute${timeAgoInSeconds > 120 ? "s" : ''} ago`
        }
        if(timeAgoInSeconds < 86400) {
            return `${Math.floor(timeAgoInSeconds / 3600)} hour${timeAgoInSeconds > 7200 ? "s" : ''} ago`
        }
        if(timeAgoInSeconds < 604800) {
            return `${Math.floor(timeAgoInSeconds / 86400)} day${timeAgoInSeconds > 172800 ? "s" : ''} ago`
        }
        if(timeAgoInSeconds < 2592000) {
            return `${Math.floor(timeAgoInSeconds / 604800)} week${timeAgoInSeconds > 1209600 ? "s" : ''} ago`
        }
        if(timeAgoInSeconds < 31536000) {
            return `${Math.floor(timeAgoInSeconds / 2592000)} month${timeAgoInSeconds > 5184000 ? "s" : ''} ago`
        }
        return `${Math.floor(timeAgoInSeconds / 31536000)} year${timeAgoInSeconds > 63072000 ? "s" : ''} ago`
    }

    useEffect(() => {
        if (track && !isLoaded) setIsLoaded(true);
    }, [track, isLoaded]);

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
                        <div className="track-view date" title={`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]}, ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]} ${date.getDate()}${(date.getDate() % 10 === 1 && (date.getDate() / 10) % 10 !== 1)  ? 'st' : (date.getDate() % 10 && (date.getDate() / 10) % 10 !== 1) === 2 ? 'nd' : (date.getDate() % 10 && (date.getDate() / 10) % 10 !== 1) === 3 ? 'rd' : 'th'}, ${date.getFullYear().toString()}`}>
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
            <Loading/>
        </div>

    )
}