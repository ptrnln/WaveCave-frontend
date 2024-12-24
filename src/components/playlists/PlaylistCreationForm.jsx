import { useSearchParams, useNavigate } from "react-router-dom"
import * as trackActions from "../../store/track"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortablePlaylistFormItem from "./SortablePlaylistFormItem";
import * as playlistActions from "../../store/playlist";

export default function PlaylistCreationForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stateTracks = useSelector(state => state.tracks);
    const [activeId, setActiveID] = useState(null);
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');

    const user = useSelector(state => state.session.user);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const list = searchParams.get("list");
    
    const playlist = list.match(/\[([\d,]+)\]/)[1].split(",").map(num => parseInt(num));

    const [tracks, setTracks] = useState([]);
    
    useEffect(() => {
        dispatch(trackActions.getTracks(playlist));
    }, [])

    useEffect(() => {
        if(playlist.some(id => !stateTracks[id])) return;
        if(Object.keys(stateTracks).length > 0) {
            setTracks(playlist.map(id => stateTracks[id]));
        }
    }, [stateTracks])

    function handleDragStart(e) {
        const {active} = e;
        setActiveID(active.id);
    }

    function handleDragEnd(e) {
        const {active, over} = e;

        if(active.id !== over.id) {
            const oldIndex = tracks.findIndex(track => track.id === active.id);
            const newIndex = tracks.findIndex(track => track.id === over.id);
            setTracks(arrayMove(tracks, oldIndex, newIndex));
        }

        setActiveID(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const playlistTracks = tracks.map(track => track.id);
        
        dispatch(playlistActions.createPlaylist({ publisherId: user.id, title: playlistTitle, description: playlistDescription, trackIds: playlistTracks}));
    }
        
    if(!user) navigate('/');
    
    return (
        <div>
            <form htmlFor={'create-playlist'}>
                <label htmlFor="playlist-name">Playlist Name
                    <input type="text" placeholder="Playlist Name" value={playlistTitle} onChange={e => setPlaylistTitle(e.target.value)}>
                    </input>
                </label>
                <label htmlFor="playlist-description">Playlist Description
                    <input type="text" placeholder="Playlist Description" value={playlistDescription} onChange={e => setPlaylistDescription(e.target.value)}>
                    </input>
                </label>
                <ul>
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={tracks} strategy={verticalListSortingStrategy}>
                            {tracks.length > 0 && tracks.map((track) => (
                                <SortablePlaylistFormItem key={track.id} id={track.id} track={track} />
                            ))}
                        </SortableContext>
                        <DragOverlay>
                            {tracks.find(track => track.id === activeId) ? (
                                <SortablePlaylistFormItem track={tracks.find(track => track.id === activeId)} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </ul>
                <button type="submit" onClick={handleSubmit}>Create Playlist</button>
            </form>
        </div>
    )
}