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
        "destroySelf": false,
        "density": 1,
        "cellCount": 1,
        "mass": 1,
        "forceX": 0,
        "forceY": 0,
        "velocityX": 0,
        "velocityY": 0,
        "opposingForce": 0,
        "energyLoss": 0,
        "forceList": {
            "left": [],
            "right": [],
            "top": [],
            "bottom": [],
        },
        "script": `(grid, objectList, objectId) => {\n
            //console.log(objectList[objectId].scriptVariables)\n
        }`,
        "childObject": {
            "child": true,
            "destroySelf": false,
            "destroyLeft": false,
            "destroyRight": false,
            "destroyTop": false,
            "destroyBottom": false,
            "density": 1,
            "cellCount": 0,
            "mass": 0,
            "forceX": 0,
            "forceY": 0,
            "velocityX": 0,
            "velocityY": 0,
            "opposingForce": 0,
            "energyLoss": 0,
            "script": `(grid, objectList, objectId) => {\n
            //console.log(objectList[objectId].scriptVariables)\n
            }`,
            "childGridC": [
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
                ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"]
            ],
            "childGrid": [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            "cellList": []
        },
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
        },
        "scriptVariables": {}
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
    var force = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.left.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.left[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.left].type == "object" && grid[neighbours.left].objectId != grid[key].objectId) {
            collision[grid[neighbours.left].objectId] = target
            if (objectList[grid[target].objectId].child != true) {
                if (force[grid[neighbours.left].objectId] == undefined) {
                    force[grid[neighbours.left].objectId] = [target]
                } else {
                    force[grid[neighbours.left].objectId].push(target)
                }
            }
        }
    }
    delete collision["-1"]
    delete force["-1"]
    objectList[grid[key].objectId].collisionList.left = collision
    objectList[grid[key].objectId].forceList.left = force
}

var collisionRight = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    var force = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.right.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.right[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.right].type == "object" && grid[neighbours.right].objectId != grid[key].objectId) {
            collision[grid[neighbours.right].objectId] = target
            if (objectList[grid[target].objectId].child != true) {
                if (force[grid[neighbours.right].objectId] == undefined) {
                    force[grid[neighbours.right].objectId] = [target]
                } else {
                    force[grid[neighbours.right].objectId].push(target)
                }
            }
        }
    }
    delete collision["-1"]
    delete force["-1"]
    objectList[grid[key].objectId].collisionList.right = collision
    objectList[grid[key].objectId].forceList.right = force
}

var collisionTop = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    var force = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.top.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.top[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.top].type == "object" && grid[neighbours.top].objectId != grid[key].objectId) {
            collision[grid[neighbours.top].objectId] = target
            if (objectList[grid[target].objectId].child != true) {
                if (force[grid[neighbours.top].objectId] == undefined) {
                    force[grid[neighbours.top].objectId] = [target]
                } else {
                    force[grid[neighbours.top].objectId].push(target)
                }
            }
        }
    }
    delete collision["-1"]
    delete force["-1"]
    objectList[grid[key].objectId].collisionList.top = collision
    objectList[grid[key].objectId].forceList.top = force
}

var collisionBottom = (grid, objectList, key) => {
    var collision = { "-1": "-1" }
    var force = { "-1": "-1" }
    for (let i = 0; i < objectList[grid[key].objectId].boundaryList.bottom.length; i++) {
        var target = objectList[grid[key].objectId].boundaryList.bottom[i]
        var neighbours = getNeighbourKV(target)
        if (grid[neighbours.bottom].type == "object" && grid[neighbours.bottom].objectId != grid[key].objectId) {
            collision[grid[neighbours.bottom].objectId] = target
            if (objectList[grid[target].objectId].child != true) {
                if (force[grid[neighbours.bottom].objectId] == undefined) {
                    force[grid[neighbours.bottom].objectId] = [target]
                } else {
                    force[grid[neighbours.bottom].objectId].push(target)
                }
            }
        }
    }
    delete collision["-1"]
    delete force["-1"]
    objectList[grid[key].objectId].collisionList.bottom = collision
    objectList[grid[key].objectId].forceList.bottom = force
}

