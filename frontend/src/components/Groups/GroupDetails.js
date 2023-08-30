import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { retrieveSingleGroup } from "../../store/groups";

const GroupDetails = () => {
  const { groupId } = useParams();
  const singleGroup = useSelector((state) => state.groups.singleGroup);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(retrieveSingleGroup(groupId));
  }, [dispatch, groupId]);

  if (!singleGroup) {
    return null;
  }
  return (
    <>
      <Link className="groupsLink" to="/groups">
        &lt; Groups
      </Link>
      <div className="group-details">
        <img className="groupDetailsImage" src={singleGroup.GroupImages[0].url}/>
        <h2>{singleGroup.name}</h2>
        <p>{singleGroup.city}</p>
        <p>{singleGroup.state}</p>
        <p>
          Organized by {singleGroup.Organizer.firstName}{" "}
          {singleGroup.Organizer.lastName}
        </p>
        <button>Join this group</button>
      </div>
      <div>
        <div>
          <h2>Organizer</h2>
          <p>
            {singleGroup.Organizer.firstName} {singleGroup.Organizer.lastName}
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
