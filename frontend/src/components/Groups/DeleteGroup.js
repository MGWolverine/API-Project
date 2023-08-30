import { deleteGroup } from "../../store/groups";
import { useState } from "react";
import { useDispatch } from "react-redux";

const DeleteGroup = ({ groupId }) => {
  const dispatch = useDispatch();

  const remove = () => {
    dispatch(deleteGroup(groupId));
  };

  return (
    <>
      <button onClick={remove}>Delete Group</button>
    </>
  );
};
