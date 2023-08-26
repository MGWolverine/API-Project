//! Types
const LOAD_EVENTS = 'events/LOAD_EVENTS';
const RECEIVE_EVENT = 'events/RECEIVE_EVENT';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const REMOVE_EVENT = 'events/REMOVE_EVENT';

//! Actions
export const loadEvents = (events) => ({
    type: LOAD_EVENTS,
    events,
  });

  export const receiveEvent = (event) => ({
    type: RECEIVE_EVENT,
    event,
  });

  export const editEvent = (event) => ({
    type: UPDATE_EVENT,
    event,
  });

  export const removeEvent = (eventId) => ({
    type: REMOVE_EVENT,
    eventId,
  });

//! --------- Thunks -----------

//! Reducer
const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      return [];
    case RECEIVE_EVENT:
      return [];
    case UPDATE_EVENT:
      return [];
    case REMOVE_EVENT:
      return [];
    default:
      return state;
  }
};

export default eventsReducer