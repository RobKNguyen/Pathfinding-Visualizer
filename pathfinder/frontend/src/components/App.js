import React, { Component } from "react";
import { render } from "react-dom";
import Grid from './Grid';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid />
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);