import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var soundId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
}

export function startSound() {
    Object.keys(store.getState().objectList).map((key) => {
        if (soundId[key] == undefined) {
            soundId[key] = new Worker("worker/sound.js")
            soundId[key].postMessage({
                "objectList": store.getState().objectList,
                "objectId": key
            })
            soundId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (store.getState().config.soundEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (soundId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    soundId[currentObjectId] = new Worker("worker/sound.js")
                    soundId[currentObjectId].postMessage({
                        "objectList": store.getState().objectList,
                        "objectId": currentObjectId
                    })
                    soundId[currentObjectId].onmessage = (e) => { saveState(e.data) }
                }
            }
        }
    })
}

export function stopSound() {
    Object.keys(store.getState().objectList).map((key) => {
        if (soundId[key] != undefined) {
            soundId[key].terminate()
            delete soundId[key]
        }
    })
    store.subscribe(() => {
        if (store.getState().config.soundEngine.started == true) {
            if (getLastAction() == "removeObject") {
                if (soundId[lastRemovedObjectId] != undefined) {
                    var lastRemovedObjectId = store.getState().lastRemovedObjectId
                    soundId[lastRemovedObjectId].terminate()
                    delete soundId[lastRemovedObjectId]
                }
            }
        }
    })
}