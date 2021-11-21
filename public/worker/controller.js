var keyController = (properties) => {
    return properties
}

var mouseController = (properties) => {
    return properties
}

self.onmessage = function (message) {
    if (message.data.objectId != message.data.currentObjectId || message.data.objectId == 0 || message.data.objectId == undefined) return
    message.data.objectList[message.data.objectId] = keyController(message.data.objectList[message.data.objectId])
    message.data.objectList[message.data.objectId] = mouseController(message.data.objectList[message.data.objectId])
    postMessage(message.data.objectList[message.data.objectId])
}