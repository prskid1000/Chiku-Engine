import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "./customHooks";
import { initGrid } from "./initGrid";
import { computeCircularColumn, contractObject, createObject, 
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
var simulationSpeed = 600
var worker = new Worker("worker/worker.js")

var num = []
for (let i = 0; i < computeNumber; i++) {
  num.push(i)
}

var grid = {}
var objectList = {}
for (let i = 0; i < computeNumber * computeNumber; i++) {
  grid[i.toString()] = {}
}

function App() {

  var { height, width } = useWindowDimensions();
  var idx = 0
  var runState = false
  var upload = useRef()
  var currentProperty = null
  var currentKey = 0
  var colorTarget = 0
  var currentObjectId = null
  var cellInfoPanel = useRef()
  var colorPanel = useRef()

  var appStyle = {
    height: Math.min(height * 0.99, width * 0.99),
    width: width * 0.99,
    margin: "2px",
  }

  var cellStyle = {
    backgroundColor: "black",
    height: Math.min(height * 0.99, width * 0.99) / computeNumber,
    width: Math.min(height * 0.99, width * 0.99) / computeNumber,
  }

  var infoPanelStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    color: "white",
    top: "0",
    left: "0",
    zIndex: "999999",
    fontSize: "16px",
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
    zIndex: "999999",
    fontSize: "16px",
    fontWeight: "bold"
  }

  var uploadStyle = {
    position: "absolute",
    backgroundColor: "transparent",
    top: "50%",
    left: width * 0.40,
    zIndex: "999999",
    fontSize: "12px",
    width: width * 0.20
  }

  var simulate = () => {
    processGrid(grid, objectList)
    processDOM(grid)
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
      case "velocity": {
        objectList[currentObjectId].velocityY += 1;
      } break
      case "move": {
        currentObjectId = moveUp(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
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
      case "velocity": {
        objectList[currentObjectId].velocityY -= 1;
      } break
      case "move": {
        currentObjectId = moveDown(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
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
      case "push": {
        if (grid[currentKey].objectId == "-1") return
        grid[currentKey].pushX = grid[currentKey].pushX - 1 >= 0 ? grid[currentKey].pushX - 1 : 0;
      } break
      case "velocity": {
        objectList[currentObjectId].velocityX -= 1;
      } break
      case "move": {
        currentObjectId = moveLeft(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
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
      case "velocity": {
        objectList[currentObjectId].velocityX += 1;
      } break
      case "move": {
        currentObjectId = moveRight(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
    }
  }

  var onColorChange = (event) => {
    if (grid[colorTarget].objectId != "-1") {
      grid[colorTarget].color = event.target.value
      processDOM(grid)
    }
    colorPanel.current.hidden = true
  }

  var onKeyDown = (event) => {
    switch (event.key) {
      case "1": {
        cellInfoPanel.current.hidden = true
        colorPanel.current.hidden = true
        if (runState == false) {
          runState = true
          simulate()
        } else {
          runState = false
        }
      } break
      case "2": {
        colorPanel.current.hidden = true
        cellInfoPanel.current.hidden = true
        runState = false
        sceneUpload()
      } break
      case "3": {
        colorPanel.current.hidden = true
        cellInfoPanel.current.hidden = true
        runState = false
        sceneDownload()
      } break
      case "4": {
        colorPanel.current.hidden = true
        runState = false
        createObject(grid, objectList, currentKey)
        processDOM(grid)
        currentObjectId = currentKey
      } break
      case "5": {
        colorPanel.current.hidden = true
        cellInfoPanel.current.hidden = true
        runState = false
        destroyObject(grid, objectList, currentKey)
        processDOM(grid)
        currentObjectId = "-1"
      } break
      case "6": {
        colorPanel.current.hidden = true
        runState = false
        var newObjectId = contractObject(grid, objectList, currentKey)
        processDOM(grid)
        if (currentKey == currentObjectId) currentObjectId = newObjectId
      } break
      case "7": {
        colorPanel.current.hidden = true
        if (currentProperty == null) {
          currentProperty = "move"
        }
      } break
      case "8": {
        colorPanel.current.hidden = true
        if (cellInfoPanel.current.hidden == true) {
          cellInfoPanel.current.hidden = false
        } else {
          cellInfoPanel.current.hidden = true
        }
      }break
      case "9": {
        if (colorPanel.current.hidden == true) {
          colorPanel.current.hidden = false
          colorPanel.current.value = grid[currentKey].color
          colorTarget = currentKey
        } else {
          colorPanel.current.hidden = true
        }
      } break
      case "d": {
        colorPanel.current.hidden = true
        if (currentProperty == null) {
          currentProperty = "density"
        }
      } break
      case "c": {
        colorPanel.current.hidden = true
        if (currentProperty == null) {
          currentProperty = "cell"
        }
      } break
      case "f": {
        colorPanel.current.hidden = true
        if (currentProperty == null) {
          currentProperty = "force"
        }
      } break
      case "v": {
        colorPanel.current.hidden = true
        if (currentProperty == null) {
          currentProperty = "velocity"
        }
      } break
      case "p": {
        colorPanel.current.hidden = true
        if (currentProperty == null) {
          currentProperty = "push"
        }
      } break
      case "ArrowUp": {
        colorPanel.current.hidden = true
        if (currentKey != null) {
          runState = false
          handleUp()
        }
      } break
      case "ArrowLeft": {
        colorPanel.current.hidden = true
        if (currentKey != null) {
          runState = false
          handleLeft()
        }
      } break
      case "ArrowRight": {
        colorPanel.current.hidden = true
        if (currentKey != null) {
          runState = false
          handleRight()
        }
      } break
      case "ArrowDown": {
        colorPanel.current.hidden = true
        if (currentKey != null) {
          runState = false
          handleDown()
        }
      } break
    }
  }

  var onKeyUp = (event) => {
    
    switch (event.key) {
      case "7": {
        currentProperty = null
        colorPanel.current.hidden = true
      } break
      case "d": {
        currentProperty = null
        colorPanel.current.hidden = true
      } break
      case "c": {
        currentProperty = null
        colorPanel.current.hidden = true
      } break
      case "f": {
        currentProperty = null
        colorPanel.current.hidden = true
      } break
      case "p": {
        currentProperty = null
        colorPanel.current.hidden = true
      } break
      case "v": {
        currentProperty = null
        colorPanel.current.hidden = true
      } break
    }
    if (objectList[currentObjectId] == undefined) return
    var str = "objectId: " + objectList[currentObjectId].objectId.toString() + " | "
    str += "mass: " + objectList[currentObjectId].mass.toString() + " | "
    str += "fx: " + objectList[currentObjectId].forceX.toString() + " | "
    str += "fy: " + objectList[currentObjectId].forceY.toString() + " | "
    str += "px: " + grid[currentKey].pushX.toString() + " | "
    str += "py: " + grid[currentKey].pushY.toString() + " | "
    str += "vx: " + objectList[currentObjectId].velocityX.toString() + " | "
    str += "vy: " + objectList[currentObjectId].velocityY.toString() + " | "
    cellInfoPanel.current.innerHTML = str
    //console.log(objectList[currentObjectId])
  }

  var onMouseEnterOrClick = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
    currentKey = event.target.id

    cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
    cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"
    colorPanel.current.style.top = (cell.offsetTop).toString() + "px"
    colorPanel.current.style.left = (cell.offsetLeft).toString() + "px"

    if (grid[event.target.id].objectId != undefined && grid[event.target.id].objectId != "-1") {
      currentObjectId = grid[event.target.id].objectId

      var str = "objectId: " + objectList[currentObjectId].objectId.toString() + " | "
      str += "mass: " + objectList[currentObjectId].mass.toString() + " | "
      str += "fx: " + objectList[currentObjectId].forceX.toString() + " | "
      str += "fy: " + objectList[currentObjectId].forceY.toString() + " | "
      str += "px: " + grid[event.target.id].pushX.toString() + " | "
      str += "py: " + grid[event.target.id].pushY.toString() + " | "
      str += "vx: " + objectList[currentObjectId].velocityX.toString() + " | "
      str += "vy: " + objectList[currentObjectId].velocityY.toString() + " | "
      cellInfoPanel.current.innerHTML = str
    }
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = grid[event.target.id].color
    colorPanel.current.hidden = true
  }

  useEffect(() => {
    upload.current.hidden = true
    cellInfoPanel.current.hidden = true
    colorPanel.current.hidden = true
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
      <div ref={upload} style={uploadStyle} className="custom-file">
        <input type="file" className="custom-file-input" id="uploadScene" onChange={onUpload}></input>
        <label className="custom-file-label" htmlFor="uploadScene">Upload Scene</label>
      </div>
      <div ref={cellInfoPanel} style={infoPanelStyle}>
      </div>
      <input type="color" ref={colorPanel} style={colorPanelStyle} className="form-control form-control-color" onChange={onColorChange}></input>
    </div>
  );
}

export default App;
