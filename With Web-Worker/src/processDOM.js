module.exports = {
    processDOM: (grid) => {
        Object.keys(grid).map((key) => {
            var cell = document.getElementById(key)
            cell.style.backgroundColor = grid[key].color
        })
    }
}
