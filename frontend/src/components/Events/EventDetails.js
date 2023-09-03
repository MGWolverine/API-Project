import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { retrieveSingleEvent } from "../../store/events";
import { Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteEvent from "./DeleteEvent";
import "./EventsList.css";
import "../Groups/GroupsList.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const singleEvent = useSelector((state) => state.events.singleEvent);
  // const singleGroup = useSelector((state) => state.events.singleGroup);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user : 1
  );

  useEffect(() => {
    dispatch(retrieveSingleEvent(eventId));
  }, [dispatch, eventId]);

  if (singleEvent.description === undefined) {
    return null;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <>
      <Link className="groupsLink" to="/events">
        &lt; Events
      </Link>
      <h2>{singleEvent.name}</h2>
      <p>Hosted by Fulan Ibn Fulan</p>
      <div className="mainbody-div">
        <div className="group-details2">
          <div className="group-details-image-div">
            <img
              className="groupDetailsImage"
              src={singleEvent.EventImages[0].url}
            />
          </div>
          <div>
            <div>
              <img></img>
              <p>{singleEvent.Group.name}</p>
              <p>
                {singleEvent.Group.private === false ? "Public" : "Private"}
              </p>
            </div>
            <div className="group-details-information">
              <p>Start: {formatDate(singleEvent.startDate)} · 9AM</p>
              <p>End: {formatDate(singleEvent.endDate)} · 10AM</p>
              <p>Price: ${singleEvent.price}</p>
              <p>Type: {singleEvent.type}</p>
              {singleEvent.Group.organizerId != sessionUser.id && (
                <button onClick={() => alert("Feature coming soon...")}>
                  Join this Event
                </button>
              )}
              {singleEvent.Group.organizerId === sessionUser.id && (
                <Link to={`/${singleEvent.id}/edit`}>Manage Event</Link>
              )}
              {singleEvent.Group.organizerId === sessionUser.id && (
                <button>
                  <OpenModalMenuItem
                    buttonText="Delete"
                    modalComponent={<DeleteEvent eventId={singleEvent.id} />}
                  />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          <div>
            <h2>Details</h2>
            <p>{singleEvent.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
