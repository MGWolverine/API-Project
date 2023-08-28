import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {retrieveSingleEvent} from "../../store/events";

const EventDetails = () => {
    const { eventId } = useParams();
    const singleEvent = useSelector((state) => state.events.singleEvent);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(retrieveSingleEvent(eventId));
    }, [dispatch])
    return (
        <>
            <div className="event-details">
                <h1>{singleEvent.name}</h1>
                <p>{singleEvent.description}</p>
            </div>
        </>
    )
}

export default EventDetails