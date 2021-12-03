const { moveRight, moveLeft, moveUp, moveDown } = require("./object")

module.exports = {
    processGrid: (message) => {

        var grid = message.grid
        var objectList = message.objectList

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
                   key = moveRight(grid, objectList, key)
                }
                objectList[key].velocityX -= 1
            } else if (objectList[key].velocityX < 0) {
                for (let i = 0; i < Math.abs(objectList[key].velocityX); i++) {
                   key = moveLeft(grid, objectList, key)
                }
                objectList[key].velocityX += 1
            }

            if (objectList[key].velocityY > 0) {
                for (let i = 0; i < objectList[key].velocityY; i++) {
                   key = moveUp(grid, objectList, key)
                }
                objectList[key].velocityY -= 1
            } else if (objectList[key].velocityY < 0) {
                for (let i = 0; i < Math.abs(objectList[key].velocityY); i++) {
                   key = moveDown(grid, objectList, key)
                }
                objectList[key].velocityY += 1
            }

        })

        return {
            "grid": grid,
            "objectList": objectList,
        }
    }
}