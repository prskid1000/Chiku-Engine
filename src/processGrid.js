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
    destroyObject,
    createLeftChild,
    createRightChild,
    createBottomChild,
    createTopChild, } = require("./object")


module.exports = {
    processGrid: (grid, objectList, currentObjectId) => {

        //Process Force, Velocity, and Movement
        Object.keys(objectList).map((key) => {
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
        })

        //Process Parent Boundary, and Object Creation & Deletion
        Object.keys(objectList).map((key) => {
            if (objectList[key] != undefined && objectList[key].child != true) {
                var isDestroyed = false

                objectList[key].boundaryList.left.map((target) => {
                    if (grid[target].produceLeft == true) {
                        createLeftChild(grid, objectList, target)
                    }
                    var neighbours = getNeighbourKV(target)
                    if (grid[target].destroyLeft == true && grid[neighbours.left].objectId != grid[target].objectId) {
                        isDestroyed = destroyObject(grid, objectList, neighbours.left)
                    }
                })

                objectList[key].boundaryList.right.map((target) => {
                    if (grid[target].produceRight == true) {
                        createRightChild(grid, objectList, target)
                    }
                    var neighbours = getNeighbourKV(target)
                    if (grid[target].destroyRight == true && grid[neighbours.right].objectId != grid[target].objectId) {
                        isDestroyed = destroyObject(grid, objectList, neighbours.right)
                    }
                })

                objectList[key].boundaryList.top.map((target) => {
                    if (grid[target].produceTop == true) {
                        createTopChild(grid, objectList, target)
                    }
                    var neighbours = getNeighbourKV(target)
                    if (grid[target].destroyTop == true && grid[neighbours.top].objectId != grid[target].objectId) {
                        isDestroyed = destroyObject(grid, objectList, neighbours.top)
                    }
                })

                objectList[key].boundaryList.bottom.map((target) => {
                    if (grid[target].produceBottom == true) {
                        createBottomChild(grid, objectList, target)
                    }
                    var neighbours = getNeighbourKV(target)
                    if (grid[target].destroyBottom == true && grid[neighbours.bottom].objectId != grid[target].objectId) {
                        isDestroyed = destroyObject(grid, objectList, neighbours.bottom)
                    }
                })

                if (isDestroyed == true && objectList[key].destroySelf == true) {
                    destroyObject(grid, objectList, key)
                }
            }
        })

        //Process Child Boundary, and Object Deletion
        Object.keys(objectList).map((key) => {
            if (objectList[key] != undefined && objectList[key].child == true) {
                setBoundary(grid, objectList, key)
                var isDestroyed = false

                if (objectList[key].destroyLeft == true) {
                    objectList[key].boundaryList.left.map((target) => {
                        var neighbours = getNeighbourKV(target)
                        if (grid[neighbours.left].objectId != grid[target].objectId) {
                            isDestroyed = destroyObject(grid, objectList, neighbours.left)
                        }
                    })

                }

                if (objectList[key].destroyRight == true) {
                    objectList[key].boundaryList.right.map((target) => {
                        var neighbours = getNeighbourKV(target)
                        if (grid[neighbours.right].objectId != grid[target].objectId) {
                            isDestroyed = destroyObject(grid, objectList, neighbours.right)
                        }
                    })
                }

                if (objectList[key].destroyTop == true) {
                    objectList[key].boundaryList.top.map((target) => {
                        var neighbours = getNeighbourKV(target)
                        if (grid[neighbours.top].objectId != grid[target].objectId) {
                            isDestroyed = destroyObject(grid, objectList, neighbours.top)
                        }
                    })
                }

                if (objectList[key].destroyBottom == true) {
                    objectList[key].boundaryList.bottom.map((target) => {
                        var neighbours = getNeighbourKV(target)
                        if (grid[neighbours.bottom].objectId != grid[target].objectId) {
                            isDestroyed = destroyObject(grid, objectList, neighbours.bottom)
                        }
                    })

                }

                if (isDestroyed == true && objectList[key].destroySelf == true) {
                    destroyObject(grid, objectList, key)
                }
            }
        })

        //Detect Collision
        Object.keys(objectList).map((key) => {
            setBoundary(grid, objectList, key)
            collisionLeft(grid, objectList, key)
            collisionTop(grid, objectList, key)
            collisionBottom(grid, objectList, key)
            collisionRight(grid, objectList, key)
        })

        //Apply Push Force
        Object.keys(objectList).map((key) => {
            if (objectList[key].child != true) {
                if (Object.keys(objectList[key].collisionList.left).length != 0) forceLeft(grid, objectList, key)
                if (Object.keys(objectList[key].collisionList.top).length != 0) forceTop(grid, objectList, key)
                if (Object.keys(objectList[key].collisionList.right).length != 0) forceRight(grid, objectList, key)
                if (Object.keys(objectList[key].collisionList.bottom).length != 0) forceBottom(grid, objectList, key)
            }
        })

        //Process Convervation of Linear Momentum
        Object.keys(objectList).map((key) => {

            Object.keys(objectList[key].collisionList.left).map((target) => {

                //console.log(target)

                var m = objectList[key].mass / objectList[target].mass
                var u1 = objectList[key].velocityX
                var u2 = objectList[target].velocityX

                var v1 = Math.abs(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var v2 = Math.abs((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                var s1 = Math.sign(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var s2 = Math.sign((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                s1 = Math.abs(s1) == 0 ? 0 : s1
                s2 = Math.abs(s2) == 0 ? 0 : s2

                if (v1 - Math.abs(u1) > 0) {
                    v1 = Math.round(v1)
                    v2 = Math.floor(v2)
                } else {
                    v2 = Math.round(v2)
                    v1 = Math.floor(v1)
                }

                objectList[key].velocityX = s1 * v1
                objectList[target].velocityX = s2 * v2

                //console.log(m, u1, u2, key, target, objectList[key].velocityX, objectList[target].velocityX)

                delete objectList[key].collisionList.left[target]
                delete objectList[target].collisionList.right[key]

            })

            Object.keys(objectList[key].collisionList.right).map((target) => {

                //console.log(target)

                var m = objectList[key].mass / objectList[target].mass

                var u1 = objectList[key].velocityX
                var u2 = objectList[target].velocityX

                var v1 = Math.abs(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var v2 = Math.abs((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                var s1 = Math.sign(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var s2 = Math.sign((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                s1 = Math.abs(s1) == 0 ? 0 : s1
                s2 = Math.abs(s2) == 0 ? 0 : s2

                console.log(u1, u2, v1, v2)

                if (v1 - Math.abs(u1) > 0) {
                    v1 = Math.round(v1)
                    v2 = Math.floor(v2)
                } else {
                    v2 = Math.round(v2)
                    v1 = Math.floor(v1)
                }

                objectList[key].velocityX = s1 * v1
                objectList[target].velocityX = s2 * v2

                delete objectList[key].collisionList.right[target]
                delete objectList[target].collisionList.left[key]
            })

            Object.keys(objectList[key].collisionList.top).map((target) => {

                //console.log(target)

                var m = objectList[key].mass / objectList[target].mass
                var u1 = objectList[key].velocityY
                var u2 = objectList[target].velocityY

                var v1 = Math.abs(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var v2 = Math.abs((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                var s1 = Math.sign(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var s2 = Math.sign((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                s1 = Math.abs(s1) == 0 ? 0 : s1
                s2 = Math.abs(s2) == 0 ? 0 : s2

                if (v1 - Math.abs(u1) > 0) {
                    v1 = Math.round(v1)
                    v2 = Math.floor(v2)
                } else {
                    v2 = Math.round(v2)
                    v1 = Math.floor(v1)
                }

                objectList[key].velocityY = s1 * v1
                objectList[target].velocityY = s2 * v2

                delete objectList[key].collisionList.top[target]
                delete objectList[target].collisionList.bottom[key]

            })

            Object.keys(objectList[key].collisionList.bottom).map((target) => {

                //console.log(target)

                var m = objectList[key].mass / objectList[target].mass
                var u1 = objectList[key].velocityY
                var u2 = objectList[target].velocityY

                var v1 = Math.abs(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var v2 = Math.abs((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                var s1 = Math.sign(((m - 1) * u1 + 2.0 * u2) / (m + 1))
                var s2 = Math.sign((2.0 * m * u1 + (1 - m) * u2) / (m + 1))

                s1 = Math.abs(s1) == 0 ? 0 : s1
                s2 = Math.abs(s2) == 0 ? 0 : s2

                if (v1 - Math.abs(u1) > 0) {
                    v1 = Math.round(v1)
                    v2 = Math.floor(v2)
                } else {
                    v2 = Math.round(v2)
                    v1 = Math.floor(v1)
                }

                objectList[key].velocityY = s1 * v1
                objectList[target].velocityY = s2 * v2

                delete objectList[key].collisionList.bottom[target]
                delete objectList[target].collisionList.top[key]

            })
        })

        //Process Scripts
        Object.keys(objectList).map((key) => {
            if (grid[key] != undefined && objectList[key] != undefined && objectList[grid[key].objectId] != undefined) {
                eval(objectList[key].script)(grid, objectList, key)
            }
        })

        return currentObjectId
    }
}