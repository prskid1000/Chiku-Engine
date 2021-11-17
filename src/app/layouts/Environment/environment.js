import { React} from "react";
import Playground from "../../components/Playground/playground";
import Inspector from "../../components/Inspector/inspector";
import './environment.css';

function Environment() {
    return (
        <>
            <div className="row environment">
                <div className="col-12 col-md-9"><Playground /></div>
                <div className="col-12 col-md-3"><Inspector /></div>
            </div>
        </>
    );
}
export default Environment;
