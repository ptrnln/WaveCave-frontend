import { useSelector } from "react-redux"
import QueueItem from "./QueueItem";
import React, { useState, useCallback, useEffect, useReducer} from "react";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import SortableQueueItem from "./SortableQueueItem";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as audioPlayerActions from '../../store/audioPlayer.js'


export default function QueueControl () {
    const navigate = useNavigate();
    const [display, setDisplay] = useState(false);
    const [activeId, setActiveID] = useState(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const dispatch = useDispatch();
    const queue = useSelector(state => {
        return state.audio.isShuffled ?
            state.audio.queue.shuffled
            : state.audio.queue.original
    });

    const currentIndex = useSelector(state => state.audio.currentIndex)    
    const stateTracks = useSelector(state => state.tracks);

    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    const sensors = useSensors(
        isTouchDevice() ? useSensor(TouchSensor) : useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    useEffect(() => {
        window.addEventListener('resize', forceUpdate)
        
        return () => {
            window.removeEventListener('resize', forceUpdate)
        }
    }, [])

    const tracks = queue.map(idx => ({ ...stateTracks[idx], id: stateTracks[idx].id.toString()}))

    const toggleDisplay = useCallback((e) => {
        e.preventDefault();
        setDisplay(!display);
    }, [display]);

    const handlePlaylistSave = (e) => {
        e.preventDefault();
        if(!queue.length) return
        navigate(`/create-playlist?list=[${queue.join(',')}]`)
    }

    function handleDragStart(e) {
        const {active} = e;
        setActiveID(active.id);
    }

    function handleDragEnd (e) {
        const {active, over} = e;
        if(active.id !== over.id) {
            dispatch(audioPlayerActions.reorderQueue([parseInt(active.id), parseInt(over.id)]))
        }
        setActiveID(null);
    }
    
    return (
        <div className="queue-control container">
            <button className="queue-control button" onClick={toggleDisplay} title="Playlist menu" >
                <i className="wc wc-music-list"/>
            </button>
            <div className={display ? "queue-control inner hidden" : "queue-control inner"}>
                <div className="queue-control-header">
                    <h4>Next Up</h4>
                    <button onClick={handlePlaylistSave} disabled={tracks.length === 0}>
                        <i className="fa-solid fa-floppy-disk"  title="Save Playlist" style={{ fontSize: '1rem' }}/>
                    </button>
                </div>
                <ul id="queue-list">
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={tracks} strategy={verticalListSortingStrategy}>
                            { tracks.length > 0 && (
                                tracks.map((track, idx) => (
                                    <SortableQueueItem 
                                        key={track.id} 
                                        track={track} 
                                        id={track.id} 
                                        data-played={idx < currentIndex ? "played" : null} 
                                        aria-disabled={parseInt(idx) == parseInt(currentIndex) ? "disabled" : null}
                                    />
                                ))
                            )}
                        </SortableContext>
                        <DragOverlay>
                            { activeId ? 
                                <QueueItem  track={tracks.find(t => t.id === activeId)} id="overlay"/>
                                : null
                            }
                        </DragOverlay>
                    </DndContext>
                </ul>
            </div>
        </div>
    )
    
}