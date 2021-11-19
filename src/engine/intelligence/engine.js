import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { applyAction } from "./action"
import { applyReaction } from "./reaction"

var FeatureMap = {
    "0": applyAction,
    "1": applyReaction
}

var intelligenceId = {}
var intelligenceLoop = (objectId) => {
    Object.keys(FeatureMap).map((key) => {
        FeatureMap[key](objectId)
    })
}

export function startIntelligence() {
    Object.keys(store.getState().objectList).map((key) => {
        intelligenceId[key] = setInterval(() => {
            intelligenceLoop(key)
        }, 1000)
    })
    store.subscribe(() => {
        if (getLastAction() == "addObject") {
            var currentObjectId = store.getState().currentObjectId
            intelligenceId[currentObjectId] = setInterval(() => {
                intelligenceLoop(currentObjectId)
            }, 1000)
        }
    })
}

export function stopIntelligence() {
    Object.keys(store.getState().objectList).map((key) => {
        clearInterval(intelligenceId[key])
    })
    store.subscribe(() => {
        if (getLastAction() == "removeObject") {
            var lastRemovedObjectId = store.getState().lastRemovedObjectId
            clearInterval(intelligenceId[lastRemovedObjectId])
        }
    })
}