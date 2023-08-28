import { csrfFetch } from "./csrf";


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
  const response = await csrfFetch('/api/events', {
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

//* Get details of an Event from an id

export const retrieveSingleEvent = (eventId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/events/${eventId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error response from server:", response);
      return;
    }

    const data = await response.json();
    dispatch(receiveEvent(data));
  } catch (error) {
    console.error("Network error:", error);
  }
};

//! Reducer
const initialState = {allEvents: {}, singleEvent: {}};
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const loadedEvents = {};
      action.events.allEvents.forEach(event => {
        loadedEvents[event.id] = event;
      });
      return {...state, allEvents: loadedEvents};
    case RECEIVE_EVENT:
      return {...state, singleEvent: {[action.event.id]: action.event}};
    case UPDATE_EVENT:
      return [];
    case REMOVE_EVENT:
      return [];
    default:
      return state;
  }
};

export default eventsReducer