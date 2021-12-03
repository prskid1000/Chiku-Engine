import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "./customHooks";
import { initGrid } from "./initGrid";
import { computeCircularColumn, createObject, 
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
  var currentKey = null
  var currentObjectId = null
  var cellInfoPanel = useRef()
  var [cellInfo, setCellInfo] = useState()

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
    let: "0",
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
    console.log(objectList)
    worker.postMessage({
      "statement": processGrid.toString(),
      "args": {
        "grid": grid,
        "objectList": objectList,
      }
    })
    
    worker.onmessage = (message) => {
      grid = message.data.grid
      objectList = message.data.objectList  
      processDOM(grid)
      if (runState == true) {
        setTimeout(() => {
          worker.postMessage({
            "statement": processGrid.toString(),
            "args": {
              "grid": grid,
              "objectList": objectList,
            }
          })
        }, 60000 / simulationSpeed);
      }
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
      case "velocity": {
        objectList[currentObjectId].velocityY += 1;
      } break
      case "move": {
        currentObjectId = moveUp(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
    }
    //console.log(objectList[grid[currentKey].objectId])
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
      case "velocity": {
        objectList[currentObjectId].velocityY -= 1;
      } break
      case "move": {
        currentObjectId = moveDown(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
    }
    //console.log(objectList[grid[currentKey].objectId])
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
      case "velocity": {
        objectList[currentObjectId].velocityX -= 1;
      } break
      case "move": {
        currentObjectId = moveLeft(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
    }
    //console.log(objectList[grid[currentKey].objectId])
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
      case "velocity": {
        objectList[currentObjectId].velocityX += 1;
      } break
      case "move": {
        currentObjectId = moveRight(grid, objectList, currentObjectId)
        processDOM(grid)
      } break
    }
    //console.log(objectList[grid[currentKey].objectId])
  }

  var onKeyDown = (event) => {
    switch (event.key) {
      case "1": {
        if (runState == false) {
          runState = true
          simulate()
        } else {
          runState = false
        }
      } break
      case "2": {
        runState = false
        sceneUpload()
      } break
      case "3": {
        runState = false
        sceneDownload()
      } break
      case "4": {
        runState = false
        createObject(grid, objectList, currentKey)
        processDOM(grid)
        currentObjectId = currentKey
      } break
      case "5": {
        runState = false
        destroyObject(grid, objectList, currentKey)
        processDOM(grid)
        currentObjectId = "-1"
      } break
      case "6": {
        if (currentProperty == null) {
          currentProperty = "move"
        }
      } break
      case "7": {
        if (cellInfoPanel.current.hidden == true) {
          cellInfoPanel.current.hidden = false
        } else {
          cellInfoPanel.current.hidden = true
        }
      }break
      case "d": {
        if (currentProperty == null) {
          currentProperty = "density"
        }
      } break
      case "c": {
        if (currentProperty == null) {
          currentProperty = "cell"
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
      case "ArrowUp": {
        if (currentKey != null) {
          runState = false
          handleUp()
        }
      } break
      case "ArrowLeft": {
        if (currentKey != null) {
          runState = false
          handleLeft()
        }
      } break
      case "ArrowRight": {
        if (currentKey != null) {
          runState = false
          handleRight()
        }
      } break
      case "ArrowDown": {
        if (currentKey != null) {
          runState = false
          handleDown()
        }
      } break
    }
  }

  var onKeyUp = (event) => {
    
    switch (event.key) {
      case "6": {
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
      case "v": {
        currentProperty = null
      } break
      case "6": {
        currentProperty = null
      } break
    }
    if (objectList[currentObjectId] == undefined) return
    var str = "objectId: " + objectList[currentObjectId].objectId.toString() + " | "
    str += "mass: " + objectList[currentObjectId].mass.toString() + " | "
    str += "fx: " + objectList[currentObjectId].forceX.toString() + " | "
    str += "fy: " + objectList[currentObjectId].forceY.toString() + " | "
    str += "vx: " + objectList[currentObjectId].velocityX.toString() + " | "
    str += "vy: " + objectList[currentObjectId].velocityY.toString() + " | "
    cellInfoPanel.current.innerHTML = str
  }

  var onMouseEnterOrClick = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
    currentKey = event.target.id

    cellInfoPanel.current.style.top = (10 + cell.offsetTop).toString() + "px"
    cellInfoPanel.current.style.left = (10 + cell.offsetLeft).toString() + "px"

    if (grid[event.target.id].objectId != undefined && grid[event.target.id].objectId != "-1") {
      currentObjectId = grid[event.target.id].objectId

      var str = "objectId: " + objectList[currentObjectId].objectId.toString() + " | "
      str += "mass: " + objectList[currentObjectId].mass.toString() + " | "
      str += "fx: " + objectList[currentObjectId].forceX.toString() + " | "
      str += "fy: " + objectList[currentObjectId].forceY.toString() + " | "
      str += "vx: " + objectList[currentObjectId].velocityX.toString() + " | "
      str += "vy: " + objectList[currentObjectId].velocityY.toString() + " | "
      cellInfoPanel.current.innerHTML = str
    }
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = grid[event.target.id].color
  }

  useEffect(() => {

    upload.current.hidden = true
    cellInfoPanel.current.hidden = true

    worker.postMessage({
      "statement": initGrid.toString(),
      "args": {
        "grid": grid,
        "objectList": objectList,
      }
    })
    worker.onmessage = (message) => {
      grid = message.data.grid
      objectList = message.data.objectList
      processDOM(grid)
    }
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
    </div>
  );
}

export default App;
