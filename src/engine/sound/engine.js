import { getLastAction } from "../../app/redux/persistor"
import store from "../../app/redux/store"

var soundId = {}

export function startSound() {
    Object.keys(store.getState().objectList).map((key) => {
        if (soundId[key] == undefined) {
            soundId[key] = new Worker("worker/sound.js")
            soundId[key].postMessage(key)
        }
    })
    store.subscribe(() => {
        if (store.getState().config.soundEngine.started == true) {
            if (getLastAction() == "addObject") {
                if (soundId[currentObjectId] == undefined) {
                    var currentObjectId = store.getState().currentObjectId
                    soundId[currentObjectId] = new Worker("worker/sound.js")
                    soundId[currentObjectId].postMessage(currentObjectId)
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