var addCell = (grid, objectId, futureKey, pushX, pushY, color, produce, destroy) => {
    if (grid[futureKey].color == "#000000") {
        grid[futureKey].color = color
        grid[futureKey].type = "object"
        grid[futureKey].objectId = objectId

        grid[futureKey].pushX = pushX
        grid[futureKey].pushY = pushY

        grid[futureKey].produceLeft = produce.produceLeft
        grid[futureKey].produceRight = produce.produceRight
        grid[futureKey].produceTop = produce.produceTop
        grid[futureKey].produceBottom = produce.produceBottom

        grid[futureKey].destroyLeft = destroy.destroyLeft
        grid[futureKey].destroyRight = destroy.destroyRight
        grid[futureKey].destroyTop = destroy.destroyTop
        grid[futureKey].destroyBottom = destroy.destroyBottom
    }
}

var removeCell = (grid, currentKey) => {
    grid[currentKey].color = "#000000"
    grid[currentKey].type = "empty"
    grid[currentKey].objectId = "-1"

    grid[currentKey].pushX = 0
    grid[currentKey].pushY = 0

    grid[currentKey].produceLeft = false
    grid[currentKey].produceRight = false
    grid[currentKey].produceTop = false
    grid[currentKey].produceBottom = false

    grid[currentKey].destroyLeft = false
    grid[currentKey].destroyRight = false
    grid[currentKey].destroyTop = false
    grid[currentKey].destroyBottom = false
}

var forceLeft = (grid, objectList, key) => {
    key = grid[key].objectId
    Object.keys(objectList[key].collisionList.left).map((target) => {
        objectList[key].forceList.left[target].map((gkey) => {
            if (Object.keys(objectList[target].collisionList.left).length == 0) {
                objectList[target].forceX -= grid[gkey].pushX
            } else if (Object.keys(objectList[target].collisionList.bottom).length == 0) {
                objectList[target].forceY -= grid[gkey].pushY
            }
        })
    })

}

var forceRight = (grid, objectList, key) => {
    key = grid[key].objectId
    Object.keys(objectList[key].collisionList.right).map((target) => {
        objectList[key].forceList.right[target].map((gkey) => {
            if (Object.keys(objectList[target].collisionList.right).length == 0) {
                objectList[target].forceX += grid[gkey].pushX
            } else if (Object.keys(objectList[target].collisionList.top).length == 0) {
                objectList[target].forceY += grid[gkey].pushY
            }
        })
    })

}

var forceTop = (grid, objectList, key) => {
    key = grid[key].objectId
    Object.keys(objectList[key].collisionList.top).map((target) => {
        objectList[key].forceList.top[target].map((gkey) => {
            if (Object.keys(objectList[target].collisionList.top).length == 0) {
                objectList[target].forceY += grid[gkey].pushY
            } else if (Object.keys(objectList[target].collisionList.right).length == 0) {
                objectList[target].forceX += grid[gkey].pushX
            }
        })
    })

}

