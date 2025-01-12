import { forwardRef } from "react";

const PlaylistFormItem = forwardRef(({track, listeners, ...props}, ref) => {

    return (
        <li {...props} ref={ref}>
            { listeners ? 
                <div className="handle" {...listeners}>
                    <i className="fa-solid fa-grip-vertical handle" style={{cursor: 'grab', color: 'grey'}}></i>
                </div> 
                : null 
            }
            {track.title}
        </li>
    )
});

export default PlaylistFormItem;