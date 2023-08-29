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
      <h1 className="title">
        <p>Groups</p>
        <Link className="eventslink" to="/events">
          Events
        </Link>
      </h1>
      <div>
        {groups.map((group) => (
          <div key={group.id} className="group-item" onClick={() => {history.push(`/groups/${group.id}`)}}>
            <img src={group.previewImage} alt={group.name} />
            <h2>{group.name}</h2>
            <p>{group.city}</p>
            <p>{group.state}</p>
            <p>{group.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