var forceBottom = (grid, objectList, key) => {
    key = grid[key].objectId
    Object.keys(objectList[key].collisionList.bottom).map((target) => {
        objectList[key].forceList.bottom[target].map((gkey) => {
            if (Object.keys(objectList[target].collisionList.bottom).length == 0) {
                objectList[target].forceY -= grid[gkey].pushY
            } else if (Object.keys(objectList[target].collisionList.left).length == 0) {
                objectList[target].forceX -= grid[gkey].pushX
            }
        })
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
    var produce = { "-1": "-1" }
    var destroy = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        newCellList.push(futureKey)
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        produce[futureKey] = {
            produceLeft: grid[cellKey].produceLeft,
            produceRight: grid[cellKey].produceRight,
            produceTop: grid[cellKey].produceTop,
            produceBottom: grid[cellKey].produceBottom,
        }
        destroy[futureKey] = {
            destroyLeft: grid[cellKey].destroyLeft,
            destroyRight: grid[cellKey].destroyRight,
            destroyTop: grid[cellKey].destroyTop,
            destroyBottom: grid[cellKey].destroyBottom,
        }
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey], produce[cellKey], destroy[cellKey])
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
    var produce = { "-1": "-1" }
    var destroy = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        produce[futureKey] = {
            produceLeft: grid[cellKey].produceLeft,
            produceRight: grid[cellKey].produceRight,
            produceTop: grid[cellKey].produceTop,
            produceBottom: grid[cellKey].produceBottom,
        }
        destroy[futureKey] = {
            destroyLeft: grid[cellKey].destroyLeft,
            destroyRight: grid[cellKey].destroyRight,
            destroyTop: grid[cellKey].destroyTop,
            destroyBottom: grid[cellKey].destroyBottom,
        }
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey], produce[cellKey], destroy[cellKey])
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
    var produce = { "-1": "-1" }
    var destroy = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber - computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        produce[futureKey] = {
            produceLeft: grid[cellKey].produceLeft,
            produceRight: grid[cellKey].produceRight,
            produceTop: grid[cellKey].produceTop,
            produceBottom: grid[cellKey].produceBottom,
        }
        destroy[futureKey] = {
            destroyLeft: grid[cellKey].destroyLeft,
            destroyRight: grid[cellKey].destroyRight,
            destroyTop: grid[cellKey].destroyTop,
            destroyBottom: grid[cellKey].destroyBottom,
        }
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey], produce[cellKey], destroy[cellKey])
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
    var produce = { "-1": "-1" }
    var destroy = { "-1": "-1" }

    objectList[objectId].cellList.map((cellKey) => {
        rowStart = computeCircularRow((Math.floor(parseInt(cellKey) / computeNumber)) * computeNumber + computeNumber)
        rowEnd = rowStart + computeNumber - 1
        column = rowStart + parseInt(cellKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
        pushX[futureKey] = grid[cellKey].pushX
        pushY[futureKey] = grid[cellKey].pushY
        color[futureKey] = grid[cellKey].color
        produce[futureKey] = {
            produceLeft: grid[cellKey].produceLeft,
            produceRight: grid[cellKey].produceRight,
            produceTop: grid[cellKey].produceTop,
            produceBottom: grid[cellKey].produceBottom,
        }
        destroy[futureKey] = {
            destroyLeft: grid[cellKey].destroyLeft,
            destroyRight: grid[cellKey].destroyRight,
            destroyTop: grid[cellKey].destroyTop,
            destroyBottom: grid[cellKey].destroyBottom,
        }
        newCellList.push(futureKey)
        removeCell(grid, cellKey)
    })

    objectList[objectId].cellList = newCellList

    objectList[objectId].cellList.map((cellKey) => {
        addCell(grid, objectId, cellKey, pushX[cellKey], pushY[cellKey], color[cellKey], produce[cellKey], destroy[cellKey])
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
        grid[upKey].type = "object"
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
        grid[upKey].type = "object"
        grid[upKey].pushX = 0;
        grid[upKey].pushY = 0;
        grid[upKey].objectId = grid[currentKey].objectId;
        var cell = document.getElementById(upKey)
        cell.style.backgroundColor = grid[upKey].color
        objectList[grid[currentKey].objectId].cellCount++
        objectList[grid[currentKey].objectId].cellList.push(upKey)
    }
}

var createObject = (grid, objectList, currentKey, parent) => {
    if (grid[currentKey].type == "empty") {
        objectList[currentKey] = getProperty(currentKey)
        grid[currentKey].color = "#ffffff";
        grid[currentKey].pushX = 0;
        grid[currentKey].pushY = 0;
        grid[currentKey].type = "object";
        grid[currentKey].objectId = currentKey;
        if (objectList[parent] != undefined) {
            objectList[currentKey].mass = objectList[parent].childObject.mass
            objectList[currentKey].velocityX = objectList[parent].childObject.velocityX
            objectList[currentKey].velocityY = objectList[parent].childObject.velocityY
            objectList[currentKey].forceX = objectList[parent].childObject.forceX
            objectList[currentKey].forceY = objectList[parent].childObject.forceY
            objectList[currentKey].opposingForce = objectList[parent].childObject.opposingForce
            objectList[currentKey].energyLoss = objectList[parent].childObject.energyLoss
            objectList[currentKey].cellCount = objectList[parent].childObject.cellCount
        }
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
        return true
    }
    return false
}

var getTopArea = (key) => {
    key = parseInt(key)
    var neighbours = []
    var senseArea = 4

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - (2 * senseArea + 1) * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        var subgrid = []
        for (let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            subgrid.push(computedKey)
        }
        neighbours.push(subgrid)
    }

    return neighbours
}

