import React, { Component} from "react";
import Node from './Node/Node';
import './css/Grid.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Menu/Navbar';
import ControlPanel from './Menu/ControlPanel';
import { BFS, getShortestPathBFS } from './Algorithms/BFS';
import { dijkstras, getShortestPathDijkstras } from './Algorithms/Dijkstras';
import { Grid } from '@mui/material';
//import { render } from "react-dom";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        grid: [],
        mouseIsPressed: false,
        start_row: 2,
        start_col: 5,
        finish_row: 7,
        finish_col: 20,
        start_node_selected: false,
        finish_node_selected:false,
        post_animation: false,
        pathfinding_algorithm: "bfs",
        row_dimension: 25,
        col_dimension: 50
    };

    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.handleDimension = this.handleDimension.bind(this);
  }

  handleRangeChange(e){

    const {grid, start_row, start_col, finish_row, finish_col, post_animation, pathfinding_algorithm} = this.state;

    if (isNaN(e.target.value)) return;
    

    let new_dimension = e.target.value;
    if (new_dimension=== '') {
      return;
    }
    const dimension_type = (e.target.className === "start-node row" || e.target.className === "finish-node row") ? this.state.row_dimension-1 : 
    ((e.target.className === "start-node col" || e.target.className === "finish-node col") ? this.state.col_dimension-1 : null);
    // console.log(dimension_type);
    (e.target.value > dimension_type) ?
      e.target.value = dimension_type :
      (e.target.value < 0) ?
      e.target.value = 0 : e.target.value = e.target.value;


    if (e.target.className === "start-node row") {


      (grid[e.target.value][start_col].isWall || grid[e.target.value][start_col].isFinish) ?
      e.target.value = start_row : e.target.value = e.target.value;
      new_dimension = e.target.value;
      const newGrid = changeEndPoints(this.state.grid, new_dimension, this.state.start_col, this.state.grid[this.state.start_row][this.state.start_col], "START");
      const slider_element = document.getElementById("range-slider-1");
      changeRangeSlider(new_dimension, slider_element);

      
      if (post_animation) {
      this.setState({grid: newGrid, start_row: new_dimension}, () => {
        if (pathfinding_algorithm === "bfs") {
          this.visualizeBFS();
        } else if (pathfinding_algorithm === "dijkstras") {
          this.visualizeDijkstras();
        }
      });


    }else {
      this.setState({grid: newGrid, start_row: new_dimension});
    }
    } else if (e.target.className === "start-node col") {

    (grid[start_row][e.target.value].isWall || grid[start_row][e.target.value].isFinish) ?
    e.target.value = start_col : e.target.value = e.target.value;
    new_dimension = e.target.value;
    const newGrid = changeEndPoints(this.state.grid, start_row, new_dimension, this.state.grid[this.state.start_row][this.state.start_col], "START");
    const slider_element = document.getElementById("range-slider-2");
    changeRangeSlider(new_dimension, slider_element);

    if (post_animation) {
      this.setState({grid: newGrid, start_col: new_dimension}, () => {
        if (pathfinding_algorithm === "bfs") {
          this.visualizeBFS();
        } else if (pathfinding_algorithm === "dijkstras") {
          this.visualizeDijkstras();
        }
      });
    } else {
      this.setState({grid: newGrid, start_col: new_dimension});
    }
    } else if (e.target.className === "finish-node row") {

      (grid[e.target.value][finish_col].isWall || grid[e.target.value][finish_col].isStart) ?
      e.target.value = finish_row : e.target.value = e.target.value;
      new_dimension = e.target.value;

      const newGrid = changeEndPoints(this.state.grid, new_dimension, finish_col, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");
      // this.setState({grid: newGrid, start_col: new_dimension});
      const slider_element = document.getElementById("range-slider-3");
      changeRangeSlider(new_dimension, slider_element);

      if (post_animation) {
        this.setState({grid: newGrid, finish_row: new_dimension}, () => {
          if (pathfinding_algorithm === "bfs") {
            this.visualizeBFS();
          } else if (pathfinding_algorithm === "dijkstras") {
            this.visualizeDijkstras();
          }
        });
      } else {
        this.setState({grid: newGrid, finish_row: new_dimension});
      }
  } else if (e.target.className === "finish-node col") {
      (grid[finish_row][e.target.value].isWall || grid[finish_row][e.target.value].isStart) ?
      e.target.value = finish_col : e.target.value = e.target.value;
      new_dimension = e.target.value;

      const newGrid = changeEndPoints(this.state.grid, finish_row, new_dimension, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");
      // this.setState({grid: newGrid, start_col: new_dimension});
      const slider_element = document.getElementById("range-slider-4");
      changeRangeSlider(new_dimension, slider_element);

      if (post_animation) {
        this.setState({grid: newGrid, finish_col: new_dimension}, () => {
          if (pathfinding_algorithm === "bfs") {
            this.visualizeBFS();
          } else if (pathfinding_algorithm === "dijkstras") {
            this.visualizeDijkstras();
          }
        });
      } else {
        this.setState({grid: newGrid, finish_col: new_dimension});
      }
  }
  }

  handleDimension(e) {

    const {grid, post_animation, pathfinding_algorithm, start_row, start_col, finish_row, finish_col, row_dimension, col_dimension} = this.state;
    //console.log(e);
    const idx = (e.id).charAt((e.id).length - 1);
    //console.log(idx);
    
    if (idx == 1) {
      //console.log("PATH 1");
      const new_row_dimension = e.value;
      //console.log(`new_row_dimension: ${new_row_dimension}`);
      const new_stRow = Math.ceil(new_row_dimension / 10);
      const new_finRow = Math.ceil(new_row_dimension / 5);
      // const newGrid = getInitialGrid(new_stRow, start_col, new_finRow, finish_col, new_row_dimension, col_dimension);
      const newGrid2 = changeEndPoints(grid, new_stRow, start_col, grid[start_row][start_col], "START");
      //console.log(newGrid2);
      const newGrid3 = changeEndPoints(newGrid2, new_finRow, finish_col, grid[finish_row][finish_col], "FINISH");
      //console.log(newGrid3);
      const newGrid = resizeGrid(newGrid3, new_row_dimension, col_dimension, row_dimension, col_dimension);
      //console.log(newGrid);
      document.getElementsByClassName("start-node row")[0].value = new_stRow;
      document.getElementsByClassName("finish-node row")[0].value = new_finRow;
      changeRangeSlider(new_stRow, document.getElementById("range-slider-1"));
      changeRangeSlider(new_finRow, document.getElementById("range-slider-3"));
      if (post_animation) {
        this.setState({grid: newGrid, row_dimension: new_row_dimension, start_row: new_stRow, start_col: start_col, finish_row: new_finRow, finish_col: finish_col}, () =>{
          if (pathfinding_algorithm === "bfs") {
            this.visualizeBFS();
          } else if (pathfinding_algorithm === "dijkstras") {
            this.visualizeDijkstras();
          }
        });
      } else {
        this.setState({grid: newGrid, row_dimension: new_row_dimension, start_row: new_stRow, start_col: start_col, finish_row: new_finRow, finish_col: finish_col});
      }
    } else {
      //console.log("PATH 2");
      const new_col_dimension = e.value;
      const new_stCol = Math.ceil(new_col_dimension / 10);
      const new_finCol = Math.ceil(new_col_dimension / 5);

      const change_start_node = changeEndPoints(grid, start_row, new_stCol, grid[start_row][start_col], "START");
      
      const change_finish_node = changeEndPoints(change_start_node, finish_row, new_finCol, grid[finish_row][finish_col], "FINISH");
      
      const newGrid = resizeGrid(change_finish_node, row_dimension, new_col_dimension, row_dimension, col_dimension);
      
      document.getElementsByClassName("start-node col")[0].value = new_stCol;
      document.getElementsByClassName("finish-node col")[0].value = new_finCol;
      changeRangeSlider(new_stCol, document.getElementById("range-slider-2"));
      changeRangeSlider(new_finCol, document.getElementById("range-slider-4"));
      

      if (post_animation) {
        this.setState({grid: newGrid, col_dimension: new_col_dimension, start_row: start_row, start_col: new_stCol, finish_row: finish_row, finish_col: new_finCol}, () =>{
          if (pathfinding_algorithm === "bfs") {
            this.visualizeBFS();
          } else if (pathfinding_algorithm === "dijkstras") {
            this.visualizeDijkstras();
          }
        });
      } else {
        this.setState({grid: newGrid, col_dimension: new_col_dimension, start_row: start_row, start_col: new_stCol, finish_row: finish_row, finish_col: new_finCol});
      }
    }
  }

  handleSlider(e){

    const {grid, post_animation, pathfinding_algorithm, start_row, start_col, finish_row, finish_col} = this.state;

    if(e.target.id === "slider-1") {

      (grid[e.target.value][start_col].isWall || grid[e.target.value][start_col].isFinish) ?
      e.target.value = start_row : e.target.value = e.target.value;

      document.getElementsByClassName("start-node row")[0].value = e.target.value;
      const newGrid = changeEndPoints(this.state.grid, e.target.value, this.state.start_col, this.state.grid[this.state.start_row][this.state.start_col], "START");
          // this.setState({grid: newGrid, start_row: row, start_col: col});
          console.log(`start_row: ${start_row}\nstart_col: ${start_col}`)
          if (post_animation) {
                this.setState({grid: newGrid, start_row: e.target.value, start_col: start_col}, () => {
                  if (pathfinding_algorithm === "bfs") {
                    this.visualizeBFS();
                  } else if (pathfinding_algorithm === "dijkstras") {
                    this.visualizeDijkstras();
                  }
                });
          } else {
            this.setState({grid: newGrid, start_row: e.target.value, start_col: start_col});
          }
          // console.log(e.target.value);
          // console.log(`slider-position: ${document.getElementById(`slider-thumb-1`).style.left}`);

          // document.getElementsByClassName("start-node col")[0].value = col;
    } else if (e.target.id === "slider-2") {

      (grid[start_row][e.target.value].isWall || grid[start_row][e.target.value].isFinish) ?
      e.target.value = start_col : e.target.value = e.target.value;

      document.getElementsByClassName("start-node col")[0].value = e.target.value;
      const newGrid = changeEndPoints(grid, start_row, e.target.value, grid[start_row][start_col], "START");
          // this.setState({grid: newGrid, start_row: row, start_col: col});

          if (post_animation) {
                this.setState({grid: newGrid, start_row: start_row, start_col: e.target.value}, () => {
                  if (pathfinding_algorithm === "bfs") {
                    this.visualizeBFS();
                  } else if (pathfinding_algorithm === "dijkstras") {
                    this.visualizeDijkstras();
                  }
                });
          } else {
            this.setState({grid: newGrid, start_row: start_row, start_col: e.target.value});
          }
    } else if (e.target.id === "slider-3") {

      (grid[e.target.value][finish_col].isWall || grid[e.target.value][finish_col].isStart) ?
      e.target.value = finish_row : e.target.value = e.target.value;

      document.getElementsByClassName("finish-node row")[0].value = e.target.value;
      const newGrid = changeEndPoints(this.state.grid, e.target.value, finish_col, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");
          // this.setState({grid: newGrid, start_row: row, start_col: col});

          if (post_animation) {
                this.setState({grid: newGrid, finish_row: e.target.value, finish_col: finish_col}, () => {
                  if (pathfinding_algorithm === "bfs") {
                    this.visualizeBFS();
                  } else if (pathfinding_algorithm === "dijkstras") {
                    this.visualizeDijkstras();
                  }
                });
          } else {
            this.setState({grid: newGrid, finish_row: e.target.value, finish_col: finish_col});
          }
    }
    else if (e.target.id === "slider-4") {

      (grid[finish_row][e.target.value].isWall || grid[finish_row][e.target.value].isStart) ?
      e.target.value = finish_col : e.target.value = e.target.value;

      document.getElementsByClassName("finish-node col")[0].value = e.target.value;
      const newGrid = changeEndPoints(this.state.grid, finish_row, e.target.value, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");
          // this.setState({grid: newGrid, start_row: row, start_col: col});

          if (post_animation) {
                this.setState({grid: newGrid, finish_row: finish_row, finish_col: e.target.value}, () => {
                  if (pathfinding_algorithm === "bfs") {
                    this.visualizeBFS();
                  } else if (pathfinding_algorithm === "dijkstras") {
                    this.visualizeDijkstras();
                  }
                });
          } else {
            this.setState({grid: newGrid, finish_row: finish_row, finish_col: e.target.value});
          }
    }
    
  }


  // Handles Nodes being pressed.
  handleMouseEnter(row, col, el) {
    
    const {start_node_selected, post_animation, finish_node_selected, pathfinding_algorithm} = this.state;
    // console.log(`start_node_selected: ${start_node_selected}\npost_animation: ${post_animation}\nfinish_node_selected: ${finish_node_selected}\npathfinding_algorithm: ${pathfinding_algorithm}`);
    const current = this.state.grid[row][col];
    if (!this.state.mouseIsPressed) return;

        wallbreaker: if (start_node_selected) {
          // console.log("START NODE SELECTED");
          if (current.isWall || current.isFinish) break wallbreaker;
          
          const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.start_row][this.state.start_col], "START");
          // this.setState({grid: newGrid, start_row: row, start_col: col});

          if (post_animation) {
                this.setState({grid: newGrid, start_row: row, start_col: col}, () => {
                  if (pathfinding_algorithm === "bfs") {
                    this.visualizeBFS();
                  } else if (pathfinding_algorithm === "dijkstras") {
                    this.visualizeDijkstras();
                  }
                });
          } else {
            this.setState({grid: newGrid, start_row: row, start_col: col});
          }
          
          // For Range Slider:
          document.getElementsByClassName("start-node row")[0].value = row;
          document.getElementsByClassName("start-node col")[0].value = col;
          const slider_1 = document.getElementById("range-slider-1");
          const slider_2 = document.getElementById("range-slider-2")
          changeRangeSlider(row, slider_1);
          changeRangeSlider(col, slider_2);
          slider_1.value=row;
          slider_2.value=col;



        } else if (finish_node_selected) {
          if (current.isWall || current.isStart) break wallbreaker;
          const newGrid = changeEndPoints(this.state.grid, row, col, this.state.grid[this.state.finish_row][this.state.finish_col], "FINISH");

          if (post_animation) {
            this.setState({grid: newGrid, finish_row: row, finish_col: col}, () => {
              if (pathfinding_algorithm === "bfs") {
                this.visualizeBFS();
              } else if (pathfinding_algorithm === "dijkstras") {
                this.visualizeDijkstras();
              }
            });
          } else {
            this.setState({grid: newGrid, finish_row: row, finish_col: col});
          }
          document.getElementsByClassName("finish-node row")[0].value = row;
          document.getElementsByClassName("finish-node col")[0].value = col;
          changeRangeSlider(row, document.getElementById("range-slider-3"));
          changeRangeSlider(col, document.getElementById("range-slider-4"));
        } 
        else if (!((row == this.state.start_row && col == this.state.start_col) || (row == this.state.finish_row && col == this.state.finish_col))) {
          const newGrid = getNewGridToggleWall(this.state.grid, row, col);

          if (post_animation) {
            this.setState({grid: newGrid}, () => {
              if (pathfinding_algorithm === "bfs") {
                this.visualizeBFS();
              } else if (pathfinding_algorithm === "dijkstras") {
                this.visualizeDijkstras();
              }
            });
          } else{
            this.setState({grid: newGrid});
          }
        }

  }

  handleMouseDown(row, col, el) {
    // If before animation:
        if (!((row == this.state.start_row && col == this.state.start_col) || (row == this.state.finish_row && col == this.state.finish_col))) {
          if (!this.state.post_animation) {
            const newGrid = getNewGridToggleWall(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
            // console.log("REE");
            // console.log(el);
          } else {
            const newGrid = getNewGridToggleWall(this.state.grid, row, col);
            this.setState({grid:newGrid, mouseIsPressed: true}, () => {
              if (this.state.pathfinding_algorithm === "bfs") {
                this.visualizeBFS();
              } else if (this.state.pathfinding_algorithm === "dijkstras") {
                this.visualizeDijkstras();
              }
          });
          }
          } else if (row == this.state.start_row && col == this.state.start_col) {
              this.setState({start_node_selected: true});
          } else if (row == this.state.finish_row && col == this.state.finish_col) {
          // console.log("FINISH SELECTED")
              this.setState({finish_node_selected: true});
          }
          this.setState({mouseIsPressed: true});

  }

  handleMouseUp() {
    // console.log("handleMouseUp()");
    this.setState({mouseIsPressed: false, start_node_selected: false, finish_node_selected: false });
  }

  handleMouseLeave(row, col) {
    //console.log("Leaving row: " + row + ", column: " + col);
  }

  componentDidMount() {
      //this.setState({start_row: 5, start_col: 5, finish_row: 0, finish_col: 0});
      //console.log(`(${this.state.start_row}, ${this.state.start_col}) -> (${this.state.finish_row}, ${this.state.finish_col})`);
      const grid = getInitialGrid(this.state.start_row, this.state.start_col, this.state.finish_row, this.state.finish_col, this.state.row_dimension, this.state.col_dimension);
      
      this.setState({grid});
  }

  animateAlgorithmInstant(visitedNodesInOrder, shortest_path_order) {
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

  animateAlgorithm(visitedNodesInOrder, shortest_path_order) {
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
          }, 15 * i);
        }
    } else {
        for (let i = 1; i < shorted_path_order.length-1; i++) {
            const node = shorted_path_order[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
            
        }
    }
    // this.setState({post_animation: true});
  }

  visualizeBFS() {
    // console.log(`(${this.state.start_row}, ${this.state.start_col}) (visualizeBFS)`);
    this.setState({post_animation: true});
    const { grid, mouseIsPressed, start_row, start_col, finish_row, finish_col} = this.state;
    grid.map( function(row) {
      return row.map( function (cell ) {
        cell.previousNode = null;
        cell.isVisited = false;
        cell.distance = Infinity;
        return;
      })
    })
    const start_node = grid[start_row][start_col];
    const finish_node = grid[finish_row][finish_col];
    const node_order = BFS(grid, start_node, finish_node);
    const shortest_path_order = getShortestPathBFS(finish_node);

    if (!this.state.post_animation) {
      this.animateAlgorithm(node_order, shortest_path_order);
    } else {

      this.animateAlgorithmInstant(node_order, shortest_path_order);
    }
    // this.setState({pathfinding_algorithm: "bfs"});
    this.setState({post_animation: true, pathfinding_algorithm: "bfs"});
  }

  visualizeDijkstras() {
    // console.log("PERFORMING DIJKSTRAS");
    const { grid, mouseIsPressed, start_row, start_col, finish_row, finish_col} = this.state;
    grid.map( function(row) {
      return row.map( function (cell ) {
        cell.previousNode = null;
        cell.isVisited = false;
        cell.distance = Infinity;
        return;
      })
    });
    const start_node = grid[start_row][start_col];
    const finish_node = grid[finish_row][finish_col];
    const node_order = dijkstras(grid, start_node, finish_node);
    const shortest_path_order = getShortestPathDijkstras(finish_node);

    if (!this.state.post_animation) {
      this.animateAlgorithm(node_order, shortest_path_order);
    } else {

      this.animateAlgorithmInstant(node_order, shortest_path_order);
    }
    // this.setState({pathfinding_algorithm: "dijkstras"});
    this.setState({post_animation: true, pathfinding_algorithm: "dijkstras"});
  }




  render() {
    const {grid, mouseIsPressed, start_row, start_col, finish_row, finish_col, row_dimension, col_dimension, pathfinding_algorithm} = this.state;
    return (
        <>
                <Navbar handleBFS={this.visualizeBFS.bind(this)}
                handleDijkstras={this.visualizeDijkstras.bind(this)}

                 />
        
        <h1>{this.state.start_row}</h1>
        <Grid container
              spacing={1}>
            <Grid item xs={4}>
              <div className="mega-menu">
                <ControlPanel
                  handleRangeChange={this.handleRangeChange.bind(this)}
                  start_row={start_row}
                  start_col={start_col}
                  finish_row={finish_row}
                  finish_col={finish_col}
                  row_dimension={row_dimension}
                  col_dimension={col_dimension}
                  handleSlider={this.handleSlider.bind(this)}
                  pathfinding_algorithm={pathfinding_algorithm}
                  handleDimension={this.handleDimension.bind(this)}/>
              </div>
            </Grid>
            <Grid item xs={6}
                
                  >
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
        </Grid>
        <Grid item xs={2}><div className="right-main"><h1>hi</h1></div></Grid>
            
        </Grid>
        </>
      
    );
  }
}

