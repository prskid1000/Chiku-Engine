import { getState, setState, getLastAction } from "../../app/redux/persistor";
import store from "../../app/redux/store"

var soundId = {}

var saveState = (properties) => {
    var state = getState()
    state.objectList[properties.objectId] = properties
    setState(state)
    console.log(properties.objectId + "Sound")
}

export function startSound() {
    Object.keys(getState().objectList).map((key) => {
        if (soundId[key] == undefined) {
            soundId[key] = new Worker("worker/sound.js")
            setInterval(() => {
                soundId[key].postMessage({
                    "objectList": getState().objectList,
                    "objectId": key
                })
            }, 1000);
            soundId[key].onmessage = (e) => { saveState(e.data) }
        }
    })
    store.subscribe(() => {
        if (getState().config.soundEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (soundId[currentObjectId] == undefined) {
                    var currentObjectId = getState().currentObjectId
                    soundId[currentObjectId] = new Worker("worker/sound.js")
                    setInterval(() => {
                        soundId[currentObjectId].postMessage({
                            "objectList": getState().objectList,
                            "objectId": currentObjectId
                        })
                    }, 1000);
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