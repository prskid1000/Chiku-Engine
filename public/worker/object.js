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
    var collision = []
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.left.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.left[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.left].type != "empty") collision.push(target)
        if (grid[neighbours.left].type == "object") {
            var netAx = (objectList[grid[key].objectId].forceX + objectList[grid[key].objectId].velocityX * objectList[grid[key].objectId].mass)
            var netBx = objectList[grid[neighbours.left].objectId].forceX + objectList[grid[neighbours.left].objectId].velocityX * objectList[grid[neighbours.left].objectId].mass

            objectList[grid[key].objectId].forceX = netAx - netBx
            objectList[grid[neighbours.left].objectId].forceX = netBx - netAx

            if (Math.abs(netAx - netBx) == 0) {
                var netAy = (objectList[grid[key].objectId].forceY + objectList[grid[key].objectId].velocityY * objectList[grid[key].objectId].mass)
                var netBy = objectList[grid[neighbours.left].objectId].forceY + objectList[grid[neighbours.left].objectId].velocityY * objectList[grid[neighbours.left].objectId].mass

                objectList[grid[key].objectId].forceY = netAy - netBy
                objectList[grid[neighbours.left].objectId].forceY = netBy - netAy
            }
        }
    }
    objectList[grid[key].objectId].collisionList.left = collision
}

var collisionRight = (grid, objectList, key) => {
    var collision = []
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.right.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.right[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.right].type != "empty") collision.push(target)
        if (grid[neighbours.right].type == "object") {
            var netAx = (objectList[grid[key].objectId].forceX + objectList[grid[key].objectId].velocityX * objectList[grid[key].objectId].mass)
            var netBx = objectList[grid[neighbours.right].objectId].forceX + objectList[grid[neighbours.right].objectId].velocityX * objectList[grid[neighbours.right].objectId].mass

            objectList[grid[key].objectId].forceX = netAx - netBx
            objectList[grid[neighbours.right].objectId].forceX = netBx - netAx

            if (Math.abs(netAx - netBx) == 0) {
                var netAy = (objectList[grid[key].objectId].forceY + objectList[grid[key].objectId].velocityY * objectList[grid[key].objectId].mass)
                var netBy = objectList[grid[neighbours.right].objectId].forceY + objectList[grid[neighbours.right].objectId].velocityY * objectList[grid[neighbours.right].objectId].mass

                objectList[grid[key].objectId].forceY = netAy - netBy
                objectList[grid[neighbours.right].objectId].forceY = netBy - netAy
            }
        }
    }
    objectList[grid[key].objectId].collisionList.right = collision
}

var collisionTop = (grid, objectList, key) => {
    var collision = []
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.top.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.top[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.top].type != "empty") collision.push(target)
        if (grid[neighbours.top].type == "object") {
            var netAy = (objectList[grid[key].objectId].forceY + objectList[grid[key].objectId].velocityY * objectList[grid[key].objectId].mass)
            var netBy = objectList[grid[neighbours.top].objectId].forceY + objectList[grid[neighbours.top].objectId].velocityY * objectList[grid[neighbours.top].objectId].mass

            objectList[grid[key].objectId].forceY = netAy - netBy
            objectList[grid[neighbours.top].objectId].forceY = netBy - netAy

            if (Math.abs(netAy - netBy) == 0) {
                var netAx = (objectList[grid[key].objectId].forceX + objectList[grid[key].objectId].velocityX * objectList[grid[key].objectId].mass)
                var netBx = objectList[grid[neighbours.top].objectId].forceX + objectList[grid[neighbours.top].objectId].velocityX * objectList[grid[neighbours.top].objectId].mass

                objectList[grid[key].objectId].forceX = netAx - netBx
                objectList[grid[neighbours.top].objectId].forceX = netBx - netAx
            }
        }
    }
    objectList[grid[key].objectId].collisionList.top = collision
}

var collisionBottom = (grid, objectList, key) => {
    var collision = []
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.bottom.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.bottom[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.bottom].type != "empty") collision.push(target)
        if (grid[neighbours.bottom].type == "object") {
            var netAy = (objectList[grid[key].objectId].forceY + objectList[grid[key].objectId].velocityY * objectList[grid[key].objectId].mass)
            var netBy = objectList[grid[neighbours.bottom].objectId].forceY + objectList[grid[neighbours.bottom].objectId].velocityY * objectList[grid[neighbours.bottom].objectId].mass

            objectList[grid[key].objectId].forceY = netAy - netBy
            objectList[grid[neighbours.bottom].objectId].forceY = netBy - netAy

            if (Math.abs(netAy - netBy) == 0) {
                var netAx = (objectList[grid[key].objectId].forceX + objectList[grid[key].objectId].velocityX * objectList[grid[key].objectId].mass)
                var netBx = objectList[grid[neighbours.bottom].objectId].forceX + objectList[grid[neighbours.bottom].objectId].velocityX * objectList[grid[neighbours.bottom].objectId].mass

                objectList[grid[key].objectId].forceX = netAx - netBx
                objectList[grid[neighbours.bottom].objectId].forceX = netBx - netAx
            }
        }
    }
    objectList[grid[key].objectId].collisionList.bottom = collision
}

