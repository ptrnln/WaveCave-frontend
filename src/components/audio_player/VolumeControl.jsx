export default function VolumeControl({ audioRef }) {

    return (
        <div className="volume-control container">
                <input 
                    type="range" 
                    onChange={(e) => {
                        audioRef.current.volume = e.target.value / 100
                }}/>
        </div>
    )
}