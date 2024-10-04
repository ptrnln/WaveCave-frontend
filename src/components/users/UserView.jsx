import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLoaderData } from "react-router-dom";
import * as trackActions from '../../store/track'
import * as userActions from '../../store/user'
import TrackIndexItem from "../tracks/TrackIndexItem";
import '../tracks/TrackIndexItem.css'

export default function UserView() {
    const { user } = useLoaderData();

    // const userTracks = useSelector(state => {  
    //     return state.users[user.id]?.tracks || {}
    // });
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.receiveUser(Object.fromEntries([[user.id, user]])))
        if (user.tracks) dispatch(trackActions.loadTracks(Object.keys(user.tracks)))
    }, [user, dispatch])

    // useEffect(() => {
    //     dispatch(userActions.viewUser({ username: user.username }));
    // }, [dispatch, user.username])
    
    return (
        <>
            {
                user && window.location.href.match(new RegExp('[^/]+(?=/$|$)'))[0] === encodeURIComponent(user.username) ?
                
                <div id="user-view page">
                    <h1>{ user.username }</h1>
                    <ul className="track-index">
                        {
                            user.tracks && Object.keys(user.tracks).map(id => <li key={id}><TrackIndexItem track={{
                                ...user.tracks[id],
                                artist: {
                                    id: user.id,
                                    username: user.username,
                                    email: user.email,
                                    createdAt: user.createdAt,
                                    updatedAt: user.updatedAt
                                }
                            }}/></li>)
                        }
                    </ul>
                </div>
                :
                <></>
            }
            <Outlet />
        </>
    )
}