import { React, useState, useEffect} from "react";
import actions from '../../redux/actions';
import { useStore } from 'react-redux';
import './object.css';

function Object({x, y, r, m}) {

    /*
     - Direction is calculated in terms degrees in clockwise direction (0-360)
       using sin and cosine angles
     - Force and Velocity is consist of [Magnitude, Direction]
    */

    var [properties, setProperties] = useState({
        mass: 0,
        force: {
            magnitude: 0,
            direction: 0
        },
        velocity: {
            magnitude: 0,
            direction: 0
        },
        xCoordinate: 0,
        yCoordinate: 0,
        radius: 0,
        textureId: 0
    });


    useEffect(() => {
        properties.xCoordinate = x;
        properties.yCoordinate = y;
        properties.radius = r;
        properties.mass = m;
        setProperties(properties);
    }, [])

    return (
        <></>
    );
}
export default Object;
