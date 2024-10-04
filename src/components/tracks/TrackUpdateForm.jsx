import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import csrfFetch from "../../store/csrf";
import './TrackUpdateForm.css';
import * as trackActions from '../../store/track';
import { useDispatch, useSelector } from "react-redux";
import routeToAPI from "../../store/api";



const GENRES = [
    "Pop",
    "Rock",
    "Country", 
    "Hip-Hop", 
    "EDM"
]

const SUPPORTED_FILE_TYPES = [
    'mp3',
    'wav',
    'flac'
]

const generateFileTypeRegEx = (fileTypeList) => {
    return new RegExp(`^.*\\.(${fileTypeList.join('|')})$`) 
}

export default function TrackUpdateForm() {
    const dispatch = useDispatch();
    const [isUpdated, setIsUpdated] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState(GENRES[0]);
    const [isNewGenre, setIsNewGenre] = useState(false);
    // const [isAlbum, setIsAlbum] = useState(false);
    // const [artist, setArtist] = useState('');
    const [duration, setDuration] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [trackId, setTrackId] = useState(null);
    const [fileType, setFileType] = useState('');

    const currentUser = useSelector(state => state.session.user)

    const { title, username } = useParams();


    async function getDuration(audioFile) {
        const url = URL.createObjectURL(audioFile);
       
        return new Promise((resolve) => {
            const audio = document.createElement("audio");
            audio.muted = true;
            const source = document.createElement("source");
            source.src = url;
            audio.preload = "metadata";
            audio.appendChild(source);
            audio.onloadedmetadata = function(){
                resolve(audio.duration)
            };
        });
    }

    useEffect(() => {
        if(!currentUser) return <Navigate to='/' />
    }, [currentUser])


    useEffect(() => {
        async function getTrackData() {
            const response = await csrfFetch(routeToAPI(`/api/users/${username}/tracks/${title}`));

            if(response.ok) {
                const data = await response.json();
                const trackData = Object.values(data.track)[0]

                const image = new Image();
                image.src = trackData.photoUrl
                // setArtist(trackData.artist);
                setTrackId(Object.keys(data.track)[0]);
                setNewTitle(title);
                setDescription(trackData.description || '');
                setGenre(trackData.genre);
                setIsNewGenre(!GENRES.includes(trackData.genre));
                setDuration(trackData.duration);
                setFileType(trackData.fileType);
                
                return data
            } else {
                const data = await response.json();
                setErrors(data.errors);
                return data;
            }
        }
        getTrackData();
    }, [title, username])

    
    
    const getFileType = (fileName) => { 
        return fileName.match(generateFileTypeRegEx(SUPPORTED_FILE_TYPES))[1];
    }


    async function handleSubmit(e) {
        
        e.preventDefault();
        setErrors([]);
        const response = await trackActions.updateTrack({
            id: trackId,
            title: newTitle,
            description,
            genre,
            duration,
            fileType
        }, audioFile, imageFile);

        let data = await response.json();
        
        if(response.ok) {
            dispatch(trackActions.receiveTrack(data.track));
            // navigate(`/${encodeURIComponent(currentUser.username)}/${encodeURIComponent(newTitle)}`,
            //     {replace: true})
            setIsUpdated(true);
        } else {
            setErrors(data.errors)
        }
    }

    // if(currentUser === null || currentUser.id !== artist.id) {
    //     navigate(`/${encodeURIComponent(artist.username)}/${encodeURIComponent(title)}`)
    // }

    return(
        <>
        { !isUpdated ?        
        <form 
            className="track-update" 
            htmlFor="track-update"
            onSubmit={handleSubmit}>
            <label htmlFor="title">Title:
                <br />
                <input 
                type="text" 
                className="title-input"
                onChange={(e) => {
                    e.preventDefault();
                    setNewTitle(e.target.value);
                }}
                value={newTitle}
                />
            </label>
            <label htmlFor="description">Description:
                <br />
                <textarea 
                    name="description input" 
                    id="description input" 
                    cols="30" 
                    rows="4" 
                    onChange={(e) => {
                        e.preventDefault();
                        setDescription(e.target.value);
                    }}
                    value={description}
                    style={{resize: 'none'}}
                />
            </label>
            <label htmlFor="genre">Genre:
                <br />
                <select 
                    name="genre select" 
                    id="genre select" 
                    onChange={(e) => {
                        e.preventDefault();
                        if(e.target.value === "other") setIsNewGenre(true);
                        if(GENRES.includes(e.target.value)) {
                            setIsNewGenre(false);
                            setGenre(e.target.value);
                        }
                    }}
                    value={ isNewGenre ? "other" : genre }
                >
                    {
                        GENRES.map((genre, i) => (<option key={i} value={genre}>{genre}</option>))
                    }
                    <option value="other">Other</option>
                </select>
                {isNewGenre ? 
                <>
                    <label htmlFor="genre text-field">
                        <input 
                            type="text" 
                            className="genre input"
                            onChange={(e) => {
                                e.preventDefault();
                                setGenre(e.target.value);
                            }}
                            value={isNewGenre ? genre : ''}
                        />
                    </label>
                </> 
                :
                ''}
            </label>
            <label htmlFor="audio-file">Add an audio file 
            <br />
            <span 
                style={{
                    fontStyle: 'italic',
                    fontSize: 'xx-small'
                }}> (accepts &apos;.wav&apos;, &apos;.mp3&apos;, and &apos;.FLAC&apos; file types):
            </span>
                <br />
                <input 
                    type="file" 
                    className="audio-file input" 
                    accept=".wav,.mp3,.flac"
                    // multiple
                    onChange={async (e) => {
                        e.preventDefault();
                        setAudioFile(e.target.files[0]);
                        setDuration(await getDuration(e.target.files[0]));
                        setFileType(getFileType(e.target.files[0].name));
                    }}
                />
            </label>
            <label htmlFor="image-file">Add an image file 
            <br />
            <span 
                style={{
                    fontStyle: 'italic',
                    fontSize: 'xx-small'
                }}> (accepts &apos;.jpeg&apos;, &apos;.jpg&apos;, and &apos;.png&apos; file types):
            </span>
                <br />
                <input 
                    type="file" 
                    className="image-file input" 
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                        e.stopPropagation();
                        setImageFile(e.target.files[0]);
                    }}
                />
            </label>
            <label htmlFor="errors">{errors.length ? errors.join(", ") : false}</label>
            <button type="submit">Submit</button>
        </form>
        :
        <Navigate to={`/${encodeURIComponent(currentUser.username)}/${encodeURIComponent(newTitle)}`} />
        }
    </>
    )
}
