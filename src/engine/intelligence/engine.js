import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var intelligenceId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
    console.log(properties.objectId + "Intelligence")
}


export function startIntelligence() {
    Object.keys(getState().objectList).map((key) => {
        if (intelligenceId[key] == undefined) {
            intelligenceId[key] = new Worker("worker/intelligence.js")
            setInterval(() => {
                intelligenceId[key].postMessage({
                    "objectList": getState().objectList,
                    "objectId": key
                })
            }, 1000);
            intelligenceId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (getState().config.intelligenceEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (intelligenceId[currentObjectId] == undefined) {
                    var currentObjectId = getState().currentObjectId
                    intelligenceId[currentObjectId] = new Worker("worker/intelligence.js")
                    setInterval(() => {
                        intelligenceId[currentObjectId].postMessage({
                            "objectList": getState().objectList,
                            "objectId": currentObjectId
                        })
                    }, 1000);
                    intelligenceId[currentObjectId].onmessage = (e) => { saveState(e.data) }
                }
            }
        }
    })
}

export function stopIntelligence() {
    Object.keys(getState().objectList).map((key) => {
        if (intelligenceId[key] != undefined) {
            intelligenceId[key].terminate()
            delete intelligenceId[key]
        }
    })
    store.subscribe(() => {
        if (getState().config.intelligenceEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (intelligenceId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = getState().lastRemovedObjectId
                    intelligenceId[lastRemovedObjectId].terminate()
                    delete intelligenceId[lastRemovedObjectId]
                }
            }
        }
    })
}