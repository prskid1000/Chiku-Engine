import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"
import { workLoad } from "./workload"

var intelligenceId = {}


export function startIntelligence() {
    Object.keys(store.getState().objectList).map((key) => {
        if (intelligenceId[key] == undefined) {
            intelligenceId[key] = new Worker("worker/intelligence.js")
            intelligenceId[key].postMessage(key)
            intelligenceId[key].onmessage = workLoad(key)
        }
    })
    store.subscribe(() => {
        if (store.getState().config.intelligenceEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (intelligenceId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    intelligenceId[currentObjectId] = new Worker("worker/intelligence.js")
                    intelligenceId[currentObjectId].postMessage(currentObjectId)
                    intelligenceId[currentObjectId].onmessage = workLoad(currentObjectId)
                }
            }
        }
    })
}

export function stopIntelligence() {
    Object.keys(store.getState().objectList).map((key) => {
        if (intelligenceId[key] != undefined) {
            intelligenceId[key].terminate()
            delete intelligenceId[key]
        }
    })
    store.subscribe(() => {
        if (store.getState().config.intelligenceEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (intelligenceId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = store.getState().lastRemovedObjectId
                    intelligenceId[lastRemovedObjectId].terminate()
                    delete intelligenceId[lastRemovedObjectId]
                }
            }
        }
    })
}