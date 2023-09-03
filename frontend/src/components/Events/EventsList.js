import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { retrieveAllEvents } from "../../store/events";
import "./EventsList.css";
import "../Groups/GroupsList.css";
import { useHistory } from "react-router-dom";

const EventsList = () => {
  const history = useHistory();
  const events = Object.values(
    useSelector((state) =>
      state.events.allEvents ? state.events.allEvents : []
    )
  );
  const dispatch = useDispatch();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

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
            <div className="groupContainer">
              <div className="groupImageDiv">
                <img
                  className="groupImage"
                  src={event.previewImage}
                  alt={event.name}
                />
              </div>
              <div className="groupInfo">
                <p>{formatDate(event.startDate)} · 9:30 AM</p>
                <h2>{event.name}</h2>
                <p className="groupsListp">
                  {event.Group.city}, {event.Group.state}
                </p>
              </div>
            </div>
            <p className="groupsListp">{event.description}</p>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;
