export default function QueueItem({track}) {

    return (
        <div className="queue-item">
            <span className="title">{track.title}</span> 
            <span className="artist"> {track.artist.username}</span>
        </div>
    )
}