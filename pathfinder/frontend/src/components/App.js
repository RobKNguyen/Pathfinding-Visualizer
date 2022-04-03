import React, { Component } from "react";
import { render } from "react-dom";
import Grid from './Grid';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.ChildElement = React.createRef();
  }

  render() {
    return (
      <div>
      <div>
        <Grid ref={this.ChildElement}/>
      </div>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);