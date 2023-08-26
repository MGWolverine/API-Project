import {Link} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { retrieveAllGroups } from "../../store/groups";

const GroupsList = () => {
    const groups = Object.values(
        useSelector((state) => (state.groups.allGroups ? state.groups.allGroups : []))
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(retrieveAllGroups());
    }, [dispatch])
    return (
        <>
            <ul>
                <h1>
                    <p>Groups</p>
                    <Link to="/events">Events</Link>
                </h1>
            </ul>
            <div>
                {groups.map((group) => (
                    <div key={group.id}>{console.log("GROUP", group)}
                        <img src={group.previewImage}></img>
                        <h2>{group.name}</h2>
                        <p>{group.city}</p>
                        <p>{group.state}</p>
                        <p>{group.about}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default GroupsList;