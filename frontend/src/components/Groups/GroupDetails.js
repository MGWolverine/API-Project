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
      <div className="group-details">
        <img
          className="groupDetailsImage"
          src={singleGroup.GroupImages[0].url}
        />
        <h2>{singleGroup.name}</h2>
        <p>{singleGroup.city}</p>
        <p>{singleGroup.state}</p>
        <p>{singleGroup?.private === false ? "Public" : "Private"}</p>
        <p>
          {/* Organized by {singleGroup.Organizer.firstName}{" "}
          {singleGroup.Organizer.lastName} */}
        </p>
        <button onClick={() => alert("Feature coming soon...")}>
          Join this group
        </button>
        {singleGroup.organizerId === sessionUser.id && (
          <Link to={`/${singleGroup.id}/edit`}>Manage Group</Link>
        )}
        {singleGroup.organizerId === sessionUser.id && (
          <button>
            <OpenModalMenuItem
              buttonText="Delete"
              modalComponent={<DeleteGroup groupId={singleGroup.id} />}
            />
            Delete
          </button>
        )}
      </div>
      <div>
        <div>
          <h2>Organizer</h2>
          <p>
            {/* {singleGroup.Organizer.firstName} {singleGroup.Organizer.lastName} */}
          </p>
          <h2>What we're about</h2>
          <p>{singleGroup.about}</p>
        </div>
        <div>
          <h2>Upcoming Events (#)</h2>
        </div>
      </div>
    </>
  );
};

export default GroupDetails;
