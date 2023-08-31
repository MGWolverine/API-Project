import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import GroupsList from "./components/Groups/GroupsList";
import EventsList from "./components/Events/EventsList";
import GroupDetails from "./components/Groups/GroupDetails";
import EventDetails from "./components/Events/EventDetails";
import CreateGroup from "./components/Groups/CreateGroup";
import UpdateGroup from "./components/Groups/UpdateGroup";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/groups/new' component={CreateGroup} />
        <Route exact path='/groups' component={GroupsList} />
        <Route exact path='/events' component={EventsList} />
        <Route path='/:groupId/edit' component={UpdateGroup} />
        <Route path='/groups/:groupId' component={GroupDetails} />
        <Route path='/events/:eventId' component={EventDetails} />
      </Switch>)}
    </>
  );
}

export default App;