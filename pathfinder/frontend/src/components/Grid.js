import React, { Component} from "react";
import Node from './Node/Node';
import './css/Grid.css';
//import { render } from "react-dom";

const STARTING_ROW =  5;
const STARTING_COL = 5;
const FINISHING_ROW = 15;
const FINISHING_COL = 15;


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grid: [],
        mouseisPressed: false
    };
  }



  handleMouseEnter(row, col, el) {
    if (!this.state.mouseIsPressed) return;
    if (!((row == STARTING_ROW && col == STARTING_COL) || (row == FINISHING_ROW && col == FINISHING_COL))) {
      const newGrid = getNewGridToggleWall(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
    
  }

  handleMouseDown(row, col, el) {
    if (!((row == STARTING_ROW && col == STARTING_COL) || (row == FINISHING_ROW && col == FINISHING_COL))) {
      const newGrid = getNewGridToggleWall(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
      console.log(el);
    }
    this.setState({mouseIsPressed: true});
    
    // console.log(this.state.grid[row][col].isWall);
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  handleMouseLeave(row, col) {
    //console.log("Leaving row: " + row + ", column: " + col);
  }

  componentDidMount() {
      const grid = getInitialGrid();
      this.setState({grid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    const mystyle = {
      backgroundColor: "black"
    }
    return (
        
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col, el, mystyle) => this.handleMouseDown(row, col, el,mystyle)}
                      onMouseEnter={(row, col, el) =>
                        this.handleMouseEnter(row, col, el)
                      }
                      onMouseLeave={(row, col) =>
                        this.handleMouseLeave(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      
    );
  }
}

const getInitialGrid = () => {
      const grid = [];
      for (let row = 0; row < 25; row++) {
          const currRow = [];
          for (let col = 0; col < 50; col++) {
              currRow.push(createNode(col,row));
          }
          grid.push(currRow);
      }
      console.log(grid);
      return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === STARTING_ROW && col === STARTING_COL,
        isFinish: row === FINISHING_ROW && col === FINISHING_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridToggleWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};