import { useSelector } from "react-redux"
import QueueItem from "./QueueItem";
import React, { useState, useCallback, useMemo, useEffect} from "react";
// import './QueueControl.css'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import SortableQueueItem from "./SortableQueueItem";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

// import * as playlistActions from '../../store/playlist.js'

const collisionAlgorithm = (args) => {
    const {
      active,
      collisionRect,
      droppableContainers,
      droppableRects,
      pointerCoordinates
    } = args;
  
    droppableRects.delete('container-id');
  
    return closestCenter({
      active,
      collisionRect,
      droppableContainers,
      droppableRects,
      pointerCoordinates
    });
  };

export default function QueueControl () {
    const [display, setDisplay] = useState(false);
    const [activeId, setActiveID] = useState(null);
    const queue = useSelector(state => {
        return state.audio.isShuffled ?
            state.audio.queue.shuffled
            : state.audio.queue.original
    });

    
    const sensors = useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            }),
            useSensor(MouseSensor)
        )

    const currentIndex = useSelector(state => state.audio.currentIndex);

    const stateTracks = useSelector(state => state.tracks);

    const tracks = useMemo(() => (queue
        .slice(currentIndex + 1)
        .concat(queue.slice(0, currentIndex)))
        .map(idx => stateTracks[idx]),
    [queue, currentIndex, stateTracks])

    const toggleDisplay = useCallback((e) => {
        e.preventDefault();
        setDisplay(!display);
    }, [display]);

    const handlePlaylistSave = (e) => {
        e.preventDefault();
        
    }

    const handleDragStart = (e) => {
        const {active} = e;
        setActiveID(active.id);
        debugger
    }

    const handleDragEnd = (e) => {
        const {active, over} = e;
        // debugger
        if(active.id !== over.id) {
            /* logic to swap items */
        }
        setActiveID(null);
    }
    // debugger
    
    return (
        <div className="queue-control container">
            <button className="queue-control button" onClick={toggleDisplay} title="Playlist menu">
                <i className="fa-solid fa-music"/>
            </button>
            <div className={display ? "queue-control inner hidden" : "queue-control inner"}>
                <div className="queue-control-header">
                    <span>Next Up</span>
                    <button onClick={handlePlaylistSave}>Save Playlist</button>
                </div>
                <ul id="queue-list">
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={tracks} strategy={verticalListSortingStrategy}>
                            { tracks.length ?  
                                tracks.map((track, idx) => ( 
                                    <SortableQueueItem key={track.id} track={track} id={track.id}/>
                                ))
                                : null 
                            }
                        </SortableContext>
                        <DragOverlay>
                            { activeId ? 
                                <QueueItem track={tracks[activeId]} id={'overlay'}/>
                                : null
                            }
                        </DragOverlay>
                    </DndContext>
                </ul>
            </div>
        </div>
    )
    
}