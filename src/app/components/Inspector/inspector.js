import { React, useState, useEffect } from "react";
import actions from '../../redux/actions';
import { useStore } from 'react-redux';
import './inspector.css';

function Inspector() {

    var store = useStore();
    var [state, setState] = useState(store.getState())
    store.subscribe(() => {
        setState(JSON.parse(JSON.stringify(store.getState())))
    })

    var scalerPropertyList = [
        'mass', 
        'radius', 
        'xCoordinate',
        'yCoordinate',
        'textureId',
        'shapeId'
    ]

    var vectorPropertyList = [
        'velocity',
        'force'
    ]

    var engineList = [
        'controllerEngine',
        'graphicsEngine',
        'intelligenceEngine',
        'physicsEngine',
        'soundEngine'
    ]

    var engine = (type) => {

        var startHandler = (event) => {
            state.config[type].status = 1
            actions.updateConfig.payload = state.config
            store.dispatch(actions.updateConfig)
        }

        var stopHandler = (event) => {
            state.config[type].status = 0
            actions.updateConfig.payload = state.config
            store.dispatch(actions.updateConfig)
        }

        return <div className="ml-3 mt-3 row" key={type}>
            <label className="label_text text-light col-10 col-md-6">{type}&nbsp;</label>
            {state.config[type].status == 0 && <button className="btn btn-success col-10 col-md-4" onClick={startHandler}>Start</button>}
            {state.config[type].status == 1 && <button className="btn btn-danger col-10 col-md-4" onClick={stopHandler}>Stop</button>}
        </div>
    }

    var scalerProperty = (property) => {

        var magnitudeHandler = (event) => {
            if (state.objectList == undefined) return
            if (state.objectList[state.currentObjectId] == undefined) return
            state.objectList[state.currentObjectId][property] = event.target.value
            setState(JSON.parse(JSON.stringify(state)))
        }

        var handler = (event) => {
            if (state.objectList == undefined) return
            if (state.objectList[state.currentObjectId] == undefined) return
            actions.updateObject.payload = state.objectList
            store.dispatch(actions.updateObject)
        }

        return <div className="ml-3 mt-3 row" key={property}>
            <label className="label_text text-light col-10 col-md-4">{property}&nbsp;</label>
            <input className="form-control col-8 col-md-5" value={state.objectList[state.currentObjectId] != undefined ? state.objectList[state.currentObjectId][property] : 0} onChange={magnitudeHandler} type="text"></input>
            <button className="btn btn-dark col-2 col-md-1" onClick={handler}><i className="fas fa-save"></i></button>
        </div>
    }

    var vectorProperty = (property) => {
        var magnitudeHandler = (event) => {
            if (state.objectList == undefined) return
            if (state.objectList[state.currentObjectId] == undefined) return
            state.objectList[state.currentObjectId][property].magnitude = event.target.value
            setState(JSON.parse(JSON.stringify(state)))
        }

        var directionHandler = (event) => {
            if (state.objectList == undefined) return
            if (state.objectList[state.currentObjectId] == undefined) return
            state.objectList[state.currentObjectId][property].direction = event.target.value
            setState(JSON.parse(JSON.stringify(state)))
        }

        var handler = (event) => {
            if (state.objectList == undefined) return
            if (state.objectList[state.currentObjectId] == undefined) return
            actions.updateObject.payload = state.objectList
            store.dispatch(actions.updateObject)
        }

        return <div className="ml-3 mt-3 row" key={property}>
            <label className="label_text col-10 col-md-4">{property}</label>
            <input placeholder="Magnitude" className="form-control text-hint mt-1 col-10 col-md-3 mr-1" value={state.objectList[state.currentObjectId] != undefined ? state.objectList[state.currentObjectId][property].magnitude : 0} onChange={magnitudeHandler} type="text"></input>
            <input placeholder="Direction" className="form-control mt-1 col-10 col-md-3" value={state.objectList[state.currentObjectId] != undefined ? state.objectList[state.currentObjectId][property].direction : 0} onChange={directionHandler} type="text"></input>
            <button className="btn btn-dark col-6 col-md-1" onClick={handler}><i className="fas fa-save"></i></button>
        </div>
    }

    var objectCreator = () => {

        var buttonHandler = (event) => {
            var date = new Date()
            var objectId = date.getTime();

            actions.addObject.payload.objectId = objectId;
            store.dispatch(actions.addObject);

            actions.setCurrentObjectId.payload.objectId = objectId
            store.dispatch(actions.setCurrentObjectId)
        }

        return <>
            <div className="ml-5 mt-3 row">
                <button className="btn btn-success col-10" onClick={buttonHandler}>New Object</button>
            </div>
        </>
    }

    var objectRemover = () => {

        var objectId = "Object Id"

        var handler = (event) => {
            actions.removeObject.payload.objectId = state.currentObjectId
            store.dispatch(actions.removeObject)
            actions.setCurrentObjectId.payload.objectId = (Object.keys(state.objectList).length != 0) ? Object.keys(state.objectList)[0] : 0
            store.dispatch(actions.setCurrentObjectId)
        }

        return <>
            <div className="ml-3 mt-3 row">
                <label className="label_text text-light col-10 col-md-4">Object&nbsp;</label>
                <input disabled className="form-control text-hint col-8 col-md-6" value={state.currentObjectId} type="text"></input>
                <button className="btn btn-danger col-2 col-md-1" onClick={handler}><i className="fas fa-trash"></i></button>
            </div>
        </>
    }

    return (
        <>
            <div className="inspector">
                {objectCreator()}
                {objectRemover()}
                <hr className="hr"></hr>
                {scalerPropertyList.map((value) => (
                    scalerProperty(value)
                ))}
                <hr className="hr"></hr>
                {vectorPropertyList.map((value) => (
                    vectorProperty(value)
                ))}
                <hr className="hr"></hr>
                {engineList.map((value) => (
                    engine(value)
                ))}
                <hr className="hr"></hr>
            </div>
        </>
    );
}
export default Inspector;
