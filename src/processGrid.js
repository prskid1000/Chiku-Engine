const { forceLeft, 
    forceRight, 
    forceTop,
    moveDown,
    moveLeft,
    moveUp,
    moveRight,
    collisionLeft,
    collisionBottom,
    collisionRight,
    collisionTop,
    setBoundary,
    forceBottom,
    getNeighbourKV,
    createObject,
    destroyObject, } = require("./object")

    
module.exports = {
    processGrid: (grid, objectList, currentObjectId) => {

        //Process Scripts
        Object.keys(objectList).map((key) => {
            if (grid[key] != undefined && objectList[key] != undefined) {
                eval(objectList[key].script)(grid, objectList, key)
            }
        })

        //Process Force, Velocity, and Movement
        Object.keys(objectList).map((key) => {

            if (grid[key] != undefined && objectList[key] != undefined) { 
                if (objectList[key].forceX > 0) {
                    objectList[key].velocityX = Math.floor(objectList[key].forceX / objectList[key].mass)
                    objectList[key].forceX -= objectList[key].opposingForce
                } else if (objectList[key].forceX < 0) {
                    objectList[key].velocityX = Math.floor(objectList[key].forceX / objectList[key].mass)
                    objectList[key].forceX += objectList[key].opposingForce
                }

                if (objectList[key].forceY > 0) {
                    objectList[key].velocityY = Math.floor(objectList[key].forceY / objectList[key].mass)
                    objectList[key].forceY -= objectList[key].opposingForce
                } else if (objectList[key].forceY < 0) {
                    objectList[key].velocityY = Math.floor(objectList[key].forceY / objectList[key].mass)
                    objectList[key].forceY += objectList[key].opposingForce
                }

                if (objectList[key].velocityX > 0) {
                    for (let i = 0; i < objectList[key].velocityX; i++) {
                        var tkey = moveRight(grid, objectList, key)
                        if (tkey == undefined) break
                        if (key == currentObjectId) currentObjectId = tkey
                        key = tkey
                    }
                    objectList[key].velocityX -= objectList[key].energyLoss
                } else if (objectList[key].velocityX < 0) {
                    for (let i = 0; i < Math.abs(objectList[key].velocityX); i++) {
                        var tkey = moveLeft(grid, objectList, key)
                        if (tkey == undefined) break
                        if (key == currentObjectId) currentObjectId = tkey
                        key = tkey
                    }
                    objectList[key].velocityX += objectList[key].energyLoss
                }

                if (objectList[key].velocityY > 0) {
                    for (let i = 0; i < objectList[key].velocityY; i++) {
                        var tkey = moveUp(grid, objectList, key)
                        if (tkey == undefined) break
                        if (key == currentObjectId) currentObjectId = tkey
                        key = tkey
                    }
                    objectList[key].velocityY -= objectList[key].energyLoss
                } else if (objectList[key].velocityY < 0) {
                    for (let i = 0; i < Math.abs(objectList[key].velocityY); i++) {
                        var tkey = moveDown(grid, objectList, key)
                        if (tkey == undefined) break
                        if (key == currentObjectId) currentObjectId = tkey
                        key = tkey
                    }
                    objectList[key].velocityY += objectList[key].energyLoss
                }
            }

        })

        //Detect Collision and Boundary
        Object.keys(objectList).map((key) => {
            if (grid[key] != undefined && objectList[key] != undefined) { 
                setBoundary(grid, objectList, key)
                collisionLeft(grid, objectList, key)
                collisionTop(grid, objectList, key)
                collisionBottom(grid, objectList, key)
                collisionRight(grid, objectList, key)
            }
        })
        
        //Process Collision
        Object.keys(objectList).map((key) => {
            
            if (grid[key] != undefined && objectList[key] != undefined) {

                forceLeft(grid, objectList, key)
                forceTop(grid, objectList, key)
                forceRight(grid, objectList, key)
                forceBottom(grid, objectList, key)

                Object.keys(objectList[key].collisionList.left).map((target) => {

                    var m = objectList[key].mass / objectList[target].mass
                    var u1 = objectList[key].velocityX
                    var u2 = objectList[target].velocityX

                    objectList[key].velocityX = Math.floor(((m - 1) * u1 + 2 * u2) / (m + 1))
                    objectList[target].velocityX = Math.floor((2 * m * u1 + (1 - m) * u2) / (m + 1))

                    //console.log(u1, u2, key, target, objectList[key].velocityX, objectList[target].velocityX)

                    delete objectList[key].collisionList.left[target]
                    delete objectList[target].collisionList.right[key]

                })

                Object.keys(objectList[key].collisionList.right).map((target) => {

                    var m = objectList[key].mass / objectList[target].mass
                    var u1 = objectList[key].velocityX
                    var u2 = objectList[target].velocityX

                    objectList[key].velocityX = Math.floor(((m - 1) * u1 + 2 * u2) / (m + 1))
                    objectList[target].velocityX = Math.floor((2 * m * u1 + (1 - m) * u2) / (m + 1))

                    //console.log(u1, u2, key, target, objectList[key].velocityX, objectList[target].velocityX)

                    delete objectList[key].collisionList.right[target]
                    delete objectList[target].collisionList.left[key]
                })

                Object.keys(objectList[key].collisionList.top).map((target) => {

                    var m = objectList[key].mass / objectList[target].mass
                    var u1 = objectList[key].velocityY
                    var u2 = objectList[target].velocityY

                    objectList[key].velocityY = Math.floor(((m - 1) * u1 + 2 * u2) / (m + 1))
                    objectList[target].velocityY = Math.floor((2 * m * u1 + (1 - m) * u2) / (m + 1))

                    delete objectList[key].collisionList.top[target]
                    delete objectList[target].collisionList.bottom[key]

                })

                Object.keys(objectList[key].collisionList.bottom).map((target) => {

                    var m = objectList[key].mass / objectList[target].mass
                    var u1 = objectList[key].velocityY
                    var u2 = objectList[target].velocityY

                    objectList[key].velocityY = Math.floor(((m - 1) * u1 + 2 * u2) / (m + 1))
                    objectList[target].velocityY = Math.floor((2 * m * u1 + (1 - m) * u2) / (m + 1))

                    delete objectList[key].collisionList.bottom[target]
                    delete objectList[target].collisionList.top[key]

                })

            }
        })

        //Produce and Destroy
        Object.keys(objectList).map((key) => {
            if (grid[key] != undefined && objectList[key] != undefined) {
                for (let i = 0; i < objectList[key].cellList.length; i++) {
                    var target = objectList[key].cellList[i]
                    var neighbours = getNeighbourKV(target)

                    if (grid[target].produceLeft == true) {
                        createObject(grid, objectList, neighbours.left, key)
                    }
                    if (grid[target].produceTop == true) {
                        createObject(grid, objectList, neighbours.top, key)
                    }
                    if (grid[target].produceBottom == true) {
                        createObject(grid, objectList, neighbours.bottom, key)
                    }
                    if (grid[target].produceRight == true) {
                        createObject(grid, objectList, neighbours.right, key)
                    }

                    if (grid[target].destroyLeft == true && grid[neighbours.left].objectId != grid[target].objectId) {
                        destroyObject(grid, objectList, neighbours.left)
                    }
                    if (grid[target].destroyTop == true && grid[neighbours.top].objectId != grid[target].objectId) {
                        destroyObject(grid, objectList, neighbours.top)
                    }
                    if (grid[target].destroyBottom == true && grid[neighbours.bottom].objectId != grid[target].objectId) {
                        destroyObject(grid, objectList, neighbours.bottom)
                    }
                    if (grid[target].destroyRight == true && grid[neighbours.right].objectId != grid[target].objectId) {
                        destroyObject(grid, objectList, neighbours.right)
                    }
                }
            }
        })

        return currentObjectId
    }
}