import QueueItem from "./QueueItem";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities'

export default function SortableQueueItem(props) {
    const { 
        attributes, 
        listeners, 
        setNodeRef,
        transform,
        transition 
    } = useSortable({id: props.id});
    
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