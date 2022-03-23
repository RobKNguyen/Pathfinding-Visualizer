import React, { Component} from "react";
import Node from './Node/Node';
import './css/Grid.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Menu/Navbar';
import { BFS, getShortestPathOrder } from './Algorithms/BFS';
//import { render } from "react-dom";

let STARTING_ROW =  5;
let STARTING_COL = 5;
let FINISHING_ROW = 10;
let FINISHING_COL = 15;


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grid: [],
        mouseisPressed: false,
        start_row: 2,
        start_col: 5,
        finish_row: 7,
        finish_col: 20
    };
    

  }



  handleMouseEnter(row, col, el) {
    //console.log(this.state.start_col);
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
      //this.setState({start_row: 5, start_col: 5, finish_row: 0, finish_col: 0});
      //console.log(`(${this.state.start_row}, ${this.state.start_col}) -> (${this.state.finish_row}, ${this.state.finish_col})`);
      const grid = getInitialGrid(this.state.start_row, this.state.start_col, this.state.finish_row, this.state.finish_col);
      
      this.setState({grid});
  }

  animateBFS(visitedNodesInOrder, shortest_path_order) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(shortest_path_order);
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

  animateShortestPath(shorted_path_order) {
    for (let i = 0; i < shorted_path_order.length; i++) {
      setTimeout(() => {
        const node = shorted_path_order[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeBFS() {
    const { grid, mouseisPressed, start_row, start_col, finish_row, finish_col} = this.state;
    const start_node = grid[start_row][start_col];
    console.log(start_node);
    const finish_node = grid[finish_row][finish_col];
    const node_order = BFS(grid, start_node, finish_node);
    const shortest_path_order = getShortestPathOrder(finish_node);
    this.animateBFS(node_order, shortest_path_order);
  }



  handleChangeStarter(){
    //console.log("REE");
    //console.log(`Starting: (${this.state.start_row}, ${this.state.start_col})\nFinishing: (${this.state.finish_row}, ${this.state.finish_col})`);
    //console.log(this.state.grid);
    const currentStartNode = this.state.grid[this.state.start_row][this.state.start_col];
    const currentFinishNode = this.state.grid[this.state.finish_row][this.state.finish_col];


    const newStartNode = this.state.grid[0][0];
    const newFinishNode = this.state.grid[20][20];
    this.setState({start_row: 0, start_col: 0, finish_row: 20, finish_col: 20});


    //console.log(currentStartNode);
    //console.log(currentFinishNode);
    const newGrid = getNewGridToggleEndPoints(this.state.grid, currentStartNode, currentFinishNode, newStartNode, newFinishNode);
    this.setState({grid: newGrid});

  }

  render() {
    const {grid, mouseIsPressed, start_row, start_col, finish_row, finish_col} = this.state;
    return (
        <>
        <Navbar onClick={this.visualizeBFS.bind(this)}
                handleChangeStarter={this.handleChangeStarter.bind(this)} />
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

const getInitialGrid = (stRow, stCol, finRow, finCol) => {
      const grid = [];
      //console.log(this.state.starting_row);

      for (let row = 0; row < 25; row++) {
          const currRow = [];
          for (let col = 0; col < 50; col++) {
              currRow.push(createNode(col,row,stRow, stCol, finRow, finCol));
          }
          grid.push(currRow);
      }
      //console.log(grid);
      return grid;
};

const createNode = (col, row,stRow, stCol, finRow, finCol) => {
    //console.log(`Starting: (${this.start_row}, ${this.start_col})\n Finishing: (${this.finish_row}, ${this.finish_col})`);
    
    return {
        col,
        row,
        isStart: row === stRow && col === stCol,
        isFinish: row === finRow&& col === finCol,
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

const getNewGridToggleEndPoints = (grid, start_node, finish_node, new_start_node, new_finish_node) => {
  //console.log(grid);
  start_node.isStart=false;
  finish_node.isFinish=false;

  // console.log(start_node);
  console.log(finish_node);
  //console.log(grid[start_node.row][start_node.col]);
  //onsole.log("REE");
  const newGrid = grid.slice();
  const node1 = newGrid[new_start_node.row][new_start_node.col];
  const newStartNode = {
    ...node1,
    isStart: true
  };
  newGrid[new_start_node.row][new_start_node.col] = newStartNode;
  const node2 = newGrid[new_finish_node.row][new_finish_node.col];
  const newFinishNode = {
    ...node2,
    isFinish: true
  };
  newGrid[new_finish_node.row][new_finish_node.col] = newFinishNode;
  console.log(newStartNode);
  console.log(newFinishNode);
  console.log(newGrid);
  return newGrid;
};