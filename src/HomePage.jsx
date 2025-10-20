import { useSelector } from "react-redux";
import Splash from "./components/splash/Splash";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './HomePage.css'
import HomeCarousel from "./components/splash/HomeCarousel";

export default function HomePage() {
    const isLoggedIn = useSelector(state => !!state.session.user);
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn) navigate('/feed');
    }, [isLoggedIn])

    useEffect(() => {
        document.title = 'Welcome to WaveCave!'
    }, [])

    return (
        <>
            <div className="home">
                <div style={{ height: "3px", display:"flex", backgroundColor:"#f50"}}></div>
                <HomeCarousel /> 
                {/* <object data="/images/WaveCave-loading.svg" type="image/svg+xml" height={"200px"}/> */}
            </div>
        </>
    )
}