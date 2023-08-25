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

//! Thunks

//! Reducer