import csrfFetch from "./csrf";
import routeToAPI from "./api";

const REMOVE_PLAYLIST = 'playlist/REMOVE_PLAYLIST';
const REMOVE_PLAYLISTS = 'playlist/REMOVE_PLAYLISTS';
const RECEIVE_PLAYLIST = 'playlist/RECEIVE_PLAYLIST';
const RECEIVE_PLAYLISTS = 'playlist/RECEIVE_PLAYLISTS';
const NEW_PLAYLIST = 'playlist/NEW_PLAYLIST';
const SHOW_MODAL = 'playlist/SHOW_MODAL';
const HIDE_MODAL = 'playlist/HIDE_MODAL';

const initialState = {
    playlists: {},
    modalVisible: false,
    newPlaylist: null
}

export const receivePlaylist = playlist => {
    return {
        type: RECEIVE_PLAYLIST,
        payload: playlist
    }
}

export const receivePlaylists = playlists => {
    return {
        type: RECEIVE_PLAYLISTS,
        payload: playlists
    }
}

export const removePlaylist = playlistId => {
    return {
        type: REMOVE_PLAYLIST,
        payload: playlistId
    }
}

export const removePlaylists = playlistIds => {
    return {
        type: REMOVE_PLAYLISTS,
        payload: playlistIds
    }
}

export const showModal = () => {
    return {
        type: SHOW_MODAL
    }
}

export const hideModal = () => {
    return {
        type: HIDE_MODAL
    }
}

export const newPlaylist = (trackIds = []) => {
    return {
        type: NEW_PLAYLIST,
        payload: trackIds
    }
}

export const createPlaylist = playlist => async (dispatch) => {

    const trackIds = playlist.trackIds || [];

    const response = await csrfFetch(routeToAPI('/api/playlists'), {
        method: 'POST',
        body: JSON.stringify(playlist.filter(key => key !== 'trackIds'))
    })

    if(response.ok) {
        trackIds.forEach(async trackId => {
            await csrfFetch(routeToAPI(`/api/playlist_tracks/`), {
                method: 'POST',
                body: JSON.stringify({ trackId })
            })
        })
        const data = await response.json();
        dispatch(receivePlaylist(data.playlist))
        return data;
    }
}

export const loadPlaylist = playlistId => async (dispatch, getState) => {
    const playlist = getState().playlists[playlistId];
    if(playlist === undefined) {
        const response = await fetch(routeToAPI(`/api/playlists/${playlistId}`));

        if(response.ok) {
            let data = await response.json();
            dispatch(receivePlaylist(data.playlist));
            return data.playlist;
        } else {
            return response.error
        }
    } else {
        return playlist;
    }
}

export const savePlaylist = (playlist) => async (dispatch) => {
    const response = await csrfFetch(routeToAPI(`/api/playlists/${playlist.id}`), {
        method: 'PUT',
        body: JSON.stringify(playlist)
    })

    if(response.ok) {
        const data = await response.json();
        dispatch(receivePlaylist(data.playlist))
        return data;
    }
}

export default function playlistReducer(state = initialState, action) {
    let newState = { ...(Object.freeze(state)) }

    switch (action.type) {
        case RECEIVE_PLAYLIST:
            return { newState, 
                playlists: { ...newState.playlists, 
                    [action.payload.id]: action.payload 
                } 
            }
        case RECEIVE_PLAYLISTS:
            return { newState, 
                playlists: { ...newState.playlists,
                ...action.payload 
                }
            }
        case REMOVE_PLAYLIST:
            delete newState.playlists[action.payload]
            return newState
        case REMOVE_PLAYLISTS:
            action.payload.forEach(playlistId => {
                delete newState.playlists[playlistId];
            });
            return newState;
        case SHOW_MODAL:
            return { ...newState, modalVisible: true }
        case HIDE_MODAL:
            return { ...newState, modalVisible: false }
        case NEW_PLAYLIST:
            if(action.payload.length > 0) {
                return { ...newState, newPlaylist: {
                    title: '',
                    description: '',
                    isPublic: true,
                    trackIds: action.payload
                } }
            }
            // if(action.payload.length === 0) {
                
            // }
            break;
        default:
            return state;
    }
}