import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"

var intelligenceId = {}

export function startIntelligence() {
    Object.keys(store.getState().objectList).map((key) => {
        if (intelligenceId[key] == undefined) {
            intelligenceId[key] = new Worker("worker/intelligence.js")
            intelligenceId[key].postMessage(key)
        }
    })
    store.subscribe(() => {
        if (store.getState().config.intelligenceEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (intelligenceId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    intelligenceId[currentObjectId] = new Worker("worker/intelligence.js")
                    intelligenceId[currentObjectId].postMessage(currentObjectId)
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