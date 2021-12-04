module.exports = {
    processGrid: (message) => {

        var grid = message.grid
        var objectList = message.objectList

        //Process Movement
        Object.keys(objectList).map((key) => {

            if (objectList[key].forceX > 0) {
                objectList[key].velocityX = Math.floor(objectList[key].forceX / objectList[key].mass)
                objectList[key].forceX -= 1
            } else if (objectList[key].forceX  < 0) {
                objectList[key].velocityX = Math.floor(objectList[key].forceX / objectList[key].mass)
                objectList[key].forceX += 1
            }

            if (objectList[key].forceY > 0) {
                objectList[key].velocityY = Math.floor(objectList[key].forceY / objectList[key].mass)
                objectList[key].forceY -= 1
            } else if (objectList[key].forceY < 0) {
                objectList[key].velocityY = Math.floor(objectList[key].forceY / objectList[key].mass)
                objectList[key].forceY += 1
            }

            if (objectList[key].velocityX > 0) {
                for (let i = 0; i < objectList[key].velocityX; i++){
                    var tkey = moveRight(grid, objectList, key)
                    if(tkey == undefined) break
                    key = tkey
                }
                objectList[key].velocityX -= 1
            } else if (objectList[key].velocityX < 0) {
                for (let i = 0; i < Math.abs(objectList[key].velocityX); i++) {
                    var tkey = moveLeft(grid, objectList, key)
                    if (tkey == undefined) break
                    key = tkey
                }
                objectList[key].velocityX += 1
            }

            if (objectList[key].velocityY > 0) {
                for (let i = 0; i < objectList[key].velocityY; i++) {
                    var tkey = moveUp(grid, objectList, key)
                    if (tkey == undefined) break
                    key = tkey
                }
                objectList[key].velocityY -= 1
            } else if (objectList[key].velocityY < 0) {
                for (let i = 0; i < Math.abs(objectList[key].velocityY); i++) {
                    var tkey = moveDown(grid, objectList, key)
                    if (tkey == undefined) break
                    key = tkey
                }
                objectList[key].velocityY += 1
            }

        })

        //Detect Collision
        Object.keys(objectList).map((key) => {
            setBoundary(grid, objectList, key)
            collisionLeft(grid, objectList, key)
            collisionRight(grid, objectList, key)
            collisionTop(grid, objectList, key)
            collisionBottom(grid, objectList, key)
        })

        //Process Collision
        Object.keys(objectList).map((key) => {

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

        })

        return {
            "grid": grid,
            "objectList": objectList,
        }
    }
}