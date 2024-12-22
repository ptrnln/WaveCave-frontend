import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const QueueItem = forwardRef(({track, listeners, ...props}, ref) => {
    const navigate = useNavigate();
    
    return (
        <li className="queue-item" id={props.id} ref={ref} {...props}>
            <div className="handle" {...(listeners || {})}>
                <i className="fa-solid fa-grip-vertical handle" style={{cursor: 'grab', color: 'grey'}}></i>
            </div>
            <div className="queue-item-image-container">
                <button 
                    className="queue-item-image-button" 
                    onClick={() => { navigate(`/@/${track.artist.username}/${track.title}`)}}
                >
                    { track.photoUrl ? 
                        <img src={track.photoUrl} alt={track.title} className="queue-item-image" /> 
                        : <i className="fa-solid fa-compact-disc" style={{fontSize: '1.5rem', color: 'grey'}} />
                    }
                </button>
            </div>
            <span className="title">{track.title}</span> 
            <span className="artist">{track.artist.username}</span>
        </li>
    )
});
export default QueueItem 
