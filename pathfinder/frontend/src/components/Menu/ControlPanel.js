import React, { Component} from "react";
import Dropdown from "./Dropdown";
import MazeDropdown from "./MazeDropdown";

const MAX_ROW = 80;
const MAX_COL = 80;
const MIN_ROW = 5;
const MIN_COL = 5;

export default class ControlPanel extends Component {


        constructor(props) {
            super(props);
        }
        

        handleEnterSliderThumb(e) {
            // console.log(e.currentTarget.id);
            const index = String(e.currentTarget.id).charAt(String(e.currentTarget.id).length - 1);
            // console.log(document.getElementById(`tooltip-${index}`));
            document.getElementById(`tooltip-${index}`).style.display="block";
            // console.log(`tooltip-${index}`);
        }

        handleLeaveSliderThumb(e) {
            const index = String(e.currentTarget.id).charAt(String(e.currentTarget.id).length - 1);
            document.getElementById(`tooltip-${index}`).style.display="none";
            // console.log(`Leaving tooltip-${index}`);
            // console.log(e.currentTarget);
            
        }

        componentDidMount(){
            // console.log(document.querySelectorAll(".range-slider"));
            const container = document.querySelectorAll(".range-slider");

            for (let i = 0; i < container.length; i++) {
                const slider = container[i].querySelector(".slider");
                const thumb = container[i].querySelector(".slider-thumb");
                const tooltip = container[i].querySelector(".tooltip");
                const progress = container[i].querySelector(".progress");
                function customSlider() {
                    const maxVal = slider.getAttribute("max");
                    const val = (slider.value / maxVal) * 100 + "%";
                    tooltip.innerHTML = slider.value;
                    progress.style.width = val;
                    thumb.style.left = val;
                }

                customSlider();

                slider.addEventListener("input", () => {
                    customSlider();
                })
            }
        }

        

        increaseValue(e, dimension_cap) {
            const index = (e.currentTarget.id).charAt((e.currentTarget.id).length - 1);
            var value = parseInt(document.getElementById(`number-${index}`).value, 10);
            value = isNaN(value) ? 0 : value;
            //console.log(`value: ${value} + 1 > dimension_cap: ${dimension_cap}`);
            if (index == 1) {
                if (value + 1 > MAX_ROW) return;
            } else {
                if(value + 1 > MAX_COL) return;
            }
            value++;
            document.getElementById(`number-${index}`).value = value;
            this.props.handleDimension(document.getElementById(`number-${index}`));
        }
          
        decreaseValue(e) {

            const index = (e.currentTarget.id).charAt((e.currentTarget.id).length - 1);
            //console.log(index);
            var value = parseInt(document.getElementById(`number-${index}`).value, 10);
            value = isNaN(value) ? 0 : value;
            
            if (index == 1) {
                if (value - 1 < MIN_ROW) return;
            } else {
                if(value - 1 < MIN_COL) return;
            }
            value < 1 ? value = 1 : '';
            value--;
            document.getElementById(`number-${index}`).value = value;
            this.props.handleDimension(document.getElementById(`number-${index}`));
        }


