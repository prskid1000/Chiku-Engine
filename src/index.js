import React from 'react';
import App from './main/app';
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from '../src/app/redux/store';

require('dotenv').config();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
