import { deleteGroup } from "../../store/groups";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

const DeleteGroup = ({ groupId }) => {
  const dispatch = useDispatch();
  const {closeModal} = useModal();
  const history = useHistory();

  const remove = () => {
    dispatch(deleteGroup(groupId));
    closeModal();
    history.replace('/groups');
  };

  return (
    <>
      <button onClick={remove}>Delete Group</button>
    </>
  );
};

export default DeleteGroup;