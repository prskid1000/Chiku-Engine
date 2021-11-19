import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { applyCollisonDetection } from "./collison"
import { applyMovement } from "./movement"

var FeatureMap = {
    "0": applyCollisonDetection,
    "1": applyMovement
}

var physicsId = {}
var physicsLoop = (objectId) => {
    Object.keys(FeatureMap).map((key) => {
        FeatureMap[key](objectId)
    })
}

export function startPhysics() {
    Object.keys(store.getState().objectList).map((key) => {
        physicsId[key] = setInterval(() => {
            physicsLoop(key)
        }, 1000)
    })
    store.subscribe(() => {
        if (getLastAction() == "addObject") {
            var currentObjectId = store.getState().currentObjectId
            physicsId[currentObjectId] = setInterval(() => {
                physicsLoop(currentObjectId)
            }, 1000)
        }
    })
}

export function stopPhysics() {
    Object.keys(store.getState().objectList).map((key) => {
        clearInterval(physicsId[key])
    })
    store.subscribe(() => {
        if (getLastAction() == "removeObject") {
            var lastRemovedObjectId = store.getState().lastRemovedObjectId
            clearInterval(physicsId[lastRemovedObjectId])
        }
    })
}