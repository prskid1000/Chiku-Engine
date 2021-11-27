module.exports = {
    setScene: (message) => {

        var grid = message.grid
        var objectList = message.objectList

        Object.keys(objectList).map((key) => {
            switch (grid[key].type) {
            }
        })

        return {
            "grid": grid,
            "objectList": objectList,
        }
    }
}