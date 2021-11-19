import { React, useState, useEffect} from "react";
import actions from '../../redux/actions';
import { useStore } from 'react-redux';
import './playground.css';
import { registerEngine } from "../../../engine/engine";

function Playground() {

    var store = useStore();

    var onMouseMove = (event) => {
        actions.setPointerCoordinates.payload = {
            pointerX: event.clientX,
            pointerY: event.clientY
        }
        store.dispatch(actions.setPointerCoordinates)
    }

    useEffect(() => {
        var boundingBox = document.getElementById("playground").getBoundingClientRect();
        actions.setPlaygroundCoordinates.payload = {
            left: boundingBox.left,
            right: boundingBox.right,
            top: boundingBox.top,
            bottom: boundingBox.bottom
        }
        store.dispatch(actions.setPlaygroundCoordinates)

        //Registers Simulation Engine
        registerEngine()
    }, []);

    return (
        <>
            <div id="playground" className="playground" onMouseMove={onMouseMove}></div>
        </>
    );
}
export default Playground;
