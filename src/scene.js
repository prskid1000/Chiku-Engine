var gridMap = {

}

var objectListMap = {

}

var getGrid = (sceneId) => {
    return gridMap[sceneId]
}

var getObjectList = (sceneId) => {
    return objectListMap[sceneId]
}

module.exports = {
    getGrid: getGrid,
    getObjectList: getObjectList
}