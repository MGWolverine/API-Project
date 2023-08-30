import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { retrieveAllGroups } from "../../store/groups";
import "./GroupsList.css";
import { useHistory } from "react-router-dom";

const GroupsList = () => {
  const history = useHistory();
  const groups = Object.values(
    useSelector((state) =>
      state.groups.allGroups ? state.groups.allGroups : []
    )
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveAllGroups());
  }, [dispatch]);
  return (
    <div className="container">
      <div className="title">
        <h1>Groups</h1>
        <Link className="eventslink" to="/events">
          Events
        </Link>
      </div>
      <div>
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-item"
            onClick={() => {
              history.push(`/groups/${group.id}`);
            }}
          >
            <div className="groupContainer">
              <div className="groupImageDiv">
                <img
                  className="groupImage"
                  src={group.previewImage}
                  alt={group.name}
                />
              </div>
              <div className="groupInfo">
                <h2>{group.name}</h2>
                <p className="groupsListp">{group.city}, {group.state}</p>
                <p className="groupsListp">{group.about}</p>
              </div>
            </div>
            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
