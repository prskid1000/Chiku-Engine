import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { workLoad } from "./workload"

var graphicsId = {}

export function startGraphics() {
    Object.keys(store.getState().objectList).map((key) => {
        if (graphicsId[key] == undefined) {
            graphicsId[key] = new Worker("worker/graphics.js")
            graphicsId[key].postMessage(key)
            graphicsId[key].onmessage = workLoad(key)
        }
    })
    store.subscribe(() => {
        if (store.getState().config.graphicsEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (graphicsId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    graphicsId[currentObjectId] = new Worker("worker/graphics.js")
                    graphicsId[currentObjectId].postMessage(currentObjectId)
                    graphicsId[currentObjectId].onmessage = workLoad(currentObjectId)
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