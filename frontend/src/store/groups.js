//! Types
const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const RECEIVE_GROUP = 'groups/RECEIVE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const REMOVE_GROUP = 'groups/REMOVE_GROUP';

//! Actions
export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups,
  });

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

export const retrieveAllGroups = () => async (dispatch, getState) => {
  const response = await fetch('path', {})
  const data = res.json()

  const action = loadGroups(data)
  dispatch(action)
}

//! Reducer
const groupsReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      return [];
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