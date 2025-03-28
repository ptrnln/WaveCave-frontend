// Purpose: Redux store for audio player state management

// ---------- TO DO ----------
// - Rename 'original' to 'native' in queue object and in all references
// - Either replace 'currentIndex' with 'currentTrackId' or 'currentIndex'
//   will have to be taken into account when the user is rearranging the queue

// ---- STANDARD ACTION TYPES ----
// PLAY_TRACK           f(x) => { type: PLAY_TRACK }
// PAUSE_TRACK          f(x) => { type: PAUSE_TRACK }
// PLAY_NEXT            f(x) => { type: PLAY_NEXT }
// PLAY_PREV            f(x) => { type: PLAY_PREV }
// REPLAY_TRACK         f(x) => { type: REPLAY_TRACK }
// SET_SHUFFLE_ON       f(x) => { type: SET_SHUFFLE_ON }
// SET_SHUFFLE_OFF      f(x) => { type: SET_SHUFFLE_OFF }
// SET_REPEAT_OFF       f(x) => { type: SET_REPEAT_OFF }
// SET_REPEAT_ONCE      f(x) => { type: SET_REPEAT_ONCE }
// SET_REPEAT_ALWAYS    f(x) => { type: SET_REPEAT_ALWAYS }
// LOAD_TRACKS          f(x) => { type: LOAD_TRACKS, trackIds }
// LOAD_TRACK           f(x) => { type: LOAD_TRACK, trackId }
// SET_VOLUME           f(x) => { type: SET_VOLUME, volume }
// UNLOAD_TRACKS        f(x) => { type: UNLOAD_TRACKS }
// UNLOAD_TRACK         f(x) => { type: UNLOAD_TRACK, trackId }

// ---- STANDARD ACTION CREATORS ----
// playTrack: sets isPlaying to true
// pauseTrack: sets isPlaying to false
// playNext: increments currentIndex by 1
// playPrev: decrements currentIndex by 1 or resets track progression
// loadTrack: sets currentIndex to 0 and sets queue to [action.trackId]
// loadTracks: sets queue to action.trackIds
// unloadTrack: removes track from queue and increments currentIndex by 1
// setShuffleOn: shuffles queue and sets isShuffled to true
// setShuffleOff: sets isShuffled to false
// setRepeatOnce: sets isRepeating to 'once'
// setRepeatAlways: sets isRepeating to 'always'
// setRepeatFalse: sets isRepeating to 'false'

// ---- THUNK ACTION CREATORS ----
// ---- REDUCER ----
// initialState: { 
//  queue: { 
//      original: [], 
//      shuffled: [] 
//  }, 
//  currentIndex: 0, 
//  currentTrackId: null, 
//  isPlaying: false, 
//  isShuffled: false, 
//  isRepeating: 'false', 
//  volume: 60
// }

// import * as playListActions from './playlist';
import * as trackActions from './track';
import { arrayMove } from '@dnd-kit/sortable';


const PLAY_TRACK = 'audioPlayer/PLAY_TRACK';
const PAUSE_TRACK = 'audioPlayer/PAUSE_TRACK';
const PLAY_NEXT = 'audioPlayer/PLAY_NEXT';
const PLAY_PREV = 'audioPlayer/PLAY_PREV';
const SET_SHUFFLE_ON = 'audioPlayer/SHUFFLE_ON';
const SET_SHUFFLE_OFF = 'audioPlayer/SHUFFLE_OFF';
const SET_REPEAT_OFF = 'audioPlayer/REPEAT_OFF';
const SET_REPEAT_ONCE = 'audioPlayer/REPEAT_ONCE';
const SET_REPEAT_ALWAYS = 'audioPlayer/REPEAT_ALWAYS';
const ENQUEUE_TRACKS = 'audioPlayer/ENQUEUE_TRACKS';
const ENQUEUE_TRACK = 'audioPlayer/ENQUEUE_TRACK';
// const SET_VOLUME = 'audioPlayer/SET_VOLUME';
// const CLEAR_QUEUE = 'audioPlayer/CLEAR_QUEUE';
const DEQUEUE_TRACK = 'audioPlayer/DEQUEUE_TRACK';
// const DEQUEUE_TRACKS = 'audioPlayer/DEQUEUE_TRACKS';
const REORDER_QUEUE = 'audioPlayer/REORDER_QUEUE';

