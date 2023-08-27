import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import GroupsList from "./components/Groups/GroupsList";
import EventsList from "./components/Events/EventsList";
import GroupDetails from "./components/Groups/GroupDetails";

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
        <Route exact path='/groups' component={GroupsList} />
        <Route exact path='/events' component={EventsList} />
        <Route exact path='/groups/:groupId' component={GroupDetails} />
      </Switch>)}
    </>
  );
}

export default App;