var config = (state = [], action) => {
    switch (action.type) {
        case 'resetState':
            state.config = {}
            return state

        default:
            return state
    }
}

var playground = (state = [], action) => {
    switch (action.type) {
        case 'setPlaygroundCoordinates':
            state.top = action.payload.top
            state.left = action.payload.left
            state.right = action.payload.right
            state.bottom = action.payload.bottom
            console.log(action.payload)
            return state

        default:
            return state
    }
}

var pointer = (state = [], action) => {
    switch (action.type) {
        case 'setPointerCoordinates':
            state.x = action.payload.pointerX
            state.y = action.payload.pointerY
            return state

        default:
            return state
    }
}

var reducers = {
    config,
    playground,
    pointer
}

export default reducers;