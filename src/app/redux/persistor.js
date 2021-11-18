export var initState = {
  config:{
      controllerEngine: {
          status: 0,
          started: false
      },
      graphicsEngine: {
          status: 0,
          started: false
      },
      intelligenceEngine: {
          status: 0,
          started: false
      },
      physicsEngine: {
          status: 0,
          started: false
      },
      soundEngine: {
          status: 0,
          started: false
      }
  },
  playground: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
  },
  pointer: {
      x: 0,
      y: 0
  },
  objectList: {},
  currentObjectId: 0
}

export function getLastAction() {
    return sessionStorage.getItem("REDUX_LAST_ACTION")
}

export function setLastAction(lastAction) {
    sessionStorage.setItem("REDUX_LAST_ACTION", lastAction)
}

export function getState() {
    return JSON.parse(sessionStorage.getItem(process.env.REACT_APP_NAME))
}

export function setState(state) {
    sessionStorage.setItem(process.env.REACT_APP_NAME, JSON.stringify(state))
}

export var state = getState() != undefined ? getState() : initState

if (sessionStorage.getItem(process.env.REACT_APP_NAME) == undefined) {
    setState(initState)
}

