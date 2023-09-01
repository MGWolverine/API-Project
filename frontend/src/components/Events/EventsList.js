import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { retrieveAllEvents } from "../../store/events";
import "./EventsList.css";
import { useHistory } from "react-router-dom";

const EventsList = () => {
  const history = useHistory();
  const events = Object.values(
    useSelector((state) =>
      state.events.allEvents ? state.events.allEvents : []
    )
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveAllEvents());
  }, [dispatch]);
  return (
    <div className="container">
      <div className="titleGroupsList">
        <div className="titleLink">
          <Link className="link" to="/groups">
            Groups
          </Link>
        </div>
        <div className="titleLink">
          <Link to="/events">Events</Link>
        </div>
      </div>
      <p className="groupsListMiniTitle">Events in Not-Meetup</p>
      <div>
        {events.map((event) => (
          <div
            key={event.id}
            className="event-item"
            onClick={() => {
              history.push(`/events/${event.id}`);
            }}
          >
            <img src={event.previewImage} alt={event.name} />
            <h2>{event.name}</h2>
            <p>{event.startDate}</p>
            <p>{event.Group.city}</p>
            <p>{event.Group.state}</p>
            <p>{event.description}</p>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;
