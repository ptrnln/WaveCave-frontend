import { useDispatch, useSelector } from "react-redux";
import './Navigation.css'
import ProfileButton from "./ProfileButton";
import { NavLink } from "react-router-dom";
import logo from '/images/WaveCave logo HomeNavLink.svg';
import * as audioPlayerActions from '../../store/audioPlayer';
import * as trackActions from '../../store/track';
import * as sessionActions from '../../store/session';
import routeToAPI from "../../store/api";




const Navigation = () => {
    const isLoggedIn = useSelector(state => !!state.session.user)
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);

    const showLoginModal = (e) => {
        e.preventDefault();
        dispatch(sessionActions.showModal());
    }

    const handleLoadTracks = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(routeToAPI('/api/tracks'));
            const data = await response.json();
            
            const tracks = data.tracks;
            dispatch(trackActions.receiveTracks(tracks));
            dispatch(audioPlayerActions.loadTracks(Object.keys(tracks)));
            dispatch(audioPlayerActions.playTrack());
        }
        catch (err) {
            console.error(err);
        }
    }


    return (
        <div id='navigation-bar'>
            <ul>
                <li key={'nav-link home'}>
                    <NavLink to={ isLoggedIn ? '/feed' : '/' } className='nav-link home'><img href=""  className="logo" src={logo}></img></NavLink>
                </li>
                <li key={'site-name'}>
                    <span id="site-name" style={{'fontSize': 'xx-large', 'color': 'white'}}>WaveCave</span>
                </li>
                <li key='nav-link feed'>
                    <NavLink to='/feed' className='nav-link feed'>Feed</NavLink>
                </li>
                { 
                sessionUser ?
                <> 
                    <li key={'profile-button'}>
                        <ProfileButton className='profile button'user={sessionUser}/>
                    </li>
                </> :
                <>
                    <li key={'nav-link signup'}>
                        <NavLink to={"/signup"} className={"nav-link signup"}>Sign Up</NavLink>
                    </li>
                    <li key={'nav-link login'}>
                        <button className='nav-link login' onClick={showLoginModal}>Log In</button>
                    </li>
                </>
                }
                <li key={'nav-link load-tracks'}>
                    <button className={'nav-link load-tracks'}onClick={handleLoadTracks}>Load some Tracks!</button>
                </li>
            </ul>
        </div>
    )
}

export default Navigation;