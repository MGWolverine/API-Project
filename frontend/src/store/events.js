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

//* Get All Events

export const retrieveAllEvents = () => async (dispatch) => {
  const response = await fetch('/api/events', {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  })
  if (response.ok) {
    const data = await response.json()
    const action = loadEvents(data)
    await dispatch(action)
    return data
  } else {
    const data = response.json()
    return data
  }
}

//! Reducer
const initialState = {allEvents: {}}
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const loadedEvents = {};
      action.events.allEvents.forEach(event => {
        loadEvents[event.id] = event;
      });
      return {...state, allEvents: loadEvents};
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