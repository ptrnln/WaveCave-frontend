import QueueItem from "./QueueItem";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities'

export default function SortableQueueItem(props) {
    const { 
        active,
        attributes, 
        listeners, 
        setNodeRef,
        transform,
        transition 
    } = useSortable({
        id: props.id, 
        disabled: props["aria-disabled"] === "disabled"
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <QueueItem 
            id={props.id}
            ref={setNodeRef} 
            {...props} 
            {...attributes} 
            style={style} 
            listeners={listeners} />
    )
}