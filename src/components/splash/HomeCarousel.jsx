
import Carousel from 'react-material-ui-carousel'
import './HomeCarousel.css'
import { useNavigate } from 'react-router-dom'

export default function HomeCarousel ({ props }) {
    const navigate = useNavigate();

    return (
        <Carousel className="carousel" animation='slide'>
            <div id='carousel-page-1' className="carousel-page" key={1}>
                <img src='/images/pexels-martin-lopez-2240771.jpg' height="500px"></img>
                <h1>Make the next big wave.</h1>
                <button onClick={(e) => navigate('/signup?redirect=/upload')}>Get Started</button>
            </div>
        </Carousel>
    )
}