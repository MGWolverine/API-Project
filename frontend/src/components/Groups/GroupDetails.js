import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {retrieveSingleGroup} from "../../store/groups";

const GroupDetails = (groupId) => {
    const singleGroup = useSelector((state) => state.groups.singleGroup);
    const dispatch = useDispatch();

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