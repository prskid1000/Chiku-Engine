self.onmessage = (message) => {
    var simulate = new Function("message", message.data.statement.substring(11))
    postMessage(simulate(message.data.args))
    //postMessage(eval(message.data.statement)(message.data.args))
}