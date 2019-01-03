import React, { Component } from 'react';
import './App.css';
const electron = window.require('electron');
const {ipcRenderer} = electron;
class App extends Component {
  render() {
    return (
      <div className="App">
        <p>Hellooooo</p>
      </div>
    );
  }
}

export default App;
