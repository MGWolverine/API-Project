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

  useEffect(() => {
    dispatch(retrieveSingleEvent(eventId));
  }, [dispatch, eventId]);

  if (!singleEvent) {
    return null;
  }

  return (
    <>
      <Link className="groupsLink" to="/events">
        &lt; Events
      </Link>
      <h2>{singleEvent[1].name}</h2>
      <div className="group-details">
        <img
          className="groupDetailsImage"
          src={singleEvent[1].EventImages[0].url}
        />
        {/* <p>{singleEvent[1].city}</p> */}
        <p>{singleEvent[1].description}</p>
        <p>
          {/* Organized by {singleEvent.Organizer.firstName}{" "}
          {singleEvent.Organizer.lastName} */}
        </p>
        <button>Join this Event</button>
        {singleEvent[1].organizerId === sessionUser.id && (
          <Link to={`/${singleEvent[1].id}/edit`}>Manage Event</Link>
        )}
        {singleEvent[1].organizerId === sessionUser.id && (
          <OpenModalMenuItem
            buttonText="Delete"
            modalComponent={<DeleteEvent eventId={singleEvent[1].id} />}
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
