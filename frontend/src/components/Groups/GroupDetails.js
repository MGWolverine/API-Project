import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {retrieveSingleGroup} from "../../store/groups";

const GroupDetails = () => {
    const { groupId } = useParams();
    const singleGroup = useSelector((state) => state.groups.singleGroup);
    const dispatch = useDispatch();
    console.log(groupId);
    console.log("singleGroup:", singleGroup);

    useEffect(() => {
        console.log('Component mounted');
        dispatch(retrieveSingleGroup(groupId));
    }, [dispatch])
    return (
        <>
            <div className="group-details">
                <h1>{singleGroup.name}</h1>
                <p>{singleGroup.description}</p>
            </div>
        </>
    )
}

export default GroupDetails