var setCollision = (grid, objectList, key) => {
    collisionLeft(grid, objectList, key)
    collisionRight(grid, objectList, key)
    collisionTop(grid, objectList, key)
    collisionBottom(grid, objectList, key)
}

var addCell = (grid, objectId, futureKey) => {
    if (grid[futureKey].color == "black") {
        grid[futureKey].color = "white"
        grid[futureKey].type = "object"
        grid[futureKey].objectId = objectId
    }
}

var removeCell = (grid, currentKey) => {
    grid[currentKey].color = "black"
    grid[currentKey].type = "empty"
    grid[currentKey].objectId = "-1"
}

var moveLeft = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    setCollision(grid, objectList, key)
    if (objectList[key].collisionList.left.length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber - 1
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey)
    })

    delete objectList[key]
    setBoundary(grid, objectList, objectId)
    setCollision(grid, objectList, objectId)
    return objectId
}

var moveRight = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    setCollision(grid, objectList, key)
    if (objectList[key].collisionList.right.length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber + 1
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey)
    })

    delete objectList[key]
    setBoundary(grid, objectList, objectId)
    setCollision(grid, objectList, objectId)
    return objectId
}

var moveUp = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    setCollision(grid, objectList, key)
    if (objectList[key].collisionList.top.length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber - computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber - computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey)
    })

    delete objectList[key]
    setBoundary(grid, objectList, objectId)
    setCollision(grid, objectList, objectId)
    return objectId
}

var moveDown = (grid, objectList, key) => {
    key = grid[key].objectId
    setBoundary(grid, objectList, key)
    setCollision(grid, objectList, key)
    if (objectList[key].collisionList.bottom.length != 0) return

    var rowStart = computeCircularRow((Math.floor(parseInt(key) / computeNumber)) * computeNumber + computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(key) % computeNumber
    var objectId = computeCircularColumn(column, rowStart, rowEnd).toString()

    objectList[objectId] = JSON.parse(JSON.stringify(objectList[key]))
    objectList[objectId].objectId = objectId
    var newCellList = []

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber + computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey)
    })

    delete objectList[key]
    setBoundary(grid, objectList, objectId)
    setCollision(grid, objectList, objectId)
    return objectId
}

var expandUp = (grid, objectList, currentKey) => {
    var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber - computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(currentKey) % computeNumber
    var upKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[upKey].type == "empty") {
        grid[upKey].color = "white";
        grid[upKey].type = "object";
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
    var downKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[downKey].type == "empty") {
        grid[downKey].color = "white";
        grid[downKey].type = "object";
        grid[downKey].objectId = grid[currentKey].objectId;
        var cell = document.getElementById(downKey)
        cell.style.backgroundColor = grid[downKey].color
        objectList[grid[currentKey].objectId].cellCount++
        objectList[grid[currentKey].objectId].cellList.push(downKey)
    }
}

var expandLeft = (grid, objectList, currentKey) => {
    var rowStart = computeCircularRow(Math.floor(parseInt(currentKey) / computeNumber) * computeNumber)
    var rowEnd = rowStart + computeNumber - 1
    var column = rowStart + parseInt(currentKey) % computeNumber - 1
    var upKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    if (grid[upKey].type == "empty") {
        grid[upKey].color = "white";
        grid[upKey].type = "object";
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
    if (grid[upKey].type == "empty") {
        grid[upKey].color = "white";
        grid[upKey].type = "object";
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
        grid[currentKey].color = "white";
        grid[currentKey].type = "object";
        grid[currentKey].objectId = currentKey;
    }
}

var destroyObject = (grid, objectList, currentKey) => {
    if (grid[currentKey].type == "object") {
        for (let i = 0; i < objectList[currentKey].cellList.length; i++) {
            grid[currentKey].color = "black";
            grid[currentKey].type = "empty";
            grid[currentKey].objectId = "-1";
        }
        delete objectList[currentKey];
    }
}
