import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {retrieveSingleGroup} from "../../store/groups";

const GroupDetails = () => {
    const { groupId } = useParams();
    const singleGroup = Object.values(
        useSelector((state) => (state.group.singleGroup ? state.group.singleGroup : []))
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(retrieveSingleGroup(groupId));
    }, [dispatch])
    return (
        <>
            <h1>HELLO</h1>
            <div className="group-details">
                <h1></h1>
                <p></p>
            </div>
        </>
    )
}

export default GroupDetails