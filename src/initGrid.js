module.exports = {
    initGrid: (message) => {

        var grid = message.grid
        var objectList = message.objectList

        Object.keys(grid).map((key) => {
            grid[key].color = "black",
            grid[key].type = "empty",
            grid[key].objectId = "-1"
        })

        return {
            "grid": grid,
            "objectList": objectList,
        }
    }
}