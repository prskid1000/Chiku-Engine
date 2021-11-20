self.onmessage = function (objectId) {
    setInterval(() => {
        console.log(objectId.data)
        postMessage({})
    }, 1000)
}