import { getState, setState, getLastAction  } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var controllerId = {}
var controllerIntervalId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
    console.log(properties.objectId + "Controller")
}

export function startController() {
    Object.keys(getState().objectList).map((key) => {
        if (controllerId[key] == undefined) {
            controllerId[key] = new Worker("worker/controller.js")
            controllerIntervalId[key] = setInterval(() => {
                controllerId[key].postMessage({
                    "objectList": getState().objectList,
                    "objectId": key,
                    "currentObjectId": getState().currentObjectId
                })
            }, 1000);
            controllerId[key].onmessage = (e) => {saveState(e.data)}
        }
    })
    store.subscribe(() => {
        if (getState().config.controllerEngine.started == true)  {
            if (getLastAction() == "addObject") {
                if (controllerId[currentObjectId] == undefined) {
                    var currentObjectId = getState().currentObjectId
                    controllerId[currentObjectId] = new Worker("worker/controller.js")
                    controllerIntervalId[currentObjectId] = setInterval(() => {
                        controllerId[currentObjectId].postMessage({
                            "objectList": getState().objectList,
                            "objectId": currentObjectId,
                            "currentObjectId": getState().currentObjectId
                        })
                    }, 1000);
                    controllerId[currentObjectId].onmessage = (e) => { saveState(e.data) }
                }
            }
        }
    })
}

export function stopController() {
    Object.keys(getState().objectList).map((key) => {
        if (controllerId[key] != undefined) {
            controllerId[key].terminate()
            clearInterval(controllerIntervalId[key])
            delete controllerId[key]
            delete controllerIntervalId[key]
        }
    })
    store.subscribe(() => {
        if (getState().config.controllerEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (controllerId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = getState().lastRemovedObjectId
                    controllerId[lastRemovedObjectId].terminate()
                    clearInterval(controllerIntervalId[currentObjectId])
                    delete controllerId[lastRemovedObjectId]
                    delete controllerIntervalId[currentObjectId]
                }
            }
        }
    })
}