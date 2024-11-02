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
    debugger
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <QueueItem 
            ref={setNodeRef} 
            {...props} 
            {...attributes} 
            style={style} 
            listeners={listeners} />
    )
}