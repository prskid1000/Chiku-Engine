var action = (properties) => {
    return properties
}

var reaction = (properties) => {
    return properties
}

self.onmessage = function (message) {
    if (message.data.objectId == 0 || message.data.objectId == undefined) return
    message.data.objectList[message.data.objectId] = action(message.data.objectList[message.data.objectId])
    message.data.objectList[message.data.objectId] = reaction(message.data.objectList[message.data.objectId])
    postMessage(message.data.objectList[message.data.objectId])
}