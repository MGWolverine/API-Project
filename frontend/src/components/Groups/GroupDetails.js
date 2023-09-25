import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { retrieveSingleGroup } from "../../store/groups";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteGroup from "./DeleteGroup";

const GroupDetails = () => {
  const { groupId } = useParams();
  const singleGroup = useSelector((state) => state.groups.singleGroup);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) =>
    state.session.user ? state.session.user : 1
  );

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
              ## events ·{" "}
              {singleGroup?.private === false ? "Public" : "Private"}
            </p>
            <p>
              Organized by Fulan Ibn Fulan
              {/* Organized by {singleGroup.Organizer.firstName}{" "}
          {singleGroup.Organizer.lastName} */}
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
              <button className="details-button">
                <OpenModalMenuItem
                  className="links-details"
                  buttonText="Delete"
                  modalComponent={<DeleteGroup groupId={singleGroup.id} />}
                />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="details-bottom-half">
        <div>
          <h2>Organizer</h2>
          <p>
            {" "}
            Fulan Ibn Fulan
            {/* {singleGroup.Organizer.firstName} {singleGroup.Organizer.lastName} */}
          </p>
          <h2>What we're about</h2>
          <p>{singleGroup.about}</p>
        </div>
        <div>
          <h2>Upcoming Events (#)</h2>
        </div>
        <div className="event-bottom-div">
          <p>Event card</p>
        </div>
      </div>
    </>
  );
};

export default GroupDetails;
