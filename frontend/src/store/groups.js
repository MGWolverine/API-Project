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

//todo Get All Groups

export const retrieveAllGroups = () => async (dispatch) => {
  const response = await fetch('/api/groups', {
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

//! Reducer
const initialState = {allGroups: {}}
const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const loadedGroups = {};
      action.groups.allGroups.forEach(group => {
        loadedGroups[group.id] = group;
      });
      return {...state, allGroups: loadedGroups};
    case RECEIVE_GROUP:
      return [];
    case UPDATE_GROUP:
      return [];
    case REMOVE_GROUP:
      return [];
    default:
      return state;
  }
};

export default groupsReducer