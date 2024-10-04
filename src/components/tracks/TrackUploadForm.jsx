import { useState } from "react";
import './TrackUploadForm.css';
import * as trackActions from '../../store/track';
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GENRES = [
    "Pop",
    "Rock",
    "Country", 
    "Hip-Hop", 
    "EDM"
]

const SUPPORTED_MIME_TYPES = [
    'mp3',
    'wav',
    'flac'
]

const generateFileTypeRegEx = (fileTypeList) => {
    return new RegExp(`.(${fileTypeList.join('|')})$`) 
}

export default function TrackUploadForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState(GENRES[0]);
    const [isNewGenre, setIsNewGenre] = useState(false);
    // const [isAlbum, setIsAlbum] = useState(false);
    const [duration, setDuration] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [errors, setErrors] = useState([]);
    // const router = useR
    const navigate = useNavigate()

    const currentUser = useSelector(state => state.session.user)

    async function getDuration(audioFile) {
        const url = URL.createObjectURL(audioFile);
       
        return new Promise((resolve) => {
            const audio = document.createElement("audio");
            audio.muted = true;
            const source = document.createElement("source");
            source.src = url;
            audio.preload= "metadata";
            audio.appendChild(source);
            audio.onloadedmetadata = function(){
                resolve(audio.duration)
            };
        });
    }

    const getFileType = (fileName) => {
        const matchData = fileName.match(generateFileTypeRegEx(SUPPORTED_MIME_TYPES))
        if (matchData) {
            return matchData[1] === "mp3" ? "mpeg": matchData[1]
        } 
        return null
    }

    async function handleSubmit(e) {
        e.stopPropagation();
        e.preventDefault();
        setErrors([]);
        
        try {
            if (!audioFile) {
                setErrors(["Source file not found"]);
                return
            }
            const fileType = getFileType(audioFile.name);
            
            if(!SUPPORTED_MIME_TYPES.includes(fileType)) {
                setErrors(["Audio file type not supported"])
                return
            }
            setDuration(await getDuration(audioFile));
            const response = await trackActions.createTrack({
                title,
                artistId: currentUser.id,
                description,
                genre,
                duration,
                fileType
            }, audioFile, imageFile);

            if(response.errors) {
                setErrors(response.errors)
            } else {
                navigate(`/@/${encodeURIComponent(currentUser.username)}/${encodeURIComponent(title)}`)
            }
        } catch (err) {
            setErrors([err])
        }
        
    }

    if(!currentUser) return <Navigate to='/' />

    return(
        <form name="upload-form" onSubmit={handleSubmit}>
            <h1>Upload Track</h1>
            <label htmlFor="title">Title:
                <br />
                <input 
                type="text" 
                className="title-input"
                onChange={(e) => {
                    e.stopPropagation();
                    setTitle(e.target.value);
                }}
                value={title}
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
                        e.stopPropagation();
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
                        e.stopPropagation();
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
                                e.stopPropagation();
                                setGenre(e.target.value);
                            }}
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
                    onChange={async (e) => {
                        e.stopPropagation();
                        setAudioFile(e.target.files[0]);
                        setDuration(await getDuration(e.target.files[0]))
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
            <label htmlFor="errors">{errors.length ? errors.join(", ") : null}</label>
            <button type="submit">Submit</button>
        </form>
    )
}