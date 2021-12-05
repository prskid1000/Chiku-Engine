module.exports = {
    initGrid: (grid) => {
        Object.keys(grid).map((key) => {
            grid[key].color = "#000000",
            grid[key].type = "empty",
            grid[key].pushX = 0,
            grid[key].pushY = 0,
            grid[key].objectId = "-1"
        })
    }
}