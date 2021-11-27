module.exports = {
    processGrid: (message) => {

        var grid = message.grid
        var objectList = message.objectList
        var statistic = message.statistic

        Object.keys(objectList).map((key) => {
            switch (grid[key].type) {

                case "empty":
                   
                    break;

                case "live":
                  
                    break;

                default:
                    
                    break
            }
        })

        return {
            "grid": grid,
            "objectList": objectList,
            "statistic": statistic
        }
    }
}