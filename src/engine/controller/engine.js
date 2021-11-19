import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"

var controllerId = {}

export function startController() {
    Object.keys(store.getState().objectList).map((key) => {
        if (controllerId[key] == undefined) {
            controllerId[key] = new Worker("worker/controller.js")
            controllerId[key].postMessage(key)
        }
    })
    store.subscribe(() => {
        if (store.getState().config.controllerEngine.started == true)  {
            if (getLastAction() == "addObject") {
                if (controllerId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    controllerId[currentObjectId] = new Worker("worker/controller.js")
                    controllerId[currentObjectId].postMessage(currentObjectId)
                }
            }
        }
    })
}

export function stopController() {
    Object.keys(store.getState().objectList).map((key) => {
        if (controllerId[key] != undefined) {
            controllerId[key].terminate()
            delete controllerId[key]
        }
    })
    store.subscribe(() => {
        if (store.getState().config.controllerEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (controllerId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = store.getState().lastRemovedObjectId
                    controllerId[lastRemovedObjectId].terminate()
                    delete controllerId[lastRemovedObjectId]
                }
            }
        }
    })
}