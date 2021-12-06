module.exports = {
    initGrid: (grid) => {
        Object.keys(grid).map((key) => {
            grid[key].color = "#000000",
            grid[key].type = "empty",
            grid[key].pushX = 0,
            grid[key].pushY = 0,
            grid[key].produceLeft = 0,
            grid[key].produceRight = 0,
            grid[key].produceTop = 0,
            grid[key].produceBottom = 0,
            grid[key].destroyLeft = 0,
            grid[key].destroyRight = 0,
            grid[key].destroyTop = 0,
            grid[key].destroyBottom = 0,
            grid[key].objectId = "-1"
        })
    }
}