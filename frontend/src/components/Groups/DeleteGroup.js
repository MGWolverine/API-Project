import { deleteGroup } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const DeleteGroup = ({ groupId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const remove = () => {
    dispatch(deleteGroup(groupId));
    closeModal();
    history.replace("/groups");
  };

  return (
    <>
      <div>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to remove this group?</h3>
        <div>
          <button onClick={remove}>Yes (Delete Group)</button>
          <button onClick={closeModal}>No (Keep Group)</button>
        </div>
      </div>
    </>
  );
};

export default DeleteGroup;
