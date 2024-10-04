import { useSelector } from "react-redux";
import Splash from "./Splash";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './HomePage.css'

export default function HomePage() {
    const isLoggedIn = useSelector(state => !!state.session.user);
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn) navigate('/feed');
    })

    return (
        <div className="home">
            <Splash /> 
        </div>
    )
}