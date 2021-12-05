var computeNumber = 128
var borderTopLeft = 0
var borderBottomLeft = computeNumber * computeNumber - computeNumber

var computeCircularRow = (key) => {
    if (key < borderTopLeft) {
        return computeNumber * computeNumber + key

    } else if (key > borderBottomLeft) {
        return key % (computeNumber * computeNumber)
    }
    return key
}

var computeCircularColumn = (key, rowStart, rowEnd) => {
    if (key < rowStart) {
        return rowEnd + 1 - (rowStart - key)
    } else if (key > rowEnd) {
        return rowStart - 1 + (key - rowEnd)
    }
    return key
}

var getNeighbourKV = (key) => {
    key = parseInt(key)
    var currentRowStart = (Math.floor(key / computeNumber)) * computeNumber
    var nextRowStart = computeCircularRow(currentRowStart + computeNumber)
    var prevRowStart = computeCircularRow(currentRowStart - computeNumber)
    var currentRowEnd = currentRowStart + computeNumber - 1
    var nextRowEnd = nextRowStart + computeNumber - 1
    var prevRowEnd = prevRowStart + computeNumber - 1
    var column = key % computeNumber
    return {
        "left": computeCircularColumn(currentRowStart + column - 1, currentRowStart, currentRowEnd),
        "right": computeCircularColumn(currentRowStart + column + 1, currentRowStart, currentRowEnd),
        "top": prevRowStart + column,
        "bottom": nextRowStart + column,
        "topLeft": computeCircularColumn(prevRowStart + column - 1, prevRowStart, prevRowEnd),
        "topRight": computeCircularColumn(prevRowStart + column + 1, prevRowStart, prevRowEnd),
        "bottomLeft": computeCircularColumn(nextRowStart + column - 1, nextRowStart, nextRowEnd),
        "bottomRight": computeCircularColumn(nextRowStart + column + 1, nextRowStart, nextRowEnd)
    }
}

var getProperty = (key) => {
    var property = {
        "objectId": key,
        "density": 1,
        "cellCount": 1,
        "mass": 1,
        "forceX": 0,
        "forceY": 0,
        "velocityX": 0,
        "velocityY": 0,
        "opposingForce": 0,
        "energyLoss": 0,
        "cellList": [key],
        "boundaryList": {
            "left": [key],
            "right": [key],
            "top": [key],
            "bottom": [key],
        },
        "collisionList": {
            "left": [],
            "right": [],
            "top": [],
            "bottom": [],
        }
    }

    return property
}

var setBoundaryUtil = (grid, boundaryList, visited, key) => {

    if (visited[key] != undefined) return
    var neighbours = getNeighbourKV(key)
    if (neighbours.left == undefined) return
    visited[key] = true

    if (grid[neighbours.left].type == "empty") {
        boundaryList.left.push(key)
    } else {
        if (grid[neighbours.left].objectId == grid[key].objectId) {
            setBoundaryUtil(grid, boundaryList, visited, neighbours.left)
        } else {
            boundaryList.left.push(key)
        }
    }
    if (grid[neighbours.right].type == "empty") {
        boundaryList.right.push(key)
    } else {
        if (grid[neighbours.right].objectId == grid[key].objectId) {
            setBoundaryUtil(grid, boundaryList, visited, neighbours.right)
        } else {
            boundaryList.right.push(key)
        }
    }
    if (grid[neighbours.top].type == "empty") {
        boundaryList.top.push(key)
    } else {
        if (grid[neighbours.top].objectId == grid[key].objectId) {
            setBoundaryUtil(grid, boundaryList, visited, neighbours.top)
        } else {
            boundaryList.top.push(key)
        }
    }
    if (grid[neighbours.bottom].type == "empty") {
        boundaryList.bottom.push(key)
    } else {
        if (grid[neighbours.bottom].objectId == grid[key].objectId) {
            setBoundaryUtil(grid, boundaryList, visited, neighbours.bottom)
        } else {
            boundaryList.bottom.push(key)
        }
    }
}

var setBoundary = (grid, objectList, key) => {
    var boundaryList = { "left": [], "right": [], "top": [], "bottom": [] }
    var visited = { "-1": true }
    setBoundaryUtil(grid, boundaryList, visited, parseInt(grid[key].objectId))
    objectList[grid[key].objectId].boundaryList = boundaryList
}

var collisionLeft = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.left.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.left[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.left].type == "object" && grid[neighbours.left].objectId != grid[key].objectId) {
            collision[grid[neighbours.left].objectId] = target
        }
    }
    delete collision["-1"]
    objectList[grid[key].objectId].collisionList.left = collision
}

var collisionRight = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.right.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.right[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.right].type == "object" && grid[neighbours.right].objectId != grid[key].objectId) {
            collision[grid[neighbours.right].objectId] = target
        }
    }
    delete collision["-1"]
    objectList[grid[key].objectId].collisionList.right = collision
}