const initialState = { 
    queue: {
        original: [],
        shuffled: []
    },
    currentIndex: 0,
    currentTrackId: null,
    isPlaying: false,
    isShuffled: false,
    isRepeating: 'false',
    hasRepeated: false,
    volume: 60,
}



export const playTrack = () => {
    return {
        type: PLAY_TRACK
    }
}

export const pauseTrack = () => {
    return {
        type: PAUSE_TRACK
    }
}

export const playNext = () => {
    return {
        type: PLAY_NEXT
    }
}

export const playPrev = () => {
    return {
        type: PLAY_PREV
    }
}

export const enqueueTrack = (trackId, replace = false) => {
    return {
        type: ENQUEUE_TRACK,
        trackId: parseInt(trackId),
        replace
    }
}

export const enqueueTracks = (trackIds, replace = false) => {

}

export const dequeueTrack = trackId => {
    return {
        type: DEQUEUE_TRACK,
        trackId
    }
}

export const setShuffleOn = () => {
    return {
        type: SET_SHUFFLE_ON,
    }
}

export const setShuffleOff = () => {
    return {
        type: SET_SHUFFLE_OFF
    }
}

export const setRepeatOnce = () => {
    return {
        type: SET_REPEAT_ONCE
    }
}

export const setRepeatAlways = () => {
    return {
        type: SET_REPEAT_ALWAYS
    }
}

export const setRepeatFalse = () => {
    return {
        type: SET_REPEAT_OFF
    }
}

export const loadTrack = (trackId, replace = false) => async (dispatch, getState) => {
    
}

export const loadTracks = (trackIds, replace = false) => async (dispatch, getState) => {
    const state = getState();

    dispatch(trackActions.loadTracksLocally(trackIds));
    
    dispatch({
        type: ENQUEUE_TRACKS,
        trackIds: trackIds.map(id => parseInt(id)),
        replace
    })
}

export const reorderQueue = (trackIds) => {
    if(trackIds.length !== 2) return;
    return {
        type: REORDER_QUEUE,
        trackIds
    }
}

const shuffle = (queue, currentTrackId = queue[0]) => {
    if(queue.length <= 2) return queue;
    const indexOfId = queue.indexOf(currentTrackId);
    const newQueue = queue.filter(ele => ele !== currentTrackId)
    let idx = newQueue.length - 1, randIdx;
    
    while (idx >= 0) {
        randIdx = Math.floor(Math.random() * idx + 1);
        [newQueue[idx], newQueue[randIdx]] = [newQueue[randIdx], newQueue[idx]]
        
        idx--;
    }
    let j = 0

    const completedQueue = queue.map((ele, i)=> {
        if(i === indexOfId) {
            return ele
        }
        j++;
        return newQueue[j - 1]
    })
    return completedQueue
}