        render() {
            const {
                handleRangeChange,
                start_row,
                start_col,
                finish_row,
                finish_col,
                row_dimension,
                col_dimension,
                handleSlider,
                pathfinding_algorithm,
                handleDimension,
                handleBFS,
                handleDijkstras,
                handleAlgorithmChange,
                handleClearGrid,
                handleDFS,
                handleMazeDFS,
                handleMazeAlgorithmChange,
                maze_algorithm,
                handleMazeKruskals,
                handleAStar
            } = this.props;
            return (
                <>
                <div className="container">
                    <div className="title">Control Panel</div>
                    <form action="#">
                        <div className="user-details">
                        <div className="half-flex-container">
                        <div className="input-box">
                                <div className="value-slider">
                                    <div className="vertical-flex">
                                    <span className="details">Rows</span>
                                        <div>
                                            <div className="value-button" id="decrease-1" onClick={(e) => this.decreaseValue(e)}>-</div>
                                                <input type="number" id="number-1" defaultValue={row_dimension} max={row_dimension} className="grid-dimension"
                                                onChange={(e) => handleDimension(e.target)}/>
                                            <div className="value-button" id="increase-1" onClick={(e) => this.increaseValue(e, row_dimension)}>+</div>
                                        </div>
                                    </div>
                                    <div className="vertical-flex">
                                        <span className="details">Columns</span>
                                        <div>
                                        <div className="value-button" id="decrease-2" onClick={(e) => this.decreaseValue(e)}>-</div>
                                            <input type="number" id="number-2" defaultValue={col_dimension} max={col_dimension} className="grid-dimension"
                                            onChange={(e) => handleDimension(e.target)}/>
                                        <div className="value-button" id="increase-2" onClick={(e) => this.increaseValue(e, col_dimension)}>+</div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>


                            <div className="clear-grid-button" onClick={() => handleClearGrid()}>
                                <p>Clear Grid</p>
                            </div>
                            </div>

                            <div className="input-box">
                                <span className="details">Start Node:</span>
                                <div className="value-slider">
                                        <input type="text" defaultValue={start_row} required className="start-node row" onChange={(e) => handleRangeChange(e)}/>


                                        <div id="range-slider-1" className="range-slider"
                                            onMouseEnter={(e) => this.handleEnterSliderThumb(e)}
                                            onMouseLeave={(e) => this.handleLeaveSliderThumb(e)}>
                                            <input type="range" min="0" max={row_dimension-1} defaultValue={start_row} className="slider" id="slider-1"
                                                onChange={(e) => handleSlider(e)} />
                                                <div id="slider-thumb-1" className="slider-thumb">
                                                    <div id="tooltip-1" className="tooltip"></div>
                                                </div>
                                                <div id="progress-1" className="progress"></div>
                                        </div>
                                </div>
                                <div className="value-slider">
                                        <input type="text" defaultValue={start_col} required className="start-node col" onChange={(e) => handleRangeChange(e)}/>


                                        <div id="range-slider-2" className="range-slider"
                                            onMouseEnter={(e) => this.handleEnterSliderThumb(e)}
                                            onMouseLeave={(e) => this.handleLeaveSliderThumb(e)}>
                                            <input type="range" min="0" max={col_dimension-1} defaultValue={start_col} className="slider" id="slider-2"
                                                onChange={(e) => handleSlider(e)} />
                                                <div id="slider-thumb-2" className="slider-thumb">
                                                    <div id="tooltip-2"className="tooltip"></div>
                                                </div>
                                                <div id="progress-2" className="progress"></div>
                                        </div>
                                </div>
                            </div>

                            <div className="input-box">
                                <span className="details">End Node:</span>
                                <div className="value-slider">
                                        <input type="text" defaultValue={finish_row} required className="finish-node row" onChange={(e) => handleRangeChange(e)}/>


                                        <div id="range-slider-3" className="range-slider"
                                            onMouseEnter={(e) => this.handleEnterSliderThumb(e)}
                                            onMouseLeave={(e) => this.handleLeaveSliderThumb(e)}>
                                            <input type="range" min="0" max={row_dimension-1} defaultValue={finish_row} className="slider" id="slider-3"
                                                onChange={(e) => handleSlider(e)} />
                                                <div id="slider-thumb-3" className="slider-thumb">
                                                    <div id="tooltip-3" className="tooltip"></div>
                                                </div>
                                                <div id="progress-3" className="progress"></div>
                                        </div>
                                </div>
                                <div className="value-slider">
                                        <input type="text" defaultValue={finish_col} required className="finish-node col" onChange={(e) => handleRangeChange(e)}/>


                                        <div id="range-slider-4" className="range-slider"
                                            onMouseEnter={(e) => this.handleEnterSliderThumb(e)}
                                            onMouseLeave={(e) => this.handleLeaveSliderThumb(e)}>
                                            <input type="range" min="0" max={col_dimension-1} defaultValue={finish_col} className="slider" id="slider-4"
                                                onChange={(e) => handleSlider(e)} />
                                                <div className="slider-thumb">
                                                    <div id="tooltip-4"className="tooltip"></div>
                                                </div>
                                                <div id="progress-4" className="progress"></div>
                                        </div>
                                </div>
                            </div>

                            

                            <div className="dropdown-box">
                                <div className="dropdown-button">
                                <span className="details">Search Algorithm</span>
                                <Dropdown
                                    title={pathfinding_algorithm}
                                    items={items}
                                    pathfinding_algorithm={pathfinding_algorithm}
                                    handleAlgorithmChange={handleAlgorithmChange}
                                    />
                                </div>
                            </div>


                            <div className="button">
                                <input type="submit" value={`ANIMATE ${pathfinding_algorithm.toUpperCase()}`} onClick={() => {(pathfinding_algorithm === "bfs" ? handleBFS() : (pathfinding_algorithm === "dijkstras") ? handleDijkstras() : (pathfinding_algorithm === "astar") ? handleAStar() : handleDFS())}}></input>
                            </div>

                            <div className="dropdown-box">
                                <div className="dropdown-button">
                                <span className="details">Random Maze Algorithm</span>
                                <MazeDropdown
                                    title={maze_algorithm}
                                    items={maze_items}
                                    maze_algorithm={maze_algorithm}
                                    handleMazeAlgorithmChange={handleMazeAlgorithmChange}
                                    />
                                </div>
                            </div>

                            <div className="button">
                                <input type="submit" value={`GENERATE ${maze_algorithm.toUpperCase()}`} onClick={() => {(maze_algorithm === "dfs" ? handleMazeDFS() : (maze_algorithm === "kruskals") ? handleMazeKruskals() : handleMazeKruskals())}}></input>
                            </div>

                        </div>
                        

                        
                    </form>

                </div>
                
                </>
            );
        }

}

const items = [
    {
        id: 1,
        value: 'BFS'
    },
    {
        id: 2,
        value: "DFS"
    },
    {
        id: 3,
        value: "Dijkstras"
    },
    {
        id: 4,
        value: "AStar"
    }
]

const maze_items = [
    {
        id: 1,
        value: 'Kruskals'
    },
    {
        id: 2,
        value: "DFS"
    },
    {
        id: 3,
        value: "Recursive Division"
    },
    {
        id: 4,
        value: "Search and Kill"
    }
]