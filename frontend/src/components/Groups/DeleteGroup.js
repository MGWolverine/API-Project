import { deleteGroup } from "../../store/groups";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

const DeleteGroup = ({ groupId }) => {
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  const remove = () => {
    dispatch(deleteGroup(groupId));
    closeModal();
  };

  return (
    <>
      <button onClick={remove}>Delete Group</button>
    </>
  );
};

export default DeleteGroup;