import { getLastAction } from '../app/redux/persistor';
import store from '../app/redux/store';

var engineList = [
    'controllerEngine',
    'graphicsEngine',
    'intelligenceEngine',
    'physicsEngine',
    'soundEngine'
]

export function registerEngine() {
    store.subscribe(() => {
        if (getLastAction() == "updateConfig") {
            var engines = store.getState().config
            engineList.map((value) => {
                if (engines[value].status == 0 && engines[value].started == true) {

                }
                if (engines[value].status == 1 && engines[value].started == false) {

                }
            })
        }
    })
}