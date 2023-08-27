import { csrfFetch } from "./csrf";

//! Types
const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const RECEIVE_GROUP = 'groups/RECEIVE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const REMOVE_GROUP = 'groups/REMOVE_GROUP';

//! Actions
export const loadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups,
  }
  };

  export const receiveGroup = (group) => ({
    type: RECEIVE_GROUP,
    group,
  });

  export const editGroup = (group) => ({
    type: UPDATE_GROUP,
    group,
  });

  export const removeGroup = (groupId) => ({
    type: REMOVE_GROUP,
    groupId,
  });

//! --------- Thunks -----------

//* Get All Groups

export const retrieveAllGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups', {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  })
  if (response.ok) {
    const data = await response.json()
    const action = loadGroups(data)
    await dispatch(action)
    return data
  } else {
    const data = response.json()
    return data
  }
}

//* Get details of a Group from an id

export const retrieveSingleGroup = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error response from server:", response);
      return;
    }

    const data = await response.json();
    dispatch(receiveGroup(data));
  } catch (error) {
    console.error("Network error:", error);
  }
};

//! Reducer
const initialState = {allGroups: {}, singleGroup: {}};
const groupsReducer = (state = initialState, action) => {
  console.log('Reducer is executing:', action.type);
  switch (action.type) {
    case LOAD_GROUPS:
      const loadedGroups = {};
      action.groups.allGroups.forEach(group => {
        loadedGroups[group.id] = group;
      });
      return {...state, allGroups: loadedGroups};
    case RECEIVE_GROUP:
      console.log('RECEIVE_GROUP action data:', action.group);
      return {...state, singleGroup: {[action.group.id]: action.group}};
    case UPDATE_GROUP:
      return [];
    case REMOVE_GROUP:
      return [];
    default:
      return state;
  }
};

export default groupsReducer