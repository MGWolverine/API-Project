import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { retrieveSingleEvent } from "../../store/events";
import { Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteEvent from "./DeleteEvent";

const EventDetails = () => {
  const { eventId } = useParams();
  const singleEvent = useSelector((state) => state.events.singleEvent);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user : 1
  );

  console.log("SINGLE EVENT ----->", singleEvent);

  useEffect(() => {
    dispatch(retrieveSingleEvent(eventId));
  }, [dispatch, eventId]);

  if (singleEvent.description === undefined) {
    return null;
  }

  return (
    <>
      <Link className="groupsLink" to="/events">
        &lt; Events
      </Link>
      <h2>{singleEvent.name}</h2>
      <div className="group-details">
        <img
          className="groupDetailsImage"
          src={singleEvent.EventImages[0].url}
        />
        {/* <p>{singleEvent.city}</p> */}
        <p>{singleEvent.description}</p>
        <p>
          {/* Organized by {singleEvent.Organizer.firstName}{" "}
          {singleEvent.Organizer.lastName} */}
        </p>
        <button onClick={() => alert("Feature coming soon...")}>
          Join this Event
        </button>
        {singleEvent.organizerId === sessionUser.id && (
          <Link to={`/${singleEvent.id}/edit`}>Manage Event</Link>
        )}
        {singleEvent.organizerId === sessionUser.id && (
          <OpenModalMenuItem
            buttonText="Delete"
            modalComponent={<DeleteEvent eventId={singleEvent.id} />}
          />
        )}
      </div>
      <div>
        <div>
          <h2>Organizer</h2>
          <p>
            {/* {singleEvent.Organizer.firstName} {singleEvent.Organizer.lastName} */}
          </p>
          <h2>What we're about</h2>
          <p>{singleEvent.about}</p>
        </div>
        <div>
          <h2>Upcoming Events (#)</h2>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
