import React from "react";
import { Route } from "react-router-dom";
import Environment from '../../app/layouts/Environment/environment'

var routes = [
    '/',
]

var layouts = [
    <Environment></Environment>,
]

var routeMap = []

for(var i in routes)
{
    routeMap.push(<Route key={i} exact path={routes[i]}> {layouts[i]} </Route>)
}

export default routeMap;