var getBottomArea = (key) => {
    key = parseInt(key)
    var neighbours = []
    var senseArea = 4

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) + computeNumber + 1, count1 = 2 * senseArea + 1; count1 > 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        var subgrid = []
        for (let cell = midpoint - senseArea, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            subgrid.push(computedKey)
        }
        neighbours.push(subgrid)
    }

    return neighbours
}

var getLeftArea = (key) => {
    key = parseInt(key)
    var neighbours = []
    var senseArea = 4

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        var subgrid = []
        for (let cell = midpoint - 2 * senseArea - 1, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            subgrid.push(computedKey)
        }
        neighbours.push(subgrid)
    }
    return neighbours
}

var getRightArea = (key) => {
    key = parseInt(key)
    var neighbours = []
    var senseArea = 4

    for (let currentRow = ((Math.floor(key / computeNumber)) * computeNumber) - senseArea * computeNumber, count1 = 2 * senseArea; count1 >= 0; count1--, currentRow += computeNumber) {
        var currentRowStart = computeCircularRow(currentRow)
        var currentRowEnd = computeCircularRow(currentRow) + computeNumber - 1
        var midpoint = currentRowStart + key % computeNumber
        var subgrid = []
        for (let cell = midpoint + 1, count2 = 2 * senseArea; count2 >= 0; count2--, cell += 1) {
            var computedKey = computeCircularColumn(cell, currentRowStart, currentRowEnd).toString()
            subgrid.push(computedKey)
        }
        neighbours.push(subgrid)
    }
    return neighbours
}

var createRightChild = (grid, objectList, currentKey) => {
    var objectId = grid[currentKey].objectId
    var childGrid = objectList[objectId].childObject.childGrid
    var childGridC = objectList[objectId].childObject.childGridC
    var childKey = -1
    var childI = 0
    var childJ = 0
    var flag = true
    var produce = {
        produceLeft: false,
        produceRight: false,
        produceTop: false,
        produceBottom: false,
    }
    var destroy = {
        destroyLeft: false,
        destroyRight: false,
        destroyTop: false,
        destroyBottom: false,
    }

    var neighbours = getRightArea(currentKey)
    neighbours.map((subgrid) => {
        subgrid.map((key) => {
            if (childGrid[childI][childJ] == 1 && grid[key].type != "empty") {
                flag = false
            }
            childJ++
        })
        childJ = 0
        childI++
    })

    if (flag == true) {
        childI = 0
        childJ = 0
        neighbours.map((subgrid) => {
            subgrid.map((key) => {
                if (childGrid[childI][childJ] == 1) {
                    if (childKey == -1) {
                        childKey = key
                        createObject(grid, objectList, childKey, objectId)
                        objectList[childKey].destroySelf = objectList[objectId].childObject.destroySelf
                    } else {
                        objectList[childKey].cellList.push(key)
                        addCell(grid, childKey, key, 0, 0, childGridC[childI][childJ], produce, destroy)
                    }
                }
                childJ++
            })
            childJ = 0
            childI++
        })
    }

    if (childKey != -1) {
        setBoundary(grid, objectList, childKey)
        objectList[childKey].boundaryList.right.map((gkey) => {
            grid[gkey].destroyRight = objectList[objectId].childObject.destroyRight
        })
        objectList[childKey].boundaryList.left.map((gkey) => {
            grid[gkey].destroyLeft = objectList[objectId].childObject.destroyLeft
        })
        objectList[childKey].boundaryList.top.map((gkey) => {
            grid[gkey].destroyTop = objectList[objectId].childObject.destroyTop
        })
        objectList[childKey].boundaryList.bottom.map((gkey) => {
            grid[gkey].destroyBottom = objectList[objectId].childObject.destroyBottom
        })
    }
}

