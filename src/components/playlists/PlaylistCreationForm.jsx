import { useSearchParams } from "react-router-dom"
import * as trackActions from "../../store/track"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";


export default function PlaylistCreationForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const stateTracks = useSelector(state => state.tracks);

    const list = searchParams.get("list");
    
    const playlist = list.match(/\[([\d,]+)\]/)[1].split(",").map(num => parseInt(num));
    
    useEffect(() => {
        dispatch(trackActions.getTracks(playlist))
    },[])

    // const playlistTracks = Object.entries(useSelector(state => state.tracks));
        
    
    return (
        <div>
            <form htmlFor={'create-playlist'}>
                <label htmlFor="playlist-name">Playlist Name
                    <input type="text" placeholder="Playlist Name">
                    </input>
                </label>
                <label htmlFor="playlist-description">Playlist Description
                    <input type="text" placeholder="Playlist Description">
                    </input>
                </label>
                <ul>
                    <SortableContext items={playlist.map(id => stateTracks[id])} strategy={verticalListSortingStrategy}>
                        {playlist.map((id) => (
                            <li key={stateTracks[id].id}>{stateTracks[id].title}</li>
                        ))}
                    </SortableContext>
                </ul>
            </form>
        </div>
    )
}