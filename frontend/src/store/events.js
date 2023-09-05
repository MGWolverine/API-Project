import { csrfFetch } from "./csrf";

//! Types
const LOAD_EVENTS = "events/LOAD_EVENTS";
const RECEIVE_EVENT = "events/RECEIVE_EVENT";
const UPDATE_EVENT = "events/UPDATE_EVENT";
const REMOVE_EVENT = "events/REMOVE_EVENT";
const CREATE_EVENT = "events/CREATE_EVENT";
const LOAD_ORGANIZER = "events/CREATE_EVENT";

//! Actions
export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const loadOrganizer = (events) => {
  return {
    type: LOAD_ORGANIZER,
    events,
  };
};

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

export const createEvent = (newEvent, groupId) => ({
  type: CREATE_EVENT,
  newEvent,
  groupId,
});

//! --------- Thunks -----------

//* Get All Events

export const retrieveAllEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const data = await response.json();
    const action = loadEvents(data);
    await dispatch(action);
    return data;
  } else {
    const data = response.json();
    return data;
  }
};

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

//* Create new Event

export const createNewEvent = (newEvent, groupId, newImage) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    console.log("RESPONSE", response)
    if (!response.ok) {
      console.error("Error response from server:", response);
      return;
    }

    const latestEvent = await response.json();
    console.log("LATEST EVENT", latestEvent)

    const response2 = await csrfFetch(`/api/events/${latestEvent.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newImage),
    });

    if (!response2.ok) {
      console.error("Error response from server:", response);
      return;
    }

    return latestEvent;
  } catch (error) {
    console.error("Network error:", error);
  }
};

// //* Update a Event

// export const updateEvent = (event, eventId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/events/${eventId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(event),
//   });

//   if (!response.ok) {
//     console.error("Error response from server:", response);
//     return;
//   }

//   const editedEvent = await response.json();
//   await dispatch(editEvent(editedEvent));
//   return editedEvent;
// };

//* Delete Event

export const deleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.error("Error response from server:", response);
    return;
  }

  dispatch(removeEvent(eventId));
};

//! Reducer
const initialState = { allEvents: {}, singleEvent: {} };
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const loadedEvents = {};
      action.events.allEvents.forEach((event) => {
        loadedEvents[event.id] = event;
      });
      return { ...state, allEvents: loadedEvents };
    case RECEIVE_EVENT:
      return { ...state, singleEvent: {...action.event} };
      case CREATE_EVENT:
        return {
          ...state,
          allEvents: { ...state.allEvents, ...action.event },
        };
      case UPDATE_EVENT:
        return { ...state, singleEvent: { ...action.event } };
      case REMOVE_EVENT:
        const { [action.eventId]: removeEvent, ...updatedEvents } =
          state.allEvents;
        return { ...state, allEvents: updatedEvents, singleEvent: {} };
    default:
      return state;
  }
};

export default eventsReducer;
