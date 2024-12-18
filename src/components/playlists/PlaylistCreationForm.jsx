import { useSearchParams } from "react-router-dom"
import * as trackActions from "../../store/track"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


export default function PlaylistCreationForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();

    const list = searchParams.get("list");
    
    const playlist = list.match(/\[([\d,]+)\]/)[1].split(",").map(num => parseInt(num));
    
    useEffect(() => {
        dispatch(trackActions.getTracks(playlist))
    },[])

    // const playlistTracks = Object.entries(useSelector(state => state.tracks));
        
    
    return (
        <div>
            <form htmlFor={'create-playlist'}>
                <input>
                </input>
            </form>
        </div>
    )
}