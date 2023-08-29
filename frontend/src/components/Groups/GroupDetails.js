import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {retrieveSingleGroup} from "../../store/groups";

const GroupDetails = () => {
    const { groupId } = useParams();
    const singleGroup = useSelector((state) => state.groups.singleGroup);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(retrieveSingleGroup(groupId));
    }, [dispatch, singleGroup])
    console.log("THIS IS THE SINGLE GROUP", singleGroup)
    return (
        <>
            <div className="group-details">
                <h1>{singleGroup.name}</h1>
                <p>{singleGroup.about}</p>
            </div>
        </>
    )
}

export default GroupDetails