import { useEffect } from "react";
import useWindowDimensions from "./customHooks";
import { setScene } from "./setScene";
import { processDOM } from "./processDOM";
import { processGrid } from "./processGrid";
import { getGrid, getObjectList } from "./scene";

var computeNumber = 128
var simulationSpeed = 6000
var worker = new Worker("worker/worker.js")

var num = []
for(let i = 0; i < computeNumber; i++) {
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
  var sceneId = 0
  var runState = false

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

  var simulate = () => {
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

  var changeScene = () => {

    worker.postMessage({
      "statement": setScene.toString(),
      "args": {
        "grid": getGrid(sceneId),
        "objectList": getObjectList(sceneId)
      }
    })

    worker.onmessage = (message) => {
      grid = message.data.grid
      objectList = message.data.objectList
      processDOM(grid)
    }
  }

  var onKeyDown = (event) => {
    switch(event.key) {
      case "1": {
        runState = true
        simulate()
      }break
      case "2": {
        runState = false
      }
      case "3": {
        sceneId++
        changeScene()
      } break
      case "4": {
        sceneId--
        changeScene()
      }
    }
  }

  var onMouseEnterOrClick = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = "red"
  }

  var onMouseLeave = (event) => {
    event.preventDefault()
    var cell = document.getElementById(event.target.id)
    cell.style.backgroundColor = grid[event.target.id].color
  }

  useEffect(() => {
    changeScene()
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
    </div>
  );
}

export default App;
