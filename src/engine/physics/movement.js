import actions from "../../app/redux/actions";
import store from "../../app/redux/store";

/*
  - ID of event loop for each body
  - Each event ID is unique
*/
var loopID = 0;

var  setVelocity = (objectId) => {

    var objectList = store.getState().objectList;
    var properties = objectList[objectId]
    console.log(properties)

    var yComponent = properties.force.magnitude * Math.sin(properties.force.direction * Math.PI / 180) /
        (properties.mass == 0 ? 1 : properties.mass);

    var xComponent = properties.force.magnitude * Math.cos(properties.force.direction * Math.PI / 180) /
        (properties.mass == 0 ? 1 : properties.mass);

    var yVelocity = properties.velocity.magnitude * Math.sin(properties.velocity.direction * Math.PI / 180) + yComponent;
    var xVelocity = properties.velocity.magnitude * Math.cos(properties.velocity.direction * Math.PI / 180) + xComponent;

    properties.velocity.magnitude = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);
    properties.velocity.direction = Math.atan(yVelocity / xVelocity) * 180 / Math.PI;
    
    objectList[objectId] = properties
    actions.updateObject.payload = objectList
    store.dispatch(actions.updateObject)
}

var setPosition = (objectId) => {

    var objectList = store.getState().objectList;
    var properties = objectList[objectId]

    var yVelocity = properties.velocity.magnitude * Math.sin(properties.velocity.direction * Math.PI / 180);
    var xVelocity = properties.velocity.magnitude * Math.cos(properties.velocity.direction * Math.PI / 180);

    properties.yCoordinate = properties.yCoordinate + yVelocity;
    properties.xCoordinate = properties.xCoordinate + xVelocity;

    objectList[objectId] = properties
    actions.updateObject.payload = objectList
    store.dispatch(actions.updateObject)
}

export function applyMovement(objectId) {
    setVelocity(objectId);
    setPosition(objectId);
}
