import { useSelector } from "react-redux";
import Splash from "./components/splash/Splash";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './HomePage.css'

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
        <div className="home">
            <Splash /> 
        </div>
    )
}