export var initState = {
  config:{},
  playground: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
  },
  pointer: {
      x: 0,
      y: 0
  }
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

