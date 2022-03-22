import React, { Component} from "react";
import Node from './Node/Node';
import './css/Grid.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Menu/Navbar';
import {BFS} from './Algorithms/BFS';
//import { render } from "react-dom";

const STARTING_ROW =  5;
const STARTING_COL = 5;
const FINISHING_ROW = 20;
const FINISHING_COL = 45;


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grid: [],
        mouseisPressed: false,
        STARTING_ROW: 5,
        STARTING_COL: 5,
        FINISHING_ROW: 20,
        FINISHING_COL: 45
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

  animateBFS(visitedNodesInOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          //console.log("REE");
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        //console.log(`node-${node.row}-${node.col}`);
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  visualizeBFS() {
    const { grid } = this.state;
    const start_node = grid[STARTING_ROW][STARTING_COL];
    const finish_node = grid[FINISHING_ROW][FINISHING_COL];
    const node_order = BFS(grid, start_node, finish_node);
    this.animateBFS(node_order);
  }

  handleChangeStarter(){
    STARTING_ROW = 3;
    STARTING_COL = 7;
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    const mystyle = {
      backgroundColor: "black"
    }
    return (
        <>
        <Navbar onClick={() => this.visualizeBFS()}
                handleChangeStarter={() => this.handleChangeStarter()} />
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
        </>
      
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
      //console.log(grid);
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