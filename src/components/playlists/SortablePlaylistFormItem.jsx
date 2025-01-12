import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'
import PlaylistFormItem from "./PlaylistFormItem";

export default function SortablePlaylistFormItem(props) {
    const { 
        attributes, 
        listeners, 
        setNodeRef,
        transform,
        transition 
    } = useSortable({
        id: props.id, 
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    return (
        <PlaylistFormItem 
            listeners={listeners}
            style={style} 
            ref={setNodeRef} 
            {...attributes}
            {...props}
        />
    )
}