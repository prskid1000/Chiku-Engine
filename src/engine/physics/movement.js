/*
  - ID of event loop for each body
  - Each event ID is unique
*/
var loopID = 0;

export function addForce(properties, setProperties, magnitude, direction){

    var yComponent = properties.force.magnitude * Math.sin(properties.force.direction) + 
        magnitude * Math.sin(direction);

    var xComponent = properties.force.magnitude * Math.cos(properties.force.direction) +
        magnitude * Math.cos(direction);

    properties.force.magnitude = Math.sqrt(xComponent * xComponent + yComponent * yComponent);
    properties.force.direction = Math.atan(yComponent / xComponent);
    setProperties(properties);
}

export function removeForce(properties, setProperties, magnitude, direction) {
    var yComponent = properties.force.magnitude * Math.sin(properties.force.direction) -
        magnitude * Math.sin(direction);

    var xComponent = properties.force.magnitude * Math.cos(properties.force.direction) -
        magnitude * Math.cos(direction);

    properties.force.magnitude = Math.sqrt(xComponent * xComponent + yComponent * yComponent);
    properties.force.direction = Math.atan(yComponent / xComponent);
    setProperties(properties);
}

var  setVelocity = (properties, setProperties) => {
    var yComponent = properties.force.magnitude * Math.sin(properties.force.direction) / 
        (properties.mass == 0 ? 1 : properties.mass);

    var xComponent = properties.force.magnitude * Math.cos(properties.force.direction) /
        (properties.mass == 0 ? 1 : properties.mass);

    var yVelocity = properties.velocity.magnitude * Math.sin(properties.velocity.direction) + yComponent;
    var xVelocity = properties.velocity.magnitude * Math.cos(properties.velocity.direction) + xComponent;

    properties.velocity.magnitude = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);
    properties.velocity.direction = Math.atan(yVelocity / xVelocity);
    setProperties(properties);
}

var setPosition = (properties, setProperties) => {

    var yVelocity = properties.velocity.magnitude * Math.sin(properties.velocity.direction);
    var xVelocity = properties.velocity.magnitude * Math.cos(properties.velocity.direction);

    properties.yCoordinate = properties.yCoordinate + yVelocity;
    properties.xCoordinate = properties.xCoordinate + xVelocity;
    setProperties(properties);
}

export function startMovement(properties, setProperties) {
    loopID = setInterval(() => {
        setVelocity(properties, setProperties);
        setPosition(properties, setProperties);
    }, 1000);
}

export function stopMovement() {
    clearInterval(loopID);
}
