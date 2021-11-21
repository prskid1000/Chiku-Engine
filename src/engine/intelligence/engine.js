import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var intelligenceId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
}


export function startIntelligence() {
    Object.keys(store.getState().objectList).map((key) => {
        if (intelligenceId[key] == undefined) {
            intelligenceId[key] = new Worker("worker/intelligence.js")
            intelligenceId[key].postMessage({
                "objectList": store.getState().objectList,
                "objectId": key
            })
            intelligenceId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (store.getState().config.intelligenceEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (intelligenceId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    intelligenceId[currentObjectId] = new Worker("worker/intelligence.js")
                    intelligenceId[currentObjectId].postMessage({
                        "objectList": store.getState().objectList,
                        "objectId": currentObjectId
                    })
                    intelligenceId[currentObjectId].onmessage = (e) => { saveState(e.data) }
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