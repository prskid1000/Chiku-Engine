import { React, useState, useEffect } from "react";
import actions from '../../redux/actions';
import { useStore } from 'react-redux';
import './inspector.css';

var scalerProperty = (name, property) => {

    var magnitude = 0;

    var magnitudeHandler = (event) => {
        magnitude = event.target.value
    }

    var handler = (event) => {
        
    }

    return <>
        <div className="ml-3 mt-3 col-12 row">
            <label className="label_text text-light">{name}</label>
            <input className="form-control col-10 col-md-6" name={name} onChange={magnitudeHandler} type="text"></input>
            <button className="btn btn-dark" onClick={handler}><i className="fas fa-save"></i></button>
        </div>
    </>
}

var vectorProperty = (name, property) => {

    var magnitude = 0;
    var direction = 0;

    var magnitudeHandler = (event) => {
        magnitude = event.target.value
    }

    var directionHandler = (event) => {
        direction = event.target.value
    }

    var addHandler = (event) => {

    }

    var removeHandler = (event) => {

    }

    return <>
        <div className="ml-3 mt-3 col-12">
            <label className="label_text text-light">{name}</label>
            <div className="col-12 row">
                <input  placeholder="Magnitude" className="form-control text-hint mt-1 col-12 col-md-6" name={name} onChange={magnitudeHandler} type="text"></input>
                <input placeholder="Direction" className="form-control mt-1 col-12 col-md-6" name={name} onChange={directionHandler} type="text"></input>
            </div>
            <div className="col-10 col-8 row mt-1">
                <button className="btn col-5 col-md-4 btn-dark mr-1" onClick={addHandler}>Add</button>
                <button className="btn col-5 col-md-4 btn-dark " onClick={removeHandler}>Remove</button>
            </div>
        </div>
    </>
}

var readOnlyVectorProperty = (name, property) => {

    var magnitude = 0;
    var direction = 0;

    return <>
        <div className="ml-3 mt-3 col-12">
            <label className="label_text text-light">{name}</label>
            <div className="col-12 row">
                <input disabled className="form-control text-hint mt-1 col-12 col-md-6" value={magnitude} type="text"></input>
                <input disabled className="form-control mt-1 col-12 col-md-6" value={direction} type="text"></input>
            </div>
        </div>
    </>
}

var objectCreator = () => {

    var objectType = "Universal Object";

    var selectHandler = (event) => {
        objectType = event.target.value;
    }

    var buttonHandler = (event) => {
       
    }

    return <>
        <div className="ml-3 mt-3 col-12 row">
            <label className="label_text text-light">Object Type</label>
            <select name="groupselect" className="form-control form-select col-10 col-md-6" onChange={selectHandler} >
                <option value="none" selected>Red Ball</option>
                <option value="none" selected>Green Ball</option>
                <option value="none" selected>Yellow Ball</option>
                <option value="none" selected>Universal Object</option>
                <option value="none" selected>Select Object</option>
            </select>
            <button className="btn btn-success" onClick={buttonHandler}><i class="fas fa-plus"></i></button>
        </div>
    </>
}

var objectRemover = () => {

    var objectId = "Object Id"

    var handler = (event) => {
       
    }

    return <>
        <div className="ml-3 mt-3 col-12 row">
            <input disabled className="form-control text-hint mt-1 col-12 col-md-6 mr-1" value={objectId} type="text"></input>
            <button className="btn btn-danger ml-1" onClick={handler}>Delete Current Object</button>
        </div>
    </>
}

function Inspector() {
    return (
        <>
            <div className="inspector">
                {objectCreator()}
                {objectRemover()}
                <hr className="hr"></hr>
                {scalerProperty("Mass","mass")}
                {scalerProperty("Radius","radius")}
                {scalerProperty("xCoordinate", "xCoordinate")}
                {scalerProperty("yCoordinate", "yCoordinate")}
                <hr className="hr"></hr>
                {readOnlyVectorProperty("Net Velocity", "velocity")}
                {readOnlyVectorProperty("Net Force", "force")}
                <hr className="hr"></hr>
                {vectorProperty("Force", "force")}
                <hr className="hr"></hr>
            </div>
        </>
    );
}
export default Inspector;
