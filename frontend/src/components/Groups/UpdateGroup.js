import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const UpdateGroup = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const group = useSelector((state) => state.groups.singleGroup[groupId]);

  useEffect(() => {
    dispatch();
  }, [dispatch]);

  return <></>;
};

export default UpdateGroup;
