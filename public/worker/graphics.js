var dynamicTexture = (properties) => {
    return properties
}

var dynamicShape = (properties) => {
    return properties
}

self.onmessage = function (message) {
    if (message.data.objectId == 0 || message.data.objectId == undefined) return
    message.data.objectList[message.data.objectId] = dynamicShape(message.data.objectList[message.data.objectId])
    message.data.objectList[message.data.objectId] = dynamicTexture(message.data.objectList[message.data.objectId])
    postMessage(message.data.objectList[message.data.objectId])
}