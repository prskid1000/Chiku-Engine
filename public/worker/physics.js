var setVelocity = (properties) => {

    var yComponent = properties.force.magnitude * Math.sin(properties.force.direction * Math.PI / 180) /
        (properties.mass == 0 ? 1 : properties.mass);

    var xComponent = properties.force.magnitude * Math.cos(properties.force.direction * Math.PI / 180) /
        (properties.mass == 0 ? 1 : properties.mass);

    var yVelocity = properties.velocity.magnitude * Math.sin(properties.velocity.direction * Math.PI / 180) + yComponent;
    var xVelocity = properties.velocity.magnitude * Math.cos(properties.velocity.direction * Math.PI / 180) + xComponent;

    properties.velocity.magnitude = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);
    properties.velocity.direction = Math.atan(yVelocity / xVelocity) * 180 / Math.PI;

    return properties
}

var setPosition = (properties) => {

    var yVelocity = properties.velocity.magnitude * Math.sin(properties.velocity.direction * Math.PI / 180);
    var xVelocity = properties.velocity.magnitude * Math.cos(properties.velocity.direction * Math.PI / 180);

    properties.yCoordinate = properties.yCoordinate + yVelocity;
    properties.xCoordinate = properties.xCoordinate + xVelocity;

   return properties
}

var detectCollision = (properties) => {
    return properties
}

self.onmessage = function (message) {
    if (message.data.objectId == 0 || message.data.objectId == undefined) return
    setInterval(() => {
        message.data.objectList[message.data.objectId] = setVelocity(message.data.objectList[message.data.objectId])
        message.data.objectList[message.data.objectId] = setPosition(message.data.objectList[message.data.objectId])
        message.data.objectList[message.data.objectId] = detectCollision(message.data.objectList[message.data.objectId])
        postMessage(message.data.objectList[message.data.objectId])
    }, 1000)
}