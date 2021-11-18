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

var objectList = (state = [], action) => {
    switch (action.type) {
        case 'addObject':
            var properties = {
                mass: 0,
                force: {
                    magnitude: 0,
                    direction: 0
                },
                velocity: {
                    magnitude: 0,
                    direction: 0
                },
                xCoordinate: 0,
                yCoordinate: 0,
                radius: 0,
                textureId: 0,
                shapeId: 0
            }
            
            state[action.payload.objectId] = properties
            return state

        case 'removeObject':
            delete state[action.payload.objectId]
            if(state == undefined) state = {}
            return state

        case 'updateObject':
            state = action.payload
            console.log(state)
            return state

        default:
            return state
    }
}

var currentObjectId = (state = [], action) => {
    switch (action.type) {
        case 'setCurrentObjectId':
            state = action.payload.objectId
            return state

        default:
            return state
    }
}

var reducers = {
    config,
    playground,
    pointer,
    objectList,
    currentObjectId
}

export default reducers;