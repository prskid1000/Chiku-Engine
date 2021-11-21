import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var physicsId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
    console.log(properties.objectId + "Physical")
}

export function startPhysics() {
    Object.keys(getState().objectList).map((key) => {
        if (physicsId[key] == undefined) {
            physicsId[key] = new Worker("worker/physics.js")
            setInterval(() => {
                physicsId[key].postMessage({
                    "objectList": getState().objectList,
                    "objectId": key
                })
            }, 1000);
            physicsId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (getState().config.physicsEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (physicsId[currentObjectId] == undefined) {
                    var currentObjectId = getState().currentObjectId
                    physicsId[currentObjectId] = new Worker("worker/physics.js")
                    setInterval(() => {
                        physicsId[currentObjectId].postMessage({
                            "objectList": getState().objectList,
                            "objectId": currentObjectId
                        })
                    }, 1000);
                    physicsId[currentObjectId].onmessage = (e) => { saveState(e.data) }

                }
            }
        }
    })
}

export function stopPhysics() {
    Object.keys(getState().objectList).map((key) => {
        if (physicsId[key] != undefined) {
            physicsId[key].terminate()
            delete physicsId[key]
        }
    })
    store.subscribe(() => {
        if (getState().config.physicsEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (physicsId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = getState().lastRemovedObjectId
                    physicsId[lastRemovedObjectId].terminate()
                    delete physicsId[lastRemovedObjectId]
                }
            }
        }
    })
}