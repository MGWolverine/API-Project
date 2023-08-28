import {Link} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { retrieveAllEvents } from "../../store/events";
import './EventsList.css';

const EventsList = () => {
    const events = Object.values(
        useSelector((state) => (state.events.allEvents))
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(retrieveAllEvents());
    }, [dispatch])
    return (
        <div className="container">
      <ul>
        <h1 className="title">
          <Link className="link" to="/groups">Groups</Link>
          <p>Events</p>
        </h1>
      </ul>

      <div>
        {events.map((event) => (
          <div key={event.id} className="event-item">
            <img src={event.previewImage} alt={event.name} />
            <h2>{event.name}</h2>
            <p>{event.startDate}</p>
            <p>{event.Group.city}</p>
            <p>{event.Group.state}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsList;