import { deleteEvent } from "../../store/events";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const DeleteEvent = ({ eventId }) => {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const history = useHistory();

  const remove = () => {
    dispatch(deleteEvent(eventId));
    closeModal();
    history.replace('/events');
  };

  return (
    <>
      <div>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to remove this event?</h3>
        <div>
          <button onClick={remove}>Yes (Delete Event)</button>
          <button onClick={closeModal}>No (Keep Event)</button>
        </div>
      </div>
    </>
  );
};

export default DeleteEvent;