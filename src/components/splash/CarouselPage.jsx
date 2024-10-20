import { Children } from "react"
import { useState, useEffect } from "react"

export default function CarouselPage({ props, children }) {

    const [buttons, setButtons] = useState([])
    useEffect(() => {
        Children.forEach(children, child => {
            if(child.type === "button") setButtons([...buttons, child]);
        })
    },[])
    
    return (
        <div className="carousel page">
            <ul className="carousel button-list">
                {buttons}
            </ul>
        </div>
    )
}