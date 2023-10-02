import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { retrieveSingleGroup } from "../../store/groups";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteGroup from "./DeleteGroup";

const GroupDetails = () => {
  const history = useHistory();
  const { groupId } = useParams();
  const singleGroup = useSelector((state) => state.groups.singleGroup);
  const events = useSelector((state) => state.groups.singleGroup.Events);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user : 1
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const sortedEvents = events?.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });

  useEffect(() => {
    dispatch(retrieveSingleGroup(groupId));
  }, [dispatch, groupId]);

  //TODO refactor store reducer for groups and short circuit
  if (!singleGroup) {
    return null;
  }

  return (
    <>
      <Link className="groupsLink" to="/groups">
        &lt; Groups
      </Link>
      <div className="detail-div">
        <div className="group-details">
          <div className="group-details-image-div">
            <img
              className="groupDetailsImage"
              src={singleGroup.GroupImages[0].url}
            />
          </div>
          <div className="group-details-information">
            <h2>{singleGroup.name}</h2>
            <p>
              Location: {singleGroup.city}, {singleGroup.state}
            </p>
            <p>
              {" "}
              {singleGroup?.Events?.length} events ·{" "}
              {singleGroup?.private === false ? "Public" : "Private"}
            </p>
            <p>
              Organized by {singleGroup?.Organizer?.firstName}{" "}
              {singleGroup?.Organizer?.lastName}
            </p>
          </div>
          <div className="details-buttons">
            {singleGroup.organizerId === sessionUser.id && (
              <button className="details-button">
                <Link
                  className="links-details"
                  to={`/groups/${singleGroup.id}/events/new`}
                >
                  Create Event
                </Link>
              </button>
            )}
            {sessionUser.id && singleGroup.organizerId != sessionUser.id && (
              <button
                className="details-button"
                onClick={() => alert("Feature coming soon...")}
              >
                Join this group
              </button>
            )}
            {singleGroup.organizerId === sessionUser.id && (
              <button className="details-button">
                <Link className="links-details" to={`/${singleGroup.id}/edit`}>
                  Update
                </Link>
              </button>
            )}

            {singleGroup.organizerId === sessionUser.id && (
              <div className="delete-button-groups">
                <OpenModalMenuItem
                  className="links-details"
                  itemText="Delete"
                  modalComponent={<DeleteGroup groupId={singleGroup.id} />}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="details-bottom-half">
        <div>
          <h2>Organizer</h2>
          <p>
            {" "}
            {singleGroup?.Organizer?.firstName}{" "}
            {singleGroup?.Organizer?.lastName}
          </p>
          <h2>What we're about</h2>
          <p>{singleGroup.about}</p>
        </div>
        <div>
          <h2>Events ({singleGroup?.Events?.length})</h2>
        </div>
        {sortedEvents?.map((event) => (
          <div className="event-bottom-div">
            <div
              key={event.id}
              className="event-item group"
              onClick={() => {
                history.push(`/events/${event.id}`);
              }}
            >
              <div className="groupContainer group">
                <div className="groupImageDiv group">
                  <img
                    className="groupImage group"
                    src={event?.EventImages[0]?.url}
                    alt={event.name}
                  />
                </div>
                <div className="groupInfo group">
                  <p>{formatDate(event.startDate)} · 9:30 AM</p>
                  <h2>{event.name}</h2>
                  <p className="groupsListp group">
                    {singleGroup.city}, {singleGroup.state}
                  </p>
                </div>
              </div>
              <p className="groupsListp group">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GroupDetails;
