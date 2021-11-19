import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { applyBGSound } from "./background"
import { applyObjectSound } from "./object"

var FeatureMap = {
    "0": applyBGSound,
    "1": applyObjectSound
}

var soundId = {}
var soundLoop = (objectId) => {
    Object.keys(FeatureMap).map((key) => {
        FeatureMap[key](objectId)
    })
}

export function startSound() {
    Object.keys(store.getState().objectList).map((key) => {
        soundId[key] = setInterval(() => {
            soundLoop(key)
        }, 1000)
    })
    store.subscribe(() => {
        if (getLastAction() == "addObject") {
            var currentObjectId = store.getState().currentObjectId
            soundId[currentObjectId] = setInterval(() => {
                soundLoop(currentObjectId)
            }, 1000)
        }
    })
}

export function stopSound() {
    Object.keys(store.getState().objectList).map((key) => {
        clearInterval(soundId[key])
    })
    store.subscribe(() => {
        if (getLastAction() == "removeObject") {
            var lastRemovedObjectId = store.getState().lastRemovedObjectId
            clearInterval(soundId[lastRemovedObjectId])
        }
    })
}