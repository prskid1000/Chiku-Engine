import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "./customHooks";
import { initGrid } from "./initGrid";
import { computeCircularColumn, computeCircularRow, contractObject, createObject, 
  destroyObject, 
  expandDown, 
  expandLeft,
  expandRight, 
  expandUp, 
  moveDown,
  moveLeft, 
  moveRight, 
  moveUp } from "./object";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";

var computeNumber = 128
var simulationSpeed = 6000

var num = []
for (let i = 0; i < computeNumber; i++) {
  num.push(i)
}

var grid = {}
var objectList = {}
for (let i = 0; i < computeNumber * computeNumber; i++) {
  grid[i.toString()] = {}
}

var childGrid = []
for(let i = 0; i < 9; i++) {
  var subGrid = []
  for(let j = 0; j < 9; j++) {
    subGrid.push({i, j})
  }
  childGrid.push(subGrid)
}

var childGridC = []
for (let i = 0; i < 9; i++) {
  var subGridC = []
  for (let j = 0; j < 9; j++) {
    subGridC.push("transparent")
  }
  childGridC.push(subGridC)
}

function App() {

  var { height, width } = useWindowDimensions();
  var idx = 0
  var cidx = 0
  var runState = false
  var upload = useRef()
  var currentProperty = null
  var currentKey = 0
  var colorTarget = 0
  var currentObjectId = undefined
  var cellInfoPanel = useRef()
  var colorPanel = useRef()
  var controlTable = useRef()
  var textPanel = useRef()
  var childPanel = useRef()
  var scriptData = ""
  var mode = "parent"
  var childI = 0
  var childJ = 0
  var targetI = 0
  var targetJ = 0

  var appStyle = {
    height: Math.min(height * 0.99, width * 0.99),
    width: width * 0.99,
    zIndex: "0",
    margin: "2px",
  }

  var cellStyle = {
    backgroundColor: "black",
    zIndex: "1",
    height: Math.min(height * 0.99, width * 0.99) / computeNumber,
    width: Math.min(height * 0.99, width * 0.99) / computeNumber,
  }

  var infoPanelStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    color: "white",
    top: "0",
    left: "0",
    zIndex: "7",
    fontSize: "14px",
    fontWeight: "bold"
  }

  var colorPanelStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    color: "white",
    padding: "0px",
    margin: "0px",
    top: "0",
    left: "0",
    height: Math.min(height * 0.99, width * 0.99) / computeNumber,
    width: Math.min(height * 0.99, width * 0.99) / computeNumber,
    zIndex: "9",
    fontSize: "14px",
    fontWeight: "bold"
  }

  var uploadStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: "50%",
    left: width * 0.40,
    zIndex: "3",
    fontSize: "14px",
    width: width * 0.20
  }

  var controlTableStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: "50px",
    left: width * 0.30,
    zIndex: "3",
    fontSize: "14px",
    width: width * 0.40,
  }

  var textAreaStyle = {
    position: "absolute",
    color: "white",
    backgroundColor: "transparent",
    top: "0px",
    fontSize: "14px",
    left: "0px",
    zIndex: "13",
    width: width * 0.30
  }

  var childGridStyle = {
    position: "absolute",
    color: "white",
    backgroundColor: "transparent",
    top: "0",
    left: "0",
    width: Math.min(height , width ) * 0.50,
    height: Math.min(height, width ) * 0.505,
    zIndex: "4",
    border: "solid",
    borderColor: "white"
  }

  var childCellStyle = {
    backgroundColor: "tranparent",
    zIndex: "5",
    height: Math.min(height * 0.99, width * 0.99) * 0.50 / 9,
    width: Math.min(height * 0.99, width * 0.99) * 0.50 / 9,
  }

  var simulate = () => {
    console.log(objectList)
    currentObjectId = processGrid(grid, objectList, currentObjectId)
    processDOM(grid)

    if (currentObjectId != undefined && objectList[currentObjectId] != undefined && currentObjectId != "-1" && mode == "parent") {
      var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
            <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[currentKey].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[currentKey].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
                 + grid[currentKey].produceLeft.toString() + ` \| `
                 + grid[currentKey].produceRight.toString() + ` \| `
                 + grid[currentKey].produceTop.toString() + ` \| `
                 + grid[currentKey].produceBottom.toString() + ` \| ` +
        `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
        + grid[currentKey].destroyLeft.toString() + ` \| `
        + grid[currentKey].destroyRight.toString() + ` \| `
        + grid[currentKey].destroyTop.toString() + ` \| `
        + grid[currentKey].destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

      cellInfoPanel.current.innerHTML = res
    }
    if (runState == true) {
      setTimeout(() => {
        simulate()
      }, 60000 / simulationSpeed);
    }
  }

  var onUpload = (event) => {

    var reader = new FileReader();
    reader.onload = function (e) {
      var obj = JSON.parse(reader.result)
      grid = obj.grid
      objectList = obj.objectList
      upload.current.hidden = true
      processDOM(grid)
    }
    reader.readAsText(event.target.files[0])
  }

  var sceneUpload = (event) => {
    if (upload.current.hidden == true) {
      upload.current.hidden = false
    } else {
      upload.current.hidden = true
    }
  }

  var sceneDownload = (event) => {

    var obj = {
      "grid": grid,
      "objectList": objectList
    }

    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str);

    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', "scene.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  var handleUpC = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].childObject.density += 1;
        objectList[currentObjectId].childObject.mass = objectList[currentObjectId].childObject.density * objectList[currentObjectId].childObject.cellCount
      } break
      case "force": {
        objectList[currentObjectId].childObject.forceY += 1;
      } break
      case "eloss": {
        objectList[currentObjectId].childObject.energyLoss += 1;
      } break
      case "oppforce": {
        objectList[currentObjectId].childObject.opposingForce += 1;
      } break
      case "velocity": {
        objectList[currentObjectId].childObject.velocityY += 1;
      } break
      case "destroy": {
        if (objectList[currentObjectId].childObject.destroyTop == false) {
          objectList[currentObjectId].childObject.destroyTop = true;
        } else {
          objectList[currentObjectId].childObject.destroyTop = false;
        }
      } break
      
      default: {
        var childKey = "CH" + childI.toString() + childJ.toString()
        var cell = document.getElementById(childKey)
        cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[childI][childJ]
        childI = (childI - 1) >= 0 ? (childI - 1) : 8
        childKey = "CH" + childI.toString() + childJ.toString()
        cell = document.getElementById(childKey)
        cell.style.backgroundColor = "red"

        var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `(Child)</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].childObject.mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
          + objectList[currentObjectId].childObject.destroyLeft.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyRight.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyTop.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].childObject.destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`
        cellInfoPanel.current.innerHTML = res
      }
    }
  }

  var handleDownC = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].childObject.density = objectList[currentObjectId].childObject.density - 1 >= 0 ? objectList[currentObjectId].childObject.density - 1 : 0;
        objectList[currentObjectId].childObject.mass = objectList[currentObjectId].childObject.density * objectList[currentObjectId].childObject.cellCount
      } break
      case "force": {
        objectList[currentObjectId].childObject.forceY -= 1;
      } break
      case "eloss": {
        objectList[currentObjectId].childObject.energyLoss = objectList[currentObjectId].childObject.energyLoss - 1 >= 0 ? objectList[currentObjectId].childObject.energyLoss - 1 : 0;
      } break
      case "oppforce": {
        objectList[currentObjectId].childObject.opposingForce = objectList[currentObjectId].childObject.opposingForce - 1 >= 0 ? objectList[currentObjectId].childObject.opposingForce - 1 : 0;
      } break
      case "velocity": {
        objectList[currentObjectId].childObject.velocityY -= 1;
      } break
      case "destroy": {
        if (objectList[currentObjectId].childObject.destroyBottom == false) {
          objectList[currentObjectId].childObject.destroyBottom = true;
        } else {
          objectList[currentObjectId].childObject.destroyBottom = false;
        }
      } break
      default: {
        var childKey = "CH" + childI.toString() + childJ.toString()
        var cell = document.getElementById(childKey)
        cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[childI][childJ]
        childI = (parseInt(childI) + 1) <= 8 ? (parseInt(childI) + 1) : 0
        childKey = "CH" + childI.toString() + childJ.toString()
        cell = document.getElementById(childKey)
        cell.style.backgroundColor = "red"

        var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `(Child)</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].childObject.mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
          + objectList[currentObjectId].childObject.destroyLeft.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyRight.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyTop.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].childObject.destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`
        cellInfoPanel.current.innerHTML = res
      }
    }
  }

  var handleLeftC = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].childObject.density = objectList[currentObjectId].childObject.density - 1 >= 0 ? objectList[currentObjectId].childObject.density - 1 : 0;
        objectList[currentObjectId].childObject.mass = objectList[currentObjectId].childObject.density * objectList[currentObjectId].childObject.cellCount
      } break
      case "force": {
        objectList[currentObjectId].childObject.forceX -= 1;
      } break
      case "eloss": {
        objectList[currentObjectId].childObject.energyLoss = objectList[currentObjectId].childObject.energyLoss - 1 >= 0 ? objectList[currentObjectId].childObject.energyLoss - 1 : 0;
      } break
      case "oppforce": {
        objectList[currentObjectId].childObject.opposingForce = objectList[currentObjectId].childObject.opposingForce - 1 >= 0 ? objectList[currentObjectId].childObject.opposingForce - 1 : 0;
      } break
      case "velocity": {
        objectList[currentObjectId].childObject.velocityX -= 1;
      } break
      case "destroy": {
        if (objectList[currentObjectId].childObject.destroyLeft == false) {
          objectList[currentObjectId].childObject.destroyLeft = true;
        } else {
          objectList[currentObjectId].childObject.destroyLeft = false;
        }
      } break
      default: {
        var childKey = "CH" + childI.toString() + childJ.toString()
        var cell = document.getElementById(childKey)
        cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[childI][childJ]
        childJ = (childJ - 1) >= 0 ? (childJ - 1) : 8
        childKey = "CH" + childI.toString() + childJ.toString()
        cell = document.getElementById(childKey)
        cell.style.backgroundColor = "red"

        var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `(Child)</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].childObject.mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
          + objectList[currentObjectId].childObject.destroyLeft.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyRight.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyTop.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].childObject.destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`
        cellInfoPanel.current.innerHTML = res
      }
    }
  }

  var handleRightC = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].childObject.density += 1;
        objectList[currentObjectId].childObject.mass = objectList[currentObjectId].childObject.density * objectList[currentObjectId].childObject.cellCount
      } break
      case "force": {
        objectList[currentObjectId].childObject.forceX += 1;
      } break
      case "velocity": {
        objectList[currentObjectId].childObject.velocityX += 1;
      } break
      case "eloss": {
        objectList[currentObjectId].childObject.energyLoss += 1;
      } break
      case "oppforce": {
        objectList[currentObjectId].childObject.opposingForce += 1;
      } break
      case "destroy": {
        if (objectList[currentObjectId].childObject.destroyRight == false) {
          objectList[currentObjectId].childObject.destroyRight = true;
        } else {
          objectList[currentObjectId].childObject.destroyRight = false;
        }
      } break
      default: {
        var childKey = "CH" + childI.toString() + childJ.toString()
        var cell = document.getElementById(childKey)
        cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[childI][childJ]
        childJ = (parseInt(childJ) + 1) <= 8 ? (parseInt(childJ) + 1) : 0
        childKey = "CH" + childI.toString() + childJ.toString()
        cell = document.getElementById(childKey)
        cell.style.backgroundColor = "red"

        var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `(Child)</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].childObject.mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
          + objectList[currentObjectId].childObject.destroyLeft.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyRight.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyTop.toString() + ` \| `
          + objectList[currentObjectId].childObject.destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].childObject.destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`
        cellInfoPanel.current.innerHTML = res
      }
    }
  }

  var handleUp = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].density += 1;
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "cell": {
        if (grid[currentKey].objectId == "-1") return
        expandUp(grid, objectList, currentKey)
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "force": {
        objectList[currentObjectId].forceY += 1;
      } break
      case "push": {
        if (grid[currentKey].objectId == "-1") return
        grid[currentKey].pushY += 1;
      } break
      case "produce": {
        if (grid[currentKey].produceTop == false) {
          grid[currentKey].produceTop = true;
        } else {
          grid[currentKey].produceTop = false;
        }
      } break
      case "destroy": {
        if (grid[currentKey].destroyTop == false) {
          grid[currentKey].destroyTop = true;
        } else {
          grid[currentKey].destroyTop = false;
        }
      } break
      case "eloss": {
        objectList[currentObjectId].energyLoss += 1;
      } break
      case "oppforce": {
        objectList[currentObjectId].opposingForce += 1;
      } break
      case "velocity": {
        objectList[currentObjectId].velocityY += 1;
      } break
      case "move": {
        currentObjectId = moveUp(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber - computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey
        colorPanel.current.hidden = true

        cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"
        colorPanel.current.style.top = (cell.offsetTop).toString() + "px"
        colorPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (grid[futureKey].objectId != undefined && grid[futureKey].objectId != "-1") {
          currentObjectId = grid[futureKey].objectId

          var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[futureKey].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[futureKey].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].produceLeft.toString() + ` \| `
            + grid[futureKey].produceRight.toString() + ` \| `
            + grid[futureKey].produceTop.toString() + ` \| `
            + grid[futureKey].produceBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].destroyLeft.toString() + ` \| `
            + grid[futureKey].destroyRight.toString() + ` \| `
            + grid[futureKey].destroyTop.toString() + ` \| `
            + grid[futureKey].destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

          cellInfoPanel.current.innerHTML = res
        }

      }
    }
  }

  var handleDown = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].density = objectList[currentObjectId].density - 1 >= 0 ? objectList[currentObjectId].density - 1 : 0;
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "cell": {
        if (grid[currentKey].objectId == "-1") return
        expandDown(grid, objectList, currentKey)
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "force": {
        objectList[currentObjectId].forceY -= 1;
      } break
      case "push": {
        if (grid[currentKey].objectId == "-1") return
        grid[currentKey].pushY = grid[currentKey].pushY - 1 >= 0 ? grid[currentKey].pushY - 1 : 0;
      } break
      case "produce": {
        if (grid[currentKey].produceBottom == false) {
          grid[currentKey].produceBottom = true;
        } else {
          grid[currentKey].produceBottom = false;
        }
      } break
      case "destroy": {
        if (grid[currentKey].destroyBottom == false) {
          grid[currentKey].destroyBottom = true;
        } else {
          grid[currentKey].destroyBottom = false;
        }
      } break
      case "eloss": {
        objectList[currentObjectId].energyLoss = objectList[currentObjectId].energyLoss - 1 >= 0 ? objectList[currentObjectId].energyLoss - 1 : 0 ;
      } break
      case "oppforce": {
        objectList[currentObjectId].opposingForce = objectList[currentObjectId].opposingForce - 1 >= 0 ? objectList[currentObjectId].opposingForce - 1 : 0;
      } break
      case "velocity": {
        objectList[currentObjectId].velocityY -= 1;
      } break
      case "move": {
        currentObjectId = moveDown(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber + computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey
        colorPanel.current.hidden = true

        cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"
        colorPanel.current.style.top = (cell.offsetTop).toString() + "px"
        colorPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (grid[futureKey].objectId != undefined && grid[futureKey].objectId != "-1") {
          currentObjectId = grid[futureKey].objectId

          var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[futureKey].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[futureKey].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].produceLeft.toString() + ` \| `
            + grid[futureKey].produceRight.toString() + ` \| `
            + grid[futureKey].produceTop.toString() + ` \| `
            + grid[futureKey].produceBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].destroyLeft.toString() + ` \| `
            + grid[futureKey].destroyRight.toString() + ` \| `
            + grid[futureKey].destroyTop.toString() + ` \| `
            + grid[futureKey].destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

          cellInfoPanel.current.innerHTML = res
        }
      }
    }
  }

  var handleLeft = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return

    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].density = objectList[currentObjectId].density - 1 >= 0 ? objectList[currentObjectId].density - 1 : 0;
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "cell": {
        if (grid[currentKey].objectId == "-1") return
        expandLeft(grid, objectList, currentKey)
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "force": {
        objectList[currentObjectId].forceX -= 1;
      } break
      case "eloss": {
        objectList[currentObjectId].energyLoss = objectList[currentObjectId].energyLoss - 1 >= 0 ? objectList[currentObjectId].energyLoss - 1 : 0;
      } break
      case "oppforce": {
        objectList[currentObjectId].opposingForce = objectList[currentObjectId].opposingForce - 1 >= 0 ? objectList[currentObjectId].opposingForce - 1 : 0;
      } break
      case "push": {
        if (grid[currentKey].objectId == "-1") return
        grid[currentKey].pushX = grid[currentKey].pushX - 1 >= 0 ? grid[currentKey].pushX - 1 : 0;
      } break
      case "produce": {
        if (grid[currentKey].produceLeft == false) {
          grid[currentKey].produceLeft = true;
        } else {
          grid[currentKey].produceLeft = false;
        }
      } break
      case "destroy": {
        if (grid[currentKey].destroyLeft == false) {
          grid[currentKey].destroyLeft = true;
        } else {
          grid[currentKey].destroyLeft = false;
        }
      } break
      case "velocity": {
        objectList[currentObjectId].velocityX -= 1;
      } break
      case "move": {
        currentObjectId = moveLeft(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber - 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()

        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey
        colorPanel.current.hidden = true

        cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"
        colorPanel.current.style.top = (cell.offsetTop).toString() + "px"
        colorPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (grid[futureKey].objectId != undefined && grid[futureKey].objectId != "-1") {
          currentObjectId = grid[futureKey].objectId

          var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[futureKey].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[futureKey].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].produceLeft.toString() + ` \| `
            + grid[futureKey].produceRight.toString() + ` \| `
            + grid[futureKey].produceTop.toString() + ` \| `
            + grid[futureKey].produceBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].destroyLeft.toString() + ` \| `
            + grid[futureKey].destroyRight.toString() + ` \| `
            + grid[futureKey].destroyTop.toString() + ` \| `
            + grid[futureKey].destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

          cellInfoPanel.current.innerHTML = res
        }
      }
    }
  }

  var handleRight = () => {
    if (currentKey == null || currentKey == undefined) return
    if (currentObjectId == undefined || currentObjectId == "-1" || objectList[currentObjectId] == undefined) return
    switch (currentProperty) {
      case "density": {
        objectList[currentObjectId].density += 1;
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "cell": {
        if (grid[currentKey].objectId == "-1") return
        expandRight(grid, objectList, currentKey)
        objectList[currentObjectId].mass = objectList[currentObjectId].density * objectList[currentObjectId].cellCount
      } break
      case "force": {
        objectList[currentObjectId].forceX += 1;
      } break
      case "push": {
        if (grid[currentKey].objectId == "-1") return
        grid[currentKey].pushX += 1;
      } break
      case "produce": {
        if (grid[currentKey].produceRight == false) {
          grid[currentKey].produceRight = true;
        } else {
          grid[currentKey].produceRight = false;
        }
      } break
      case "destroy": {
        if (grid[currentKey].destroyRight == false) {
          grid[currentKey].destroyRight = true;
        } else {
          grid[currentKey].destroyRight = false;
        }
      } break
      case "velocity": {
        objectList[currentObjectId].velocityX += 1;
      } break
      case "eloss": {
        objectList[currentObjectId].energyLoss += 1;
      } break
      case "oppforce": {
        objectList[currentObjectId].opposingForce += 1;
      } break
      case "move": {
        currentObjectId = moveRight(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
      default: {
        var rowStart = computeCircularRow((Math.floor(parseInt(currentKey) / computeNumber)) * computeNumber)
        var rowEnd = rowStart + computeNumber - 1
        var column = rowStart + parseInt(currentKey) % computeNumber + 1
        var futureKey = computeCircularColumn(column, rowStart, rowEnd).toString()
    
        var cell = document.getElementById(currentKey)
        cell.style.backgroundColor = grid[currentKey].color
        cell = document.getElementById(futureKey)
        cell.style.backgroundColor = "red"
        currentKey = futureKey
        colorPanel.current.hidden = true

        cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
        cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"
        colorPanel.current.style.top = (cell.offsetTop).toString() + "px"
        colorPanel.current.style.left = (cell.offsetLeft).toString() + "px"

        if (grid[futureKey].objectId != undefined && grid[futureKey].objectId != "-1") {
          currentObjectId = grid[futureKey].objectId

          var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[futureKey].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[futureKey].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].produceLeft.toString() + ` \| `
            + grid[futureKey].produceRight.toString() + ` \| `
            + grid[futureKey].produceTop.toString() + ` \| `
            + grid[futureKey].produceBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
            + grid[futureKey].destroyLeft.toString() + ` \| `
            + grid[futureKey].destroyRight.toString() + ` \| `
            + grid[futureKey].destroyTop.toString() + ` \| `
            + grid[futureKey].destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

          cellInfoPanel.current.innerHTML = res
        }
      }
    }
  }

  var onColorChange = (event) => {
    if(mode == "parent") {
      grid[colorTarget].color = event.target.value
      processDOM(grid)
    } else {
      if (objectList[currentObjectId].childObject.childGridC[targetI][targetJ] == "#000000") return
      objectList[currentObjectId].childObject.childGridC[targetI][targetJ] = event.target.value
      var childKey = "CH" + targetI.toString() + targetJ.toString()
      var cell = document.getElementById(childKey)
      cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[targetI][targetJ]
    }
    colorPanel.current.hidden = true
  }

  var onKeyDown = (event) => {
    switch (event.key) {
      case "0": {
        if (controlTable.current.hidden == true) {
          controlTable.current.hidden = false
        } else {
          controlTable.current.hidden = true
        } 
      } break
      case "1": {
        if(mode == "child") break
        colorPanel.current.hidden = true
        if (runState == false) {
          runState = true
          simulate()
        } else {
          runState = false
        }
      } break
      case "2": {
        if (mode == "child") break
        colorPanel.current.hidden = true
        cellInfoPanel.current.hidden = true
        runState = false
        sceneUpload()
      } break
      case "3": {
        if (mode == "child") break
        colorPanel.current.hidden = true
        cellInfoPanel.current.hidden = true
        runState = false
        sceneDownload()
      } break
      case "4": {
        if (mode == "child") break
        colorPanel.current.hidden = true
        runState = false
        createObject(grid, objectList, currentKey)
        processDOM(grid)
        currentObjectId = currentKey
      } break
      case "5": {
        if (mode == "child") break
        colorPanel.current.hidden = true
        cellInfoPanel.current.hidden = true
        runState = false
        destroyObject(grid, objectList, currentKey)
        processDOM(grid)
        currentObjectId = "-1"
      } break
      case "6": {
        if (mode == "child") break
        colorPanel.current.hidden = true
        runState = false
        var newObjectId = contractObject(grid, objectList, currentKey)
        processDOM(grid)
        if (currentKey == currentObjectId) currentObjectId = newObjectId
      } break
      case "7": {
        if (mode == "child") break
        if (currentProperty == null) {
          currentProperty = "move"
        }
      } break
      case "8": {
        if (cellInfoPanel.current.hidden == true) {
          cellInfoPanel.current.hidden = false
        } else {
          cellInfoPanel.current.hidden = true
        }
      }break
      case "9": {
        if (colorPanel.current.hidden == true) {
          if(mode == "parent") {
            if (currentObjectId == "-1" || currentObjectId == undefined) return
           colorPanel.current.hidden = false
           if(grid[currentKey].objectId != "-1") {
             colorPanel.current.style.height = (Math.min(height * 0.99, width * 0.99) / computeNumber).toString() + "px"
             colorPanel.current.style.width = (Math.min(height * 0.99, width * 0.99) / computeNumber).toString() + "px"
             colorPanel.current.value = grid[currentKey].color
             colorTarget = currentKey
           }
          } else {
            colorPanel.current.hidden = false
            colorPanel.current.style.height = (Math.min(height * 0.99, width * 0.99) * 0.50 / 9).toString() + "px"
            colorPanel.current.style.width = (Math.min(height * 0.99, width * 0.99) * 0.50 / 9).toString() + "px"
            colorPanel.current.value = objectList[currentObjectId].childObject.childGridC[childI][childJ]
            targetI = childI
            targetJ = childJ
          }
        } else {
          colorPanel.current.hidden = true
        }
      } break
      case "d": {
        if (currentProperty == null) {
          currentProperty = "density"
        }
      } break
      case "Tab": {
        if (textPanel.current.hidden == true && currentObjectId != undefined && currentObjectId != "-1") {
          textPanel.current.hidden = false
          scriptData = objectList[currentObjectId].script
          textPanel.current.value = scriptData
        } else {
          textPanel.current.hidden = true
        }
      } break
      case "s": {
        if (mode == "child") {
          mode = "parent" 
          alert("Switched to Parent Mode")
          childPanel.current.hidden = true
        } else {
          if (objectList[currentObjectId] != undefined && currentObjectId != "-1"){
            mode = "child"
            alert("Switched to Child Mode")
            childPanel.current.hidden = false
            childGrid.map((subgrid) => {
              subgrid.map((index) => {
                var childKey = "CH" + index.i.toString() + index.j.toString()
                cell = document.getElementById(childKey)
                cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[index.i][index.j]
              })
            })
          }
        }
      } break
      case "c": {
        if (mode == "child") {
          var val = objectList[currentObjectId].childObject.childGrid[childI][childJ]
          var childKey = "CH" + childI.toString() + childJ.toString()
          if(val == 0) {
            objectList[currentObjectId].childObject.childGrid[childI][childJ] = 1
            var cell = document.getElementById(childKey)
            cell.style.backgroundColor = "#ffffff"
            objectList[currentObjectId].childObject.childGridC[childI][childJ] = "#ffffff"
            objectList[currentObjectId].childObject.cellCount++
            objectList[currentObjectId].childObject.mass = objectList[currentObjectId].childObject.cellCount * objectList[currentObjectId].childObject.density
          } else {
            objectList[currentObjectId].childObject.childGrid[childI][childJ] = 0
            var cell = document.getElementById(childKey)
            cell.style.backgroundColor = "#000000"
            objectList[currentObjectId].childObject.childGridC[childI][childJ] = "#000000"
            objectList[currentObjectId].childObject.cellCount--
            objectList[currentObjectId].childObject.mass = objectList[currentObjectId].childObject.cellCount * objectList[currentObjectId].childObject.density
          }
        } else {
          if (currentProperty == null) {
            currentProperty = "cell"
          }
        }
      } break
      case "x": {
        if (mode == "child") break
        if (currentProperty == null) {
          currentProperty = "produce"
        }
      } break
      case "z": {
        if (currentProperty == null) {
          currentProperty = "destroy"
        }
      } break
      case "f": {
        if (currentProperty == null) {
          currentProperty = "force"
        }
      } break
      case "v": {
        if (currentProperty == null) {
          currentProperty = "velocity"
        }
      } break
      case "p": {
        if (mode == "child") break
        if (currentProperty == null) {
          currentProperty = "push"
        }
      } break
      case "n": {
        if (currentProperty == null) {
          currentProperty = "oppforce"
        }
      } break
       case "i": {
        if (currentObjectId == "-1" || currentObjectId == undefined) return
        if(mode == "parent") {
          if (objectList[currentObjectId].destroySelf == false) {
            objectList[currentObjectId].destroySelf = true
          } else {
            objectList[currentObjectId].destroySelf = false
          }
        } else {
          if (objectList[currentObjectId].childObject.destroySelf == false) {
            objectList[currentObjectId].childObject.destroySelf = true
          } else {
            objectList[currentObjectId].childObject.destroySelf = false
          }
        }
      } break
      case "m": {
        if (currentProperty == null) {
          currentProperty = "eloss"
        }
      } break
      case "ArrowUp": {
        if (currentKey != null) {
          runState = false
          if (mode == "parent") {
            handleUp()
          } else {
            handleUpC()
          }
        }
      } break
      case "ArrowLeft": {
        if (currentKey != null) {
          runState = false
          if (mode == "parent") {
            handleLeft()
          } else {
            handleLeftC()
          }
        }
      } break
      case "ArrowRight": {
        if (currentKey != null) {
          runState = false
          if (mode == "parent") {
            handleRight()
          } else {
            handleRightC()
          }
        }
      } break
      case "ArrowDown": {
        if (currentKey != null) {
          runState = false
          if (mode == "parent") {
            handleDown()
          } else {
            handleDownC()
          }
        }
      } break
    }
  }

  var onKeyUp = (event) => {
    switch (event.key) {
      case "7": {
        currentProperty = null
      } break
      case "d": {
        currentProperty = null
      } break
      case "c": {
        currentProperty = null
      } break
      case "f": {
        currentProperty = null
      } break
      case "p": {
        currentProperty = null
      } break
      case "v": {
        currentProperty = null
      } break
      case "x": {
        currentProperty = null
      } break
      case "z": {
        currentProperty = null
      } break
      case "n": {
        currentProperty = null
      } break
      case "m": {
        currentProperty = null
      } break
    }

    if (objectList[currentObjectId] == undefined) return
    if(mode == "parent") {
      var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[currentKey].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[currentKey].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
        + grid[currentKey].produceLeft.toString() + ` \| `
        + grid[currentKey].produceRight.toString() + ` \| `
        + grid[currentKey].produceTop.toString() + ` \| `
        + grid[currentKey].produceBottom.toString() + ` \| ` +
        `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
        + grid[currentKey].destroyLeft.toString() + ` \| `
        + grid[currentKey].destroyRight.toString() + ` \| `
        + grid[currentKey].destroyTop.toString() + ` \| `
        + grid[currentKey].destroyBottom.toString() + ` \| ` +
        `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

      cellInfoPanel.current.innerHTML = res
    } else {
      var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `(Child)</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].childObject.mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.opposingForce.toString() + `</td>
          </tr>
            <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
        + objectList[currentObjectId].childObject.destroyLeft.toString() + ` \| `
        + objectList[currentObjectId].childObject.destroyRight.toString() + ` \| `
        + objectList[currentObjectId].childObject.destroyTop.toString() + ` \| `
        + objectList[currentObjectId].childObject.destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].childObject.destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`
      cellInfoPanel.current.innerHTML = res
    }
  }

  var onMouseEnterOrClick = (event) => {
    if(mode != "child") {
      event.preventDefault()
      var cell = document.getElementById(event.target.id)
      cell.style.backgroundColor = "red"
      currentKey = event.target.id
      colorPanel.current.hidden = true

      cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
      cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"
      textPanel.current.style.top = (cell.offsetTop).toString() + "px"
      textPanel.current.style.left = (cell.offsetLeft).toString() + "px"
      colorPanel.current.style.top = (cell.offsetTop).toString() + "px"
      colorPanel.current.style.left = (cell.offsetLeft).toString() + "px"
      childPanel.current.style.top = (cell.offsetTop).toString() + "px"
      childPanel.current.style.left = (cell.offsetLeft).toString() + "px"

      if (grid[currentKey].objectId != undefined && grid[currentKey].objectId != "-1" && mode == "parent") {
        currentObjectId = grid[currentKey].objectId

        var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(x-axis)(y-axis[L-Down \| R-Up])</td>
            <td>`+ grid[event.target.id].pushX.toString() + `</td>
          </tr>
           <tr>
            <td>Push Force(y-axis)(x-axis[T-Right \| B-Left])</td>
            <td>`+ grid[event.target.id].pushY.toString() + `</td>
          </tr>
           <tr>
            <td>Create Object[L \| R \| T \| B]</td>
            <td>`
          + grid[event.target.id].produceLeft.toString() + ` \| `
          + grid[event.target.id].produceRight.toString() + ` \| `
          + grid[event.target.id].produceTop.toString() + ` \| `
          + grid[event.target.id].produceBottom.toString() + ` \| ` +
          `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
          + grid[currentKey].destroyLeft.toString() + ` \| `
          + grid[currentKey].destroyRight.toString() + ` \| `
          + grid[currentKey].destroyTop.toString() + ` \| `
          + grid[currentKey].destroyBottom.toString() + ` \| ` +
          `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`

        cellInfoPanel.current.innerHTML = res
      }
    }
  }

  var onMouseEnterOrClickChild = (event) => {
    if(mode == "child") {
      event.preventDefault()
      var cell = document.getElementById(event.target.id)
      cell.style.backgroundColor = "red"
      colorPanel.current.hidden = true

      childI = event.target.dataset.i
      childJ = event.target.dataset.j

      colorPanel.current.style.top = (childPanel.current.offsetTop +  cell.offsetTop).toString() + "px"
      colorPanel.current.style.left = (childPanel.current.offsetLeft + cell.offsetLeft).toString() + "px"
      colorPanel.current.value = objectList[currentObjectId].childObject.childGridC[childI][childJ]

      cellInfoPanel.current.style.top = (childPanel.current.offsetTop + cell.offsetTop + Math.min(height * 0.99, width * 0.99) * 0.50 / 9).toString() + "px"
      cellInfoPanel.current.style.left = (childPanel.current.offsetLeft + cell.offsetLeft + Math.min(height * 0.99, width * 0.99) * 0.50 / 9).toString() + "px"

      textPanel.current.style.top = (childPanel.current.offsetTop + cell.offsetTop + Math.min(height * 0.99, width * 0.99) * 0.50 / 9).toString() + "px"
      textPanel.current.style.left = (childPanel.current.offsetLeft + cell.offsetLeft + Math.min(height * 0.99, width * 0.99) * 0.50 / 9).toString() + "px"

      var res = `
      <table onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Parameters</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
         <tbody className="table-light">
          <tr>
            <td>ObjectId</td>
            <td>`+ currentObjectId + `(Child)</td>
          </tr>
          <tr>
            <td>Mass(Cell Count X Density)</td>
            <td>`+ objectList[currentObjectId].childObject.mass.toString() + `</td>
          </tr>
           <tr>
            <td>Force(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceX.toString() + `</td>
          </tr>
           <tr>
            <td>Force(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.forceY.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(x-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityX.toString() + `</td>
          </tr>
           <tr>
            <td>Velocity(y-axis)</td>
            <td>`+ objectList[currentObjectId].childObject.velocityY.toString() + `</td>
          </tr>
           <tr>
            <td>Energy Loss/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.energyLoss.toString() + `</td>
          </tr>
          <tr>
            <td>Opposing Force/Cycle</td>
            <td>`+ objectList[currentObjectId].childObject.opposingForce.toString() + `</td>
          </tr>
           <tr>
            <td>Destory Object[L \| R \| T \| B]</td>
            <td>`
        + objectList[currentObjectId].childObject.destroyLeft.toString() + ` \| `
        + objectList[currentObjectId].childObject.destroyRight.toString() + ` \| `
        + objectList[currentObjectId].childObject.destroyTop.toString() + ` \| `
        + objectList[currentObjectId].childObject.destroyBottom.toString() + ` \| ` +
            `</td>
          </tr>
           <tr>
            <td>Self Destroy</td>
            <td>`+ objectList[currentObjectId].childObject.destroySelf.toString() + `</td>
          </tr>
            </tbody>
      </table>`
      cellInfoPanel.current.innerHTML = res
      //console.log(objectList[currentObjectId].childObject.childGrid[childI][childJ])
    }
  }

  var onMouseLeaveChild = (event) => {
    if(mode == "child") {
      event.preventDefault()
      var cell = document.getElementById(event.target.id)
      cell.style.backgroundColor = objectList[currentObjectId].childObject.childGridC[event.target.dataset.i][event.target.dataset.j]
    }
  }

  var onMouseLeave = (event) => {
   if(mode != "child") {
     event.preventDefault()
     var cell = document.getElementById(event.target.id)
     cell.style.backgroundColor = grid[event.target.id].color
   }
  }

  var onTextChange = (event) => {
    scriptData = event.target.value
  }

  var handleTab = (event) => {
    if(event.key == "Tab") {
      textPanel.current.hidden = true
      if(mode == "parent") {
        objectList[currentObjectId].script = scriptData
      } else {
        objectList[currentObjectId].childObject.script = scriptData
      }
    }
  }

  useEffect(() => {
    textPanel.current.hidden = true
    upload.current.hidden = true
    cellInfoPanel.current.hidden = true
    colorPanel.current.hidden = true
    controlTable.current.hidden = true
    childPanel.current.hidden = true
    alert("Press O to view Keyboard Controls")
    initGrid(grid)
    processDOM(grid)
  }, [])

  return (
    <div>
      <div style={appStyle}>
        {num.map((i) => (
          <div key={i} className="d-flex justify-content-center">
            {num.map((j) => (
              <div
                tabIndex={0}
                onMouseEnter={onMouseEnterOrClick}
                onMouseLeave={onMouseLeave}
                onTouchStart={onMouseEnterOrClick}
                onTouchEnd={onMouseLeave}
                onClick={onMouseEnterOrClick}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                tabIndex={-1}
                id={idx}
                key={idx++}
                data-bitprop={""}
                style={cellStyle}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div tabIndex={0} ref={upload} style={uploadStyle} className="custom-file">
        <input type="file" className="custom-file-input" id="uploadScene" onChange={onUpload}></input>
        <label className="custom-file-label" htmlFor="uploadScene">Upload Scene</label>
      </div>
      <div tabIndex={0} ref={cellInfoPanel} style={infoPanelStyle}>
      </div>
      <input tabIndex={0} type="color" ref={colorPanel} style={colorPanelStyle} className="form-control form-control-color" onChange={onColorChange}></input>
      <table tabIndex={0} onKeyDown={onKeyDown} ref={controlTable} style={controlTableStyle} className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Engine Controls</th>
            <th scope="col">Keyboard Combination</th>
          </tr>
        </thead>
        <tbody className="table-light">
          <tr>
            <td>Help</td>
            <td>0(Toggle)</td>
          </tr>
          <tr>
            <td>Start/Stop Simulator </td>
            <td>1(Toggle)</td>
          </tr>
          <tr>
            <td>Upload Scene </td>
            <td>2</td>
          </tr>
          <tr>
            <td>Download Scene </td>
            <td>3</td>
          </tr>
          <tr>
            <td>Create Object at Current Cell </td>
            <td>4</td>
          </tr>
          <tr>
            <td>Delete Object at Current Cell </td>
            <td>5</td>
          </tr>
          <tr>
            <td>Delete Current Cell of Object </td>
            <td>6</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>View/Hide Object Info of Current(Last Selected) Object </td>
            <td>8</td>
          </tr>
          <tr>
            <td>Change Current Cell Color of a Object  </td>
            <td>9</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Move Object Upward </td>
            <td>7(Hold) + ArrowUp</td>
          </tr>
          <tr>
            <td>Move Object Downward </td>
            <td>7(Hold) + ArrowDown</td>
          </tr>
          <tr>
            <td>Move Object Leftward </td>
            <td>7(Hold) + ArrowLeft</td>
          </tr>
          <tr>
            <td>Move Object Rightward </td>
            <td>7(Hold) + ArrowRight</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Expand Object Upward of Current Cell</td>
            <td>C(Hold) + ArrowUp</td>
          </tr>
          <tr>
            <td>Expand Object Downward of Current Cell</td>
            <td>C(Hold) + ArrowDown</td>
          </tr>
          <tr>
            <td>Expand Object Leftward of Current Cell </td>
            <td>C(Hold) + ArrowLeft</td>
          </tr>
          <tr>
            <td>Expand Object Rightward of Current Cell </td>
            <td>C(Hold) + ArrowRight</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Increase Density by 1(Mass = Density X Cell Count) </td>
            <td>D(Hold) + ArrowUp or D(Hold) + ArrowRight</td>
          </tr>
          <tr>
            <td>Decrease Density by 1(Mass = Density X Cell Count) </td>
            <td>D(Hold) + ArrowDown or D(Hold) + ArrowLeft</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Increase Force by 1 in direction of +ve axes</td>
            <td>F(Hold) + ArrowUp(y-axis) or F(Hold) + ArrowRight(x-axis)</td>
          </tr>
          <tr>
            <td>Increase Force by 1 in direction of -ve axes </td>
            <td>F(Hold) + ArrowDown(y-axis) or F(Hold) + ArrowLeft(x-axis)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Increase Velocity by 1 in direction of +ve axes</td>
            <td>V(Hold) + ArrowUp(y-axis) or V(Hold) + ArrowRight(x-axis)</td>
          </tr>
          <tr>
            <td>Increase Velocity by 1 in direction of -ve axes </td>
            <td>V(Hold) + ArrowDown(y-axis) or V(Hold) + ArrowLeft(x-axis)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Increase Push Force by 1 in direction of +ve axes of Current Cell</td>
            <td>P(Hold) + ArrowUp(y-axis) or P(Hold) + ArrowRight(x-axis)</td>
          </tr>
          <tr>
            <td>Increase Push Force by 1 in direction of -ve axes of Current Cell</td>
            <td>P(Hold) + ArrowDown(y-axis) or P(Hold) + ArrowLeft(x-axis)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Increase Opposing Force/Cycle by 1 in direction of +ve axes</td>
            <td>N(Hold) + ArrowUp(y-axis) or N(Hold) + ArrowRight(x-axis)</td>
          </tr>
          <tr>
            <td>Increase Opposing Force/Cycle by 1 in direction of -ve axes </td>
            <td>N(Hold) + ArrowDown(y-axis) or N(Hold) + ArrowLeft(x-axis)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Increase Kinetic Energy Loss/Cycle by 1 in direction of +ve axes</td>
            <td>M(Hold) + ArrowUp(y-axis) or M(Hold) + ArrowRight(x-axis)</td>
          </tr>
          <tr>
            <td>Increase Kinetic Energy Loss/Cycle by 1 in direction of -ve axes </td>
            <td>M(Hold) + ArrowDown(y-axis) or M(Hold) + ArrowLeft(x-axis)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Move Cursor(Red) Upward </td>
            <td>7(Hold) + ArrowUp</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Downward </td>
            <td>7(Hold) + ArrowDown</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Leftward </td>
            <td>7(Hold) + ArrowLeft</td>
          </tr>
          <tr>
            <td>Move Cursor(Red) Rightward </td>
            <td>7(Hold) + ArrowRight</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Upward Produce Ability of Current Cell </td>
            <td>X(Hold) + ArrowUp(Toggle)</td>
          </tr>
          <tr>
            <td>Downward Produce Ability of Current Cell </td>
            <td>X(Hold) + ArrowDown(Toggle)</td>
          </tr>
          <tr>
            <td>Leftward Produce Ability of Current Cell </td>
            <td>X(Hold) + ArrowLeft(Toggle)</td>
          </tr>
          <tr>
            <td>Rightward Produce Ability of Current Cell </td>
            <td>X(Hold) + ArrowRight(Toggle)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Upward Destroy  Ability of Current Cell </td>
            <td>Z(Hold) + ArrowUp(Toggle)</td>
          </tr>
          <tr>
            <td>Downward Destroy Ability of Current Cell </td>
            <td>Z(Hold) + ArrowDown(Toggle)</td>
          </tr>
          <tr>
            <td>Leftward Destroy Ability of Current Cell </td>
            <td>Z(Hold) + ArrowLeft(Toggle)</td>
          </tr>
          <tr>
            <td>Rightward Destroy Ability of Current Cell </td>
            <td>Z(Hold) + ArrowRight(Toggle)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Edit Object Script </td>
            <td>Tab</td>
          </tr>
          <tr>
            <td>Self Destroy </td>
            <td>i(Toggle)</td>
          </tr>
          <tr><td><hr></hr></td><td><hr></hr></td></tr>
          <tr>
            <td>Parent-Child Mode Switch </td>
            <td>S(Toggle)</td>
          </tr>
          <tr>
            <td>Mark/Unmark Child Cell(In Child Mode) </td>
            <td>C(Toggle)</td>
          </tr>
        </tbody>
      </table>
      <textarea tabIndex={0} onKeyDown={handleTab} ref={textPanel} rows="20" style={textAreaStyle} onChange={onTextChange}></textarea>
      <div ref={childPanel} style={childGridStyle}>
        {childGrid.map((subGrid) => (
          <div key={cidx++} className="d-flex justify-content-center">{subGrid.map((index) => (
            <div 
              tabIndex={0}
              id={"CH"+index.i.toString() + index.j.toString()}
              key={"CH" + index.i.toString() + index.j.toString()}
              data-i={index.i.toString()}
              data-j={index.j.toString()}
              style={childCellStyle}
              onMouseEnter={onMouseEnterOrClickChild}
              onMouseLeave={onMouseLeaveChild}
              onTouchStart={onMouseEnterOrClickChild}
              onTouchEnd={onMouseLeaveChild}
              onClick={onMouseEnterOrClickChild}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
            ></div>
          ))}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