var createLeftChild = (grid, objectList, currentKey) => {
    var objectId = grid[currentKey].objectId
    var childGrid = objectList[objectId].childObject.childGrid
    var childGridC = objectList[objectId].childObject.childGridC
    var childKey = -1
    var childI = 0
    var childJ = 0
    var flag = true
    var produce = {
        produceLeft: false,
        produceRight: false,
        produceTop: false,
        produceBottom: false,
    }
    var destroy = {
        destroyLeft: false,
        destroyRight: false,
        destroyTop: false,
        destroyBottom: false,
    }
    var neighbours = getLeftArea(currentKey)
    neighbours.map((subgrid) => {
        subgrid.map((key) => {
            if (childGrid[childI][childJ] == 1 && grid[key].type != "empty") {
                flag = false
            }
            childJ++
        })
        childJ = 0
        childI++
    })
    if (flag == true) {
        childI = 0
        childJ = 0
        neighbours.map((subgrid) => {
            subgrid.map((key) => {
                if (childGrid[childI][childJ] == 1) {
                    if (childKey == -1) {
                        childKey = key
                        createObject(grid, objectList, childKey, objectId)
                    } else {
                        objectList[childKey].cellList.push(key)
                        addCell(grid, childKey, key, 0, 0, childGridC[childI][childJ], produce, destroy)
                    }
                }
                childJ++
            })
            childJ = 0
            childI++
        })
    }
}

var createTopChild = (grid, objectList, currentKey) => {
    var objectId = grid[currentKey].objectId
    var childGrid = objectList[objectId].childObject.childGrid
    var childGridC = objectList[objectId].childObject.childGridC
    var childKey = -1
    var childI = 0
    var childJ = 0
    var flag = true
    var produce = {
        produceLeft: false,
        produceRight: false,
        produceTop: false,
        produceBottom: false,
    }
    var destroy = {
        destroyLeft: false,
        destroyRight: false,
        destroyTop: false,
        destroyBottom: false,
    }
    var neighbours = getTopArea(currentKey)
    neighbours.map((subgrid) => {
        subgrid.map((key) => {
            if (childGrid[childI][childJ] == 1 && grid[key].type != "empty") {
                flag = false
            }
            childJ++
        })
        childI++
        childJ = 0
    })
    if (flag == true) {
        childI = 0
        childJ = 0
        neighbours.map((subgrid) => {
            subgrid.map((key) => {
                if (childGrid[childI][childJ] == 1) {
                    if (childKey == -1) {
                        childKey = key
                        createObject(grid, objectList, childKey, objectId)
                    } else {
                        objectList[childKey].cellList.push(key)
                        addCell(grid, childKey, key, 0, 0, childGridC[childI][childJ], produce, destroy)
                    }
                }
                childJ++
            })
            childJ = 0
            childI++
        })
    }
}

var createBottomChild = (grid, objectList, currentKey) => {
    var objectId = grid[currentKey].objectId
    var childGrid = objectList[objectId].childObject.childGrid
    var childGridC = objectList[objectId].childObject.childGridC
    var childKey = -1
    var childI = 0
    var childJ = 0
    var flag = true
    var produce = {
        produceLeft: false,
        produceRight: false,
        produceTop: false,
        produceBottom: false,
    }
    var destroy = {
        destroyLeft: false,
        destroyRight: false,
        destroyTop: false,
        destroyBottom: false,
    }
    var neighbours = getBottomArea(currentKey)
    neighbours.map((subgrid) => {
        subgrid.map((key) => {
            if (childGrid[childI][childJ] == 1 && grid[key].type != "empty") {
                flag = false
            }
            childJ++
        })
        childI++
    })
    if (flag == true) {
        childI = 0
        childJ = 0
        neighbours.map((subgrid) => {
            subgrid.map((key) => {
                if (childGrid[childI][childJ] == 1) {
                    if (childKey == -1) {
                        childKey = key
                        createObject(grid, objectList, childKey, objectId)
                    } else {
                        objectList[childKey].cellList.push(key)
                        addCell(grid, childKey, key, 0, 0, childGridC[childI][childJ], produce, destroy)
                    }
                }
                childJ++
            })
            childJ = 0
            childI++
        })
    }
}


module.exports = {
    createObject: createObject,
    destroyObject: destroyObject,
    contractObject: contractObject,
    createRightChild: createRightChild,
    createBottomChild: createBottomChild,
    createLeftChild: createLeftChild,
    createTopChild: createTopChild,
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
    computeCircularRow: computeCircularRow,
    getNeighbourKV: getNeighbourKV
}