import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"

var controllerId = {}
var contollerLoop = (objectId) => {
    console.log(objectId)
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