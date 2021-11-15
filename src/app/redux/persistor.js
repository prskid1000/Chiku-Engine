export var initState = {
  
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

