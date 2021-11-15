import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import routeMap from "./configs/routeMap";

function App() {
  return (
    <>
      <Router>
        <Switch>{routeMap}</Switch>
      </Router>
    </>
  );
}
export default App;
