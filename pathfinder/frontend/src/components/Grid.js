import React, { Component} from "react";
import Node from './Node/Node';
import './css/Grid.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Menu/Navbar';
import { BFS, getShortestPathOrder } from './Algorithms/BFS';
import { dijkstras } from './Algorithms/Dijkstras';
//import { render } from "react-dom";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grid: [],
        mouseisPressed: false,
        start_row: 2,
        start_col: 5,
        finish_row: 7,
        finish_col: 20,
        start_node_selected: false,
        finish_node_selected:false,
        post_animation: false
    };
  }


  // Handles Nodes being pressed.
  handleMouseEnter(row, col, el) {
    // IF button is clicked.
    if (!this.state.mouseIsPressed) return;

    // If before animation:
    if (!this.state.post_animation) {
        if (this.state.start_node_selected) {
          const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.start_row][this.state.start_col], "START");
          this.setState({grid: newGrid, start_row: row, start_col: col});
        } else if (this.state.finish_node_selected) {
          const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");
          this.setState({grid: newGrid, finish_row: row, finish_col: col});
        } 
        else if (!((row == this.state.start_row && col == this.state.start_col) || (row == this.state.finish_row && col == this.state.finish_col))) {
          const newGrid = getNewGridToggleWall(this.state.grid, row, col);
          this.setState({grid: newGrid});
        }
    } else {
      if (this.state.start_node_selected) {
        const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.start_row][this.state.start_col], "START");
        this.setState({grid: newGrid, start_row: row, start_col: col}, () => {
          this.visualizeBFS();
        });
        
      } else if (this.state.finish_node_selected) {
        const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");
        this.setState({grid: newGrid, finish_row: row, finish_col: col}, () => {
          this.visualizeBFS();
        });
      } 
      else if (!((row == this.state.start_row && col == this.state.start_col) || (row == this.state.finish_row && col == this.state.finish_col))) {
        const newGrid = getNewGridToggleWall(this.state.grid, row, col);
        this.setState({grid: newGrid}, () => {
          this.visualizeBFS();
        });
      }
    }
  }

  handleMouseDown(row, col, el) {
    // If before animation:
    if (!this.state.post_animation) {
        if (!((row == this.state.start_row && col == this.state.start_col) || (row == this.state.finish_row && col == this.state.finish_col))) {
          const newGrid = getNewGridToggleWall(this.state.grid, row, col);
          this.setState({grid: newGrid, mouseIsPressed: true});
          console.log(el);
        } else if (row == this.state.start_row && col == this.state.start_col) {
          // console.log("STARTER SELECTED")
          this.setState({start_node_selected: true});
        } else if (row == this.state.finish_row && col == this.state.finish_col) {
          // console.log("FINISH SELECTED")
          this.setState({finish_node_selected: true});
        }
    } else {
      if (!((row == this.state.start_row && col == this.state.start_col) || (row == this.state.finish_row && col == this.state.finish_col))) {
        const newGrid = getNewGridToggleWall(this.state.grid, row, col);
        this.setState({grid:newGrid, mouseIsPressed: true}, () => {
          this.visualizeBFS();
        });
        //console.log(this.state.grid);

      } else if (row == this.state.start_row && col == this.state.start_col) {
        this.setState({start_node_selected: true});
      } else if (row == this.state.finish_row && col == this.state.finish_col) {
        this.setState({finish_node_selected: true});
      }

    }
    this.setState({mouseIsPressed: true});

  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, start_node_selected: false, finish_node_selected: false });
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

  animateBFSInstant(visitedNodesInOrder, shortest_path_order) {
    //console.log(this.state.post_animation);
    // console.log("ERASING VISITED AND SHORTEST PATH NODES");
    //console.log(`vistedNodeInOrder: ${visitedNodesInOrder}\nshortest_path_order: ${shortest_path_order}`);
    for (let i =0; i < this.state.grid.length; i++) {
      for (let j = 0; j < this.state.grid[i].length; j++){
        
        if (document.getElementById(`node-${i}-${j}`).className ===
        'node node-visited' || document.getElementById(`node-${i}-${j}`).className ===
        'node node-shortest-path') {
          document.getElementById(`node-${i}-${j}`).className =
          'node ';
        }
      
      }
    }

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            this.animateShortestPath(shortest_path_order);
          
          return;
        }
        const node = visitedNodesInOrder[i];
        
        //console.log(`node-${node.row}-${node.col}`);
        if (document.getElementById(`node-${node.row}-${node.col}`).className !=
        'node node-start' && document.getElementById(`node-${node.row}-${node.col}`).className !=
        'node node-finish') {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }
      
    }

  }

  animateBFS(visitedNodesInOrder, shortest_path_order) {
    //console.log(this.state.post_animation);
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
        if (document.getElementById(`node-${node.row}-${node.col}`).className !=
        'node node-start' && document.getElementById(`node-${node.row}-${node.col}`).className !=
        'node node-finish') {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }
      }, 10 * i);
    }
    
  }

  animateShortestPath(shorted_path_order) {
    if(!this.state.post_animation) {
        for (let i = 1; i < shorted_path_order.length-1; i++) {
          setTimeout(() => {
            const node = shorted_path_order[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 10 * i);
        }
    } else {
        for (let i = 1; i < shorted_path_order.length-1; i++) {
            const node = shorted_path_order[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
        }
        
    }
  }

  visualizeBFS() {
    console.log(`(${this.state.start_row}, ${this.state.start_col}) (visualizeBFS)`);
    this.setState({post_animation: true});
    const { grid, mouseisPressed, start_row, start_col, finish_row, finish_col} = this.state;
    grid.map( function(row) {
      return row.map( function (cell ) {
        cell.previousNode = null;
        cell.isVisited = false;
        return;
      })
    })
    const start_node = grid[start_row][start_col];
    const finish_node = grid[finish_row][finish_col];
    const node_order = BFS(grid, start_node, finish_node);
    const shortest_path_order = getShortestPathOrder(finish_node);

    if (!this.state.post_animation) {
      this.animateBFS(node_order, shortest_path_order);
    } else {

      this.animateBFSInstant(node_order, shortest_path_order);
    }

    this.setState({post_animation: true});
  }

  visualizeDijkstras() {
    console.log("PERFORMING DIJKSTRAS");
    const { grid, mouseisPressed, start_row, start_col, finish_row, finish_col} = this.state;
    grid.map( function(row) {
      return row.map( function (cell ) {
        cell.previousNode = null;
        cell.isVisited = false;
        return;
      })
    });
    const start_node = grid[start_row][start_col];
    const finish_node = grid[finish_row][finish_col];
    const node_order = dijkstras(grid, start_node, finish_node);

  }




  render() {
    const {grid, mouseIsPressed, start_row, start_col, finish_row, finish_col} = this.state;
    return (
        <>
        <Navbar handleBFS={this.visualizeBFS.bind(this)}
                handleDijkstras={this.visualizeDijkstras.bind(this)}

                 />
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

// const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.start_row][this.state.start_col], "START");
const changeEndPoints = (grid, new_row, new_col, old_node, endpointType) => {
      const currentEndNode = grid[old_node.row][old_node.col];
      const newEndNode = grid[new_row][new_col];
      let newGrid;
      if (endpointType === "START") {
        newGrid = getNewGridToggleEndPoints(grid, currentEndNode, newEndNode, "START");
      }else if (endpointType === "FINISH") {
        newGrid = getNewGridToggleEndPoints(grid, currentEndNode, newEndNode, "FINISH");
      }
      return newGrid;
}

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

const getNewGridToggleEndPoints = (grid, currentEndNode, newEndNode, endpointType) => {
    const newGrid = grid.slice();
    // console.log(newGrid);
    const node = newGrid[newEndNode.row][newEndNode.col];
    if (endpointType === "START") {
      currentEndNode.isStart=false;
      const newStartNode = {
        ...node,
        isStart: true
        };
      newGrid[newEndNode.row][newEndNode.col] = newStartNode;
    } else if (endpointType === "FINISH") {
      currentEndNode.isFinish=false;
      const newFinishNode = {
        ...node,
        isFinish: true
        };
        newGrid[newEndNode.row][newEndNode.col] = newFinishNode;
    }
    return newGrid;

};