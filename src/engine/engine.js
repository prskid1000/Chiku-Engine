import { getLastAction } from '../app/redux/persistor';
import actions from '../app/redux/actions';
import store from '../app/redux/store';
import { startController, stopController } from './controller/engine';
import { startGraphics, stopGraphics } from './graphics/engine';
import { startIntelligence, stopIntelligence } from './intelligence/engine';
import { startPhysics, stopPhysics } from './physics/engine';
import { startSound, stopSound } from './sound/engine';

var engineList = [
    'controllerEngine',
    'graphicsEngine',
    'intelligenceEngine',
    'physicsEngine',
    'soundEngine'
]
var startEngine = {
    "controllerEngine" : startController,
    "graphicsEngine" : startGraphics,
    "intelligenceEngine": startIntelligence,
    "physicsEngine": startPhysics,
    "soundEngine": startSound
}

var stopEngine = {
    "controllerEngine": stopController,
    "graphicsEngine": stopGraphics,
    "intelligenceEngine": stopIntelligence,
    "physicsEngine": stopPhysics,
    "soundEngine": stopSound
}

export function registerEngine() {
    store.subscribe(() => {
        if (getLastAction() == "updateConfig") {
            var engines = store.getState().config
            engineList.map((value) => {
                if (engines[value].status == 0 && engines[value].started == true) {
                    stopEngine[value]()
                    engines[value].started = false
                    actions.updateConfig.payload = engines
                    store.dispatch(actions.updateConfig)
                }
                if (engines[value].status == 1 && engines[value].started == false) {
                    startEngine[value]()
                    engines[value].started = true
                    actions.updateConfig.payload = engines
                    store.dispatch(actions.updateConfig)
                }
            })
        }
    })
}