export const audioPlayerReducer = (state = initialState, action) => {
    Object.freeze(state);
    let newState = { ...state };

    let queue, shuffledQueue, newIndex, repeated, newQueue;

    switch(action.type) {
        case PAUSE_TRACK:
            return { ...state, isPlaying: false }
        case PLAY_NEXT:
            if(!state.queue.original.length) return state
    
            repeated = state.hasRepeated
            newIndex = state.currentIndex

            if(state.queue.original.length - 1 === state.currentIndex) {
                switch(state.isRepeating) {
                    case 'once':
                        if(!state.hasRepeated) newIndex = 0
                        repeated = true
                        break;
                    case 'always':
                        newIndex = 0
                        repeated = true
                        break;
                    default:
                        newIndex = state.currentIndex
                }
            } else newIndex = state.currentIndex + 1
            
            return {
                ...state,
                currentIndex: newIndex,
                hasRepeated: repeated,
                isPlaying: true,
                queue: {
                    ...state.queue,
                    original: [...state.queue.original],
                    shuffled: [...state.queue.shuffled]
                }
            };
        case PLAY_TRACK:
            return { ...newState, isPlaying: true }
        case PLAY_PREV:
            return { ...state,
                currentIndex: (state.currentIndex === 0 ? state.queue.original.length - 1 : state.currentIndex - 1),
                isPlaying: true
            };
        case ENQUEUE_TRACK:
            queue = state.isShuffled ? state.queue.shuffled : state.queue.original
            if (action.replace) {
                newQueue = [action.trackId]
            } else {
                newQueue = state.queue.original.indexOf(action.trackId) === -1 ? 
                    state.queue.original
                    : state.queue.original.concat([action.trackId])
            }
            return {...state,
                currentIndex: 0,
                // isPlaying: true,
                queue: {
                    original: newQueue,
                    shuffled: shuffle(newQueue, queue[state.currentIndex])
                }
            }
        case ENQUEUE_TRACKS:    
            queue = state.isShuffled ? state.queue.shuffled : state.queue.original
            newQueue = action.replace ?
                action.trackIds
                : queue.concat(action.trackIds.filter(a => queue.indexOf(parseInt(a)) === -1))
            shuffledQueue = shuffle([...newQueue], queue[state.currentIndex])
            return { ...state,
                queue: {
                    original: newQueue,
                    shuffled: shuffledQueue
                },
                hasRepeated: false
            };
        case SET_SHUFFLE_ON:
            queue = state.isShuffled ? state.queue.shuffled : state.queue.original
            shuffledQueue = shuffle(state.queue.original, queue[state.currentIndex])
            return { ...state,
                isShuffled: true,
                queue: {
                    original: state.queue.original,
                    shuffled: shuffledQueue
                }
            }
        case SET_SHUFFLE_OFF:
            newIndex = state.queue.original.indexOf(state.queue.shuffled[state.currentIndex])
            return { ...state, 
                isShuffled: false,
                currentIndex: newIndex
            }
        case SET_REPEAT_OFF:
            return { ...state,
                isRepeating: 'false'
            }
        case SET_REPEAT_ONCE:
            return { ...state,
                isRepeating: 'once'
            }
        case SET_REPEAT_ALWAYS:
            return { ...state, 
                isRepeating: 'always'
            }
        case DEQUEUE_TRACK:
            delete newState.queue.original[action.trackId]
            delete newState.queue.shuffled[action.trackId]
            return newState;
        case REORDER_QUEUE:
            const draggedTrackIdx = state.isShuffled ? 
                state.queue.shuffled.indexOf(action.trackIds[0]) 
                : state.queue.original.indexOf(action.trackIds[0])
            const targetTrackIdx = state.isShuffled ? 
                state.queue.shuffled.indexOf(action.trackIds[1]) 
                : state.queue.original.indexOf(action.trackIds[1])
            if(draggedTrackIdx < state.currentIndex && targetTrackIdx >= state.currentIndex) {
                newState.currentIndex--
            } else if (draggedTrackIdx > state.currentIndex && targetTrackIdx <= state.currentIndex) {
                newState.currentIndex++
            }
            return { ...newState,
                queue: {
                    original: state.isShuffled ? state.queue.original : arrayMove(state.queue.original, draggedTrackIdx, targetTrackIdx),
                    shuffled: !state.isShuffled ? state.queue.shuffled : arrayMove(state.queue.shuffled, draggedTrackIdx, targetTrackIdx)
                }
            }
        default:
            return state;
    }
}