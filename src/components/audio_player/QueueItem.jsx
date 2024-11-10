import { forwardRef } from "react";

const QueueItem = forwardRef(({track, listeners, ...props}, ref) => {
    debugger
    console.log(listeners)

    return (
        <li className="queue-item" id={props.id} ref={ref} {...props}>
            <div className="handle" {...(listeners || {})}>
                <i className="fa-solid fa-grip-vertical handle"></i>
            </div>
            <span className="title">{track.title}</span> 
            <span className="artist">{track.artist.username}</span>
        </li>
    )
}, );
export default QueueItem 
