

export default function QueueItem({track}) {
    
    return (
        <div className="queue-item">
            {/* <div className="handle"> */}
                <i className="fa-solid fa-grip-vertical handle"></i>
            {/* </div> */}
            <span className="title">{track.title}</span> 
            <span className="artist"> {track.artist.username}</span>
        </div>
    )
}