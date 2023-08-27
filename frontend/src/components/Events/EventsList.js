import {Link} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { retrieveAllEvents } from "../../store/events";

const EventsList = () => {
    const events = Object.values(
        useSelector((state) => (state.events.allEvents ? state.events.allEvents : []))
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(retrieveAllEvents());
    }, [dispatch])
    return (
        <>
            <ul>
                <h1>
                    <Link to="/groups">Groups</Link>
                    <p>Events</p>
                </h1>
            </ul>
            <div>
                {events.map((event) => (
                    <div key={event.id}>{console.log("EVENT", event)}
                        <img src={event.previewImage}></img>
                        <h2>{event.name}</h2>
                        <p>{event.startDate}</p>
                        <p>{event.description}</p>
                        <p>{event.state}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default EventsList;