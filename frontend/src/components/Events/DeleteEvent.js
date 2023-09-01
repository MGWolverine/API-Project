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
      <button onClick={remove}>Delete Event</button>
    </>
  );
};

export default DeleteEvent;