const getInitialGrid = (stRow, stCol, finRow, finCol, row_dim, col_dim) => {
      const grid = [];
      //console.log(this.state.starting_row);

      for (let row = 0; row < row_dim; row++) {
          const currRow = [];
          for (let col = 0; col < col_dim; col++) {
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

const changeRangeSlider = (new_dimension, domTag) => {
    // console.log(domTag);
    //console.log(domTag);
    const dom_id = (domTag.id).charAt((domTag.id).length-1);
    //console.log(`dom_id: ${dom_id}`);
    const slider = domTag.querySelector(`.slider`);
    const thumb = domTag.querySelector(`.slider-thumb`);
    const tooltip = domTag.querySelector(`.tooltip`);
    const progress = domTag.querySelector(`.progress`);
    // domTag.value=new_dimension;
    // console.log(new_dimension);
    const maxVal = slider.getAttribute("max");
    const val = (new_dimension / maxVal) * 100 + "%";
    tooltip.innerHTML = new_dimension;
    progress.style.width = val;
    thumb.style.left = val;
    slider.value = new_dimension;
}

const resizeGrid = (grid, new_row_dim, new_col_dim, old_row_dim, old_col_dim) => {
  const newGrid = [];
  if (new_row_dim > old_row_dim) {
    grid.push([]);
    for(let i = 0; i < old_col_dim; i++) {
      grid[grid.length-1].push(createNode(i, grid.length-1, Infinity, Infinity, Infinity, Infinity));
    }
  } else if (new_row_dim < old_row_dim) {
    grid.pop();
  } else if (new_col_dim > old_col_dim) {
    for (let i = 0; i < old_row_dim; i++) {
      grid[i].push(createNode(grid[i].length, i, Infinity, Infinity, Infinity, Infinity));
    }
  } else if (new_col_dim < old_col_dim) {
    for (let i = 0; i < grid.length; i++) {
      grid[i].pop();
    }
  }
  return grid;
}