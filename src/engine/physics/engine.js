import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { workLoad } from "./workload"

var physicsId = {}

export function startPhysics() {
    Object.keys(store.getState().objectList).map((key) => {
        if (physicsId[key] == undefined) {
            physicsId[key] = new Worker("worker/physics.js")
            physicsId[key].postMessage(key)
            physicsId[key].onmessage = workLoad(key)
        }
    })
    store.subscribe(() => {
        if (store.getState().config.physicsEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (physicsId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    physicsId[currentObjectId] = new Worker("worker/physics.js")
                    physicsId[currentObjectId].postMessage(currentObjectId)
                    physicsId[currentObjectId].onmessage = workLoad(currentObjectId)

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