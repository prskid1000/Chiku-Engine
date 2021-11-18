import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"

var graphicsId = {}
var graphicsLoop = (objectId) => {
    console.log(objectId)
}

export function startGraphics() {
    Object.keys(store.getState().objectList).map((key) => {
        graphicsId[key] = setInterval(() => {
            graphicsLoop(key)
        }, 1000)
    })
    store.subscribe(() => {
        if (getLastAction() == "addObject") {
            var currentObjectId = store.getState().currentObjectId
            graphicsId[currentObjectId] = setInterval(() => {
                graphicsLoop(currentObjectId)
            }, 1000)
        }
    })
}

export function stopGraphics() {
    Object.keys(store.getState().objectList).map((key) => {
        clearInterval(graphicsId[key])
    })
    store.subscribe(() => {
        if (getLastAction() == "removeObject") {
            var lastRemovedObjectId = store.getState().lastRemovedObjectId
            clearInterval(graphicsId[lastRemovedObjectId])
        }
    })
}