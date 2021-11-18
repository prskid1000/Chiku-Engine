export var initState = {
  config:{
      controllerEngine: {
          status: 0
      },
      graphicsEngine: {
          status: 0
      },
      intelligenceEngine: {
          status: 0
      },
      physicsEngine: {
          status: 0
      },
      soundEngine: {
          status: 0
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