var collisionTop = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.top.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.top[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.top].type == "object" && grid[neighbours.top].objectId != grid[key].objectId) {
            collision[grid[neighbours.top].objectId] = target
        }
    }
    delete collision["-1"]
    objectList[grid[key].objectId].collisionList.top = collision
}

var collisionBottom = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.bottom.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.bottom[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.bottom].type == "object" && grid[neighbours.bottom].objectId != grid[key].objectId) {
            collision[grid[neighbours.bottom].objectId] = target
        }
    }
    delete collision["-1"]
    objectList[grid[key].objectId].collisionList.bottom = collision
}

var addCell = (grid, objectId, futureKey, pushX, pushY, color) => {
    if (grid[futureKey].color == "#000000") {
        grid[futureKey].color = color
        grid[futureKey].type = "object"
        grid[futureKey].objectId = objectId
        grid[futureKey].pushX = pushX
        grid[futureKey].pushY = pushY
    }
}

var removeCell = (grid, currentKey) => {
    grid[currentKey].color = "#000000"
    grid[currentKey].type = "empty"
    grid[currentKey].objectId = "-1"
    grid[currentKey].pushX = 0
    grid[currentKey].pushY = 0
}

var forceLeft = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionLeft(grid, objectList, key)
    Object.keys(objectList[key].collisionList.left).map((target) => {
        objectList[target].forceX -= grid[objectList[key].collisionList.left[target]].pushX
        objectList[key].forceX += grid[objectList[key].collisionList.left[target]].pushX
        objectList[target].forceY -= grid[objectList[key].collisionList.left[target]].pushY
    })

}

var forceRight = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionRight(grid, objectList, key)
    Object.keys(objectList[key].collisionList.right).map((target) => {
        objectList[target].forceX += grid[objectList[key].collisionList.right[target]].pushX
        objectList[key].forceX -= grid[objectList[key].collisionList.right[target]].pushX
        objectList[target].forceY += grid[objectList[key].collisionList.right[target]].pushY
    })

}

var forceTop = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionTop(grid, objectList, key)
    Object.keys(objectList[key].collisionList.top).map((target) => {
        objectList[target].forceY += grid[objectList[key].collisionList.top[target]].pushY
        objectList[key].forceY -= grid[objectList[key].collisionList.top[target]].pushY
        objectList[target].forceX += grid[objectList[key].collisionList.top[target]].pushX
    })

}

var forceBottom = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionBottom(grid, objectList, key)
    Object.keys(objectList[key].collisionList.bottom).map((target) => {
        objectList[target].forceY -= grid[objectList[key].collisionList.bottom[target]].pushY
        objectList[key].forceY += grid[objectList[key].collisionList.bottom[target]].pushY
        objectList[target].forceX -= grid[objectList[key].collisionList.bottom[target]].pushX
    })

}

var moveLeft = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionLeft(grid, objectList, key)
    if (Object.keys(objectList[key].collisionList.left).length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber - 1
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []
    var pushX = { "-1": "-1" }
    var pushY = { "-1": "-1" }
    var color = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        newCellList.push(futureKey)
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey])
    })

    delete objectList[key]
    return objectId
}

var moveRight = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionRight(grid, objectList, key)
    if (Object.keys(objectList[key].collisionList.right).length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber + 1
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []
    var pushX = { "-1": "-1" }
    var pushY = { "-1": "-1" }
    var color = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey])
    })

    delete objectList[key]
    return objectId
}

var moveUp = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionTop(grid, objectList, key)
    if (Object.keys(objectList[key].collisionList.top).length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber - computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []
    var pushX = { "-1": "-1" }
    var pushY = { "-1": "-1" }
    var color = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber - computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey])
    })

    delete objectList[key]
    return objectId
}

var moveDown = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    collisionBottom(grid, objectList, key)
    if (Object.keys(objectList[key].collisionList.bottom).length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber + computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []
    var pushX = { "-1": "-1" }
    var pushY = { "-1": "-1" }
    var color = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber + computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey])
    })

    delete objectList[key]
    return objectId
}

var expandUp = (grid, objectList, currentKey) => {
    var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber - computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(currentKey) % computeNumber
    var upKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[upKey].type == "empty" && grid[upKey].color == "#000000") {
        grid[upKey].color = grid[currentKey].color;
        grid[upKey].type = "object";
        grid[upKey].pushX = 0;
        grid[upKey].pushY = 0;
        grid[upKey].objectId = grid[currentKey].objectId;
        var cell = document.getElementById(upKey)
        cell.style.backgroundColor = grid[upKey].color
        objectList[grid[currentKey].objectId].cellCount++
        objectList[grid[currentKey].objectId].cellList.push(upKey)
    }
}

