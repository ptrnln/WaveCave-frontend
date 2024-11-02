import { forwardRef } from "react";

const QueueItem = forwardRef(({track, listeners, ...props}, ref) => {
    debugger
    console.log(listeners)
    return (
        <li key={props.id} {...props} ref={ref}>
            <div className="queue-item" >
                <div {...listeners} className="handle container">
                    <i className="fa-solid fa-grip-vertical handle"></i>
                </div>
                <span className="title">{track.title}</span> 
                <span className="artist">{track.artist.username}</span>
            </div>
        </li>
    )
}, );
export default QueueItem 
