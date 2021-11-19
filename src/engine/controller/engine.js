import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { applyKeyEffect } from "./keyboard"
import { applyMouseEffect } from "./mouse"

var FeatureMap = {
    "0": applyKeyEffect,
    "1": applyMouseEffect
}

var controllerId = {}
var contollerLoop = (objectId) => {
    Object.keys(FeatureMap).map((key) => {
        FeatureMap[key](objectId)
    })
}

export function startController() {
    Object.keys(store.getState().objectList).map((key) => {
        controllerId[key] = setInterval(() => {
            contollerLoop(key)
        }, 1000)
    })
    store.subscribe(() => {
        if(getLastAction() == "addObject") {
            var currentObjectId = store.getState().currentObjectId
            controllerId[currentObjectId] = setInterval(() => {
                contollerLoop(currentObjectId)
            }, 1000)
        }
    })
}

export function stopController() {
    Object.keys(store.getState().objectList).map((key) => {
        clearInterval(controllerId[key])
    })
    store.subscribe(() => {
        if (getLastAction() == "removeObject") {
            var lastRemovedObjectId = store.getState().lastRemovedObjectId
            clearInterval(controllerId[lastRemovedObjectId])
        }
    })
}