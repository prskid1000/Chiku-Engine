module.exports = {
    initGrid: (grid) => {
        Object.keys(grid).map((key) => {
            grid[key].color = "#000000",
            grid[key].type = "empty",
            grid[key].pushX = 0,
            grid[key].pushY = 0,
            grid[key].produceLeft = false,
            grid[key].produceRight = false,
            grid[key].produceTop = false,
            grid[key].produceBottom = false,
            grid[key].destroyLeft = false,
            grid[key].destroyRight = false,
            grid[key].destroyTop = false,
            grid[key].destroyBottom = false,
            grid[key].objectId = "-1"
        })
    }
}