var expandDown = (grid, objectList, currentKey) => {
    var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber + computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(currentKey) % computeNumber
    var upKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[upKey].type == "empty" && grid[upKey].color == "#000000") {
        grid[upKey].color = grid[currentKey].color;
        grid[upKey].type = "object";
        grid[upKey].pushX = 0;
        grid[upKey].pushY = 0;
        grid[upKey].objectId = grid[currentKey].objectId;
        var cell = document.getElementById(upKey)
        cell.style.backgroundColor = grid[upKey].color
        objectList[grid[currentKey].objectId].cellCount++
        objectList[grid[currentKey].objectId].cellList.push(upKey)
    }
}

var expandLeft = (grid, objectList, currentKey) => {
    var rowStart = computeCircularRow(Math.floor(parseInt(currentKey) / computeNumber) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(currentKey) % computeNumber - 1
    var upKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[upKey].type == "empty" && grid[upKey].color == "#000000") {
        grid[upKey].color = grid[currentKey].color;
        grid[upKey].pushX = 0;
        grid[upKey].pushY = 0;
        grid[upKey].objectId = grid[currentKey].objectId;
        var cell = document.getElementById(upKey)
        cell.style.backgroundColor = grid[upKey].color
        objectList[grid[currentKey].objectId].cellCount++
        objectList[grid[currentKey].objectId].cellList.push(upKey)
    }
}

var expandRight = (grid, objectList, currentKey) => {
    var rowStart = computeCircularRow(Math.floor(parseInt(currentKey) / computeNumber) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(currentKey) % computeNumber + 1
    var upKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[upKey].type == "empty" && grid[upKey].color == "#000000") {
        grid[upKey].color = grid[currentKey].color;
        grid[upKey].pushX = 0;
        grid[upKey].pushY = 0;
        grid[upKey].objectId = grid[currentKey].objectId;
        var cell = document.getElementById(upKey)
        cell.style.backgroundColor = grid[upKey].color
        objectList[grid[currentKey].objectId].cellCount++
        objectList[grid[currentKey].objectId].cellList.push(upKey)
    }
}

var createObject = (grid, objectList, currentKey) => {
    if (grid[currentKey].type == "empty") {
        objectList[currentKey] = getProperty(currentKey)
        grid[currentKey].color = "#ffffff";
        grid[currentKey].pushX = 0;
        grid[currentKey].pushY = 0;
        grid[currentKey].type = "object";
        grid[currentKey].objectId = currentKey;
    }
}

var contractObject = (grid, objectList, currentKey) => {
    if (grid[currentKey].type == "object") {

        var objectId = grid[currentKey].objectId
        objectList[objectId].cellCount--

        grid[currentKey].color = "#000000";
        grid[currentKey].type = "empty";
        grid[currentKey].objectId = "-1";
        grid[currentKey].pushX = 0;
        grid[currentKey].pushY = 0;

        var cellList = []
        for (let i = 0; i < objectList[objectId].cellList.length; i++) {
            if (objectList[objectId].cellList[i] != currentKey) {
                cellList.push(objectList[objectId].cellList[i])
            }
        }

        objectList[objectId].cellList = cellList

        if (objectId == currentKey) {
            var newObjectId = objectList[objectId].cellList[0]
            objectList[newObjectId] = JSON.parse(JSON.stringify(objectList[objectId]))
            delete objectList[objectId]

            for (let i = 0; i < objectList[newObjectId].cellList.length; i++) {
                grid[objectList[newObjectId].cellList[i]].objectId = newObjectId
            }

            return newObjectId
        }

    }
}

var destroyObject = (grid, objectList, currentKey) => {
    var objectId = grid[currentKey].objectId
    if (grid[currentKey].type == "object") {
        for (let i = 0; i < objectList[objectId].cellList.length; i++) {
            grid[objectList[objectId].cellList[i]].color = "#000000";
            grid[objectList[objectId].cellList[i]].type = "empty";
            grid[objectList[objectId].cellList[i]].objectId = "-1";
            grid[objectList[objectId].cellList[i]].pushX = 0;
            grid[objectList[objectId].cellList[i]].pushY = 0;
        }
        delete objectList[objectId];
    }
}


module.exports = {
    createObject: createObject,
    destroyObject: destroyObject,
    contractObject: contractObject,
    moveUp: moveUp,
    moveDown: moveDown,
    moveLeft: moveLeft,
    moveRight: moveRight,
    forceLeft: forceLeft,
    forceRight: forceRight,
    forceTop: forceTop,
    forceBottom: forceBottom,
    collisionLeft: collisionLeft,
    collisionRight: collisionRight,
    collisionTop: collisionTop,
    collisionBottom: collisionBottom,
    setBoundary: setBoundary,
    expandUp: expandUp,
    expandDown: expandDown,
    expandLeft: expandLeft,
    expandRight: expandRight,
    computeCircularColumn: computeCircularColumn,
    computeCircularRow: computeCircularRow
}