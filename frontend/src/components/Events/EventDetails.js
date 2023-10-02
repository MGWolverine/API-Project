import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { retrieveSingleEvent } from "../../store/events";
import { Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteEvent from "./DeleteEvent";
import "./EventsList.css";
import "../Groups/GroupsList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMapPin,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

const EventDetails = () => {
  const { eventId } = useParams();
  const singleEvent = useSelector((state) => state.events.singleEvent);
  // const singleGroup = useSelector((state) => state.events.singleGroup);
  const dispatch = useDispatch();
  // const [eventPrice, setEventPrice] = useState("")
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user : 1
  );

  useEffect(() => {
    dispatch(retrieveSingleEvent(eventId));
  }, [dispatch, eventId]);

  if (singleEvent.description === undefined) {
    return null;
  }

  // if (singleEvent.price === 0) {
  //   setEventPrice("FREE");
  // } else {
  //   setEventPrice(singleEvent.price);
  // }

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
      <p>
        Hosted by {singleEvent?.Group?.Organizer?.firstName}{" "}
        {singleEvent?.Group?.Organizer?.lastName}
      </p>
      <div className="mainbody-div">
        <div className="group-details2">
          <div className="group-details-image-div">
            <img
              className="groupDetailsImage"
              src={singleEvent.EventImages[0].url}
            />
          </div>
          <div className="eventDetailsCard">
            <div className="eventImageAndLocation">
              <img
                className="groupImageEvent"
                src={singleEvent.Group.GroupImages[0].url}
              ></img>
              <div className="groupInformationEvent">
                <p>{singleEvent.Group.name}</p>
                <p>
                  {singleEvent.Group.private === false ? "Public" : "Private"}
                </p>
              </div>
            </div>
            <div className="group-details-information">
              <div className="time">
                <div className="clock">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <p>START: {formatDate(singleEvent.startDate)} · 9AM</p>
                  <p>END: {formatDate(singleEvent.endDate)} · 10AM</p>
                </div>
              </div>
              <p>
                <FontAwesomeIcon icon={faDollarSign} />{" "}
                {singleEvent.price === 0 ? "FREE" : singleEvent.price}
              </p>
              <p>
                <FontAwesomeIcon icon={faMapPin} /> {singleEvent.type}
              </p>
              <div className="eventDetailsButtons">
                {singleEvent.Group.organizerId != sessionUser.id && (
                  <button onClick={() => alert("Feature coming soon...")}>
                    Join this Event
                  </button>
                )}
                {singleEvent.Group.organizerId === sessionUser.id && (
                  <button className="manage-event-button" onClick={() => alert("Feature coming soon...")}>
                    Manage Event
                  </button>
                )}
                <div className="delete-button-events">
                  {singleEvent.Group.organizerId === sessionUser.id && (
                    <OpenModalMenuItem
                      className="modal-details"
                      itemText="Delete"
                      modalComponent={<DeleteEvent eventId={singleEvent.id} />}
                    />
                  )}
                </div>
              </div>
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
