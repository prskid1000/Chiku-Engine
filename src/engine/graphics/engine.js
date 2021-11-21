import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var graphicsId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
}

export function startGraphics() {
    Object.keys(store.getState().objectList).map((key) => {
        if (graphicsId[key] == undefined) {
            graphicsId[key] = new Worker("worker/graphics.js")
            graphicsId[key].postMessage({
                "objectList": store.getState().objectList,
                "objectId": key
            })
            graphicsId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (store.getState().config.graphicsEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (graphicsId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    graphicsId[currentObjectId] = new Worker("worker/graphics.js")
                    graphicsId[currentObjectId].postMessage({
                        "objectList": store.getState().objectList,
                        "objectId": currentObjectId
                    })
                    graphicsId[currentObjectId].onmessage = (e) => { saveState(e.data) }
                }
            }
        }
    })
}

export function stopGraphics() {
    Object.keys(store.getState().objectList).map((key) => {
        if (graphicsId[key] != undefined) {
            graphicsId[key].terminate()
            delete graphicsId[key]
        }
    })
    store.subscribe(() => {
        if (store.getState().config.graphicsEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (graphicsId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = store.getState().lastRemovedObjectId
                    graphicsId[lastRemovedObjectId].terminate()
                    delete graphicsId[lastRemovedObjectId]
                }
            }
        }
    })
}