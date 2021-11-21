var objectSound = (properties) => {
    return properties
}

var collisionSound = (properties) => {
    return properties
}

var movementSound = (properties) => {
    return properties
}

self.onmessage = function (message) {
    if (message.data.objectId == 0 || message.data.objectId == undefined) return
    setInterval(() => {
        message.data.objectList[message.data.objectId] = objectSound(message.data.objectList[message.data.objectId])
        message.data.objectList[message.data.objectId] = movementSound(message.data.objectList[message.data.objectId])
        message.data.objectList[message.data.objectId] = collisionSound(message.data.objectList[message.data.objectId])
        postMessage(message.data.objectList[message.data.objectId])
    }, 1000)
}