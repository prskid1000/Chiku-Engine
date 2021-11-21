import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var physicsId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
}

export function startPhysics() {
    Object.keys(store.getState().objectList).map((key) => {
        if (physicsId[key] == undefined) {
            physicsId[key] = new Worker("worker/physics.js")
            physicsId[key].postMessage({
                "objectList": store.getState().objectList,
                "objectId": key
            })
            physicsId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (store.getState().config.physicsEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (physicsId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    physicsId[currentObjectId] = new Worker("worker/physics.js")
                    physicsId[currentObjectId].postMessage({
                        "objectList": store.getState().objectList,
                        "objectId": currentObjectId
                    })
                    physicsId[currentObjectId].onmessage = (e) => { saveState(e.data) }

                }
            }
        }
    })
}

export function stopPhysics() {
    Object.keys(store.getState().objectList).map((key) => {
        if (physicsId[key] != undefined) {
            physicsId[key].terminate()
            delete physicsId[key]
        }
    })
    store.subscribe(() => {
        if (store.getState().config.physicsEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (physicsId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = store.getState().lastRemovedObjectId
                    physicsId[lastRemovedObjectId].terminate()
                    delete physicsId[lastRemovedObjectId]
                }
            }
        }
    })
}