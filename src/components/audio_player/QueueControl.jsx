import { useSelector } from "react-redux"
import React, { useState, useCallback, useEffect, useReducer} from "react";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, useDndContext } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import SortableQueueItem from "./SortableQueueItem";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as audioPlayerActions from '../../store/audioPlayer.js'
import * as sessionActions from '../../store/session.js'
import QueueItem from "./QueueItem";


export default function QueueControl () {
    const navigate = useNavigate();
    const [display, setDisplay] = useState(false);
    const [activeId, setActiveID] = useState(null);
    const [dndContextKey, setDndContextKey] = useState(0);
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const currentUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const queue = useSelector(state => {
        return state.audio.isShuffled ?
            state.audio.queue.shuffled
            : state.audio.queue.original
    });
    const [, setSearchParams] = useSearchParams();
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
    const dndContext = useDndContext();

    useEffect(() => {
        if(+activeId === queue[currentIndex]) {
            // Force end the drag operation through dnd-kit
            const { active } = dndContext;
            if (active) {
                dndContext.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
                dndContext.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
                dndContext.dispatchEvent(new TouchEvent("touchend", { bubbles: true }));
                // End drag for pointer/touch events
                active.node.current?.dispatchEvent(
                    new Event('drop', { bubbles: true })
                );
            }
        }
    }, [activeId, queue, currentIndex, dndContext])

    useEffect(() => {
        window.addEventListener('resize', forceUpdate)
        // window.addEventListener('drag', handleDragInterruption)
        
        return () => {
            window.removeEventListener('resize', forceUpdate)
            // window.removeEventListener('drag', handleDragInterruption)
        }
    }, [])

    const tracks = queue.map(idx => ({ ...stateTracks[idx], id: stateTracks[idx]?.id?.toString()}))

    const toggleDisplay = useCallback((e) => {
        e.preventDefault();
        setDisplay(!display);
    }, [display]);

    const handlePlaylistSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!currentUser) {
            // setSearchParams({ "login-redirect": encodeURIComponent(`/create-playlist?list=[${queue.join(',')}]`) });
            navigate(`?login-redirect=/create-playlist?list=[${queue.join(',')}]`);
            dispatch(sessionActions.showModal());
            return;
        }
        if(!queue.length) return;
        navigate(`/create-playlist?list=[${queue.join(',')}]`);
    }

    function handleDragStart(e) {
        const {active} = e;
        if(+active.id === queue[currentIndex]) return;
        setActiveID(active.id);
        document.body.style.cursor = 'grabbing';
        document.body.style.pointerEvents = 'none';
    }

    function handleDragEnd (e) {
        setActiveID(null);
        document.body.style.cursor = 'default';
        document.body.style.pointerEvents = 'auto';
        const {active, over} = e;
        if(+active.id === queue[currentIndex]) return;
        if(active?.id !== over?.id) {
            dispatch(audioPlayerActions.reorderQueue([parseInt(active.id), parseInt(over.id)]))
        }
    }
    
    return (
        <div className="queue-control container">
            <button id="playlist-menu-button" className="queue-control button" onClick={toggleDisplay} title="Open/close playlist menu" disabled={tracks.length === 0}>
                <i className="wc wc-music-list"/>
            </button>
            <div className={display ? "queue-control inner" : "queue-control inner hidden"}>
                <div className="queue-control-header">
                    <h4>Next Up</h4>
                    <div className="button_container">
                        <button onClick={handlePlaylistSave} disabled={tracks.length === 0}>
                            <i className="fa-solid fa-floppy-disk"  title="Save playlist" style={{ fontSize: '1rem' }}/>
                        </button>
                        <button onClick={() => setDisplay(false)}>
                            <i className="fa-solid fa-xmark"  title="Close playlist menu" style={{ fontSize: '1rem' }}/>
                        </button>
                    </div>
                </div>
                <ul id="queue-list" style={{ backgroundColor: '#d8d8d8' }}>
                    <DndContext 
                        key={dndContextKey}
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}>
                        <SortableContext items={tracks} strategy={verticalListSortingStrategy}>
                            { tracks.length > 0 && (
                                tracks.map((track, idx) => (
                                    <SortableQueueItem 
                                        key={track.id} 
                                        track={track} 
                                        id={track.id} 
                                        data-dragging={activeId === track.id ? "true" : "false"}
                                        data-played={idx < currentIndex && activeId !== track.id ? "played" : null} 
                                        aria-disabled={parseInt(idx) == parseInt(currentIndex) ? "disabled" : null}
                                    />
                                ))
                            )}
                        </SortableContext>
                        { activeId &&
                            <DragOverlay style={{ opacity: 0.5 }} modifiers={[restrictToParentElement]}>
                            </DragOverlay>
                        }
                    </DndContext>
                </ul>
            </div>
        </div>
    )
}