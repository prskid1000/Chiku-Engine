self.onmessage = function (objectId) {
    setInterval(() => {
        console.log(objectId.data)
    }, 1000)
}