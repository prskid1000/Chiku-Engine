import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var graphicsId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
    console.log(properties.objectId + "Graphics")
}

export function startGraphics() {
    Object.keys(getState().objectList).map((key) => {
        if (graphicsId[key] == undefined) {
            graphicsId[key] = new Worker("worker/graphics.js")
            setInterval(() => {
                graphicsId[key].postMessage({
                    "objectList": getState().objectList,
                    "objectId": key
                })
            }, 1000);
            graphicsId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (getState().config.graphicsEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (graphicsId[currentObjectId] == undefined) {
                    var currentObjectId = getState().currentObjectId
                    graphicsId[currentObjectId] = new Worker("worker/graphics.js")
                    setInterval(() => {
                        graphicsId[currentObjectId].postMessage({
                            "objectList": getState().objectList,
                            "objectId": currentObjectId
                        })
                    }, 1000);
                    graphicsId[currentObjectId].onmessage = (e) => { saveState(e.data) }
                }
            }
        }
    })
}

export function stopGraphics() {
    Object.keys(getState().objectList).map((key) => {
        if (graphicsId[key] != undefined) {
            graphicsId[key].terminate()
            delete graphicsId[key]
        }
    })
    store.subscribe(() => {
        if (getState().config.graphicsEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (graphicsId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = getState().lastRemovedObjectId
                    graphicsId[lastRemovedObjectId].terminate()
                    delete graphicsId[lastRemovedObjectId]
                }
            }
        }
    })
}