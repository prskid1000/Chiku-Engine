import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "./customHooks";

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

  var onKeyDown = (event) => {
    switch(event.key) {
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
    console.log(grid[event.target.id].color)
    cell.style.backgroundColor = grid[event.target.id].color
  }

  useEffect(() => {

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
