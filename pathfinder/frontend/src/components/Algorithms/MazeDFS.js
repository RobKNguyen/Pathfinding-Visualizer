import { withEmotionCache } from "@emotion/react";

export function MazeDFS(grid, start_node, finish_node) {

    // visited.push(start_node);
    // start_node.isVisited=true;
    // const directions = [[0,-1], [-1,0], [0,1], [1,0]];
    // const x = current.row;
    // const y = current.col;
    grid.map( function(row) {
        return row.map( function (cell ) {
          
          cell.isWall = true;
          return;
        })
      });

    grid[start_node.row][start_node.col].isStart = false;
    grid[1][1].isStart=true;
    grid[finish_node.row][finish_node.col].isFinish=false;
    grid[grid.length-2][grid[0].length-2].isFinish=true;

    start_node = grid[1][1];

    const node_stack = [];
    const visited = []
    node_stack.push(start_node);
    visited.push(start_node);

    grid[start_node.row][start_node.col].isWall = false;

    while(node_stack.length != 0) {
        const curr = node_stack[node_stack.length - 1];
        curr.isWall = false;
        console.log(`current: (${curr.row}, ${curr.col})`);
        node_stack.pop();
        visited.push(curr);
        let neighbors = getNeighbors(grid, curr, visited, finish_node);
        // for (const neighbor of neighbors) {
        //     console.log(`\tneighbors: (${neighbor.row}, ${neighbor.col})`)
        // }
        let between_neighbors = get_in_between(grid, curr, neighbors);
        if (neighbors.length != 0) {
            const random_int = Math.floor(Math.random() * neighbors.length);

            //console.log(`\t\tCHOOSING: (${neighbors[random_int].row}, ${neighbors[random_int].col})`);
            for (let i = 0; i < neighbors.length; i++) {
                //visited.push(neighbors[i]);
                if (i != random_int) {
                    if (node_stack.includes(neighbors[i])){
                        //node_stack.splice(node_stack.indexOf(neighbors[i]), 1);
                        continue;
                    } else {
                        node_stack.push(neighbors[i]);
                    }
                }
            }
            // console.log(node_stack);
            const in_between = fill_in_between(grid, curr, neighbors[random_int]);
            grid[in_between.row][in_between.col].isWall=false;
            if (node_stack.includes(neighbors[random_int])){
                node_stack.splice(node_stack.indexOf(neighbors[random_int]), 1);
            }
            node_stack.push(neighbors[random_int]);
            //console.log(`\t\tfilling in: (${grid[in_between.row][in_between.col].row}, ${grid[in_between.row][in_between.col].col})`)
            grid[neighbors[random_int].row][neighbors[random_int].col].isWall=false;
        } else {
            // for (const node of node_stack) {
            //     console.log(`node: (${node.row}, ${node.col})`)
            // }
            // console.log(visited[visited.length-1]);
            // console.log(visited[visited.length-2]);
            // console.log(node_stack[node_stack.length-1]);
            // console.log(node_stack[node_stack.length-2]);

            let counter = visited.length-1;
            console.log(`visited[counter]: (${visited[counter].row}, ${visited[counter].col}) `);
            console.log(visited[counter]);
            while (counter > 0) {
                console.log(`counter: ${counter}`);
                let bt_neighbors = getNeighbors(grid, visited[counter], visited, finish_node);
                if (bt_neighbors.includes(node_stack[node_stack.length-1])) {
                    console.log(`linked: ${visited[counter]} to ${node_stack[node_stack.length-1]}`);
                    const bt_between = fill_in_between(grid, visited[counter], node_stack[node_stack.length-1]);
                    grid[bt_between.row][bt_between.col].isWall=false;
                    break;
                }
                counter--;
                //break;
            }
            // for (const bt_neighbor of bt_neighbors) {
            //     console.log(`neighbor: (${bt_neighbor.row}, ${bt_neighbor.col})`);
            // }
            
                
                
        }
    }

    return grid;
}

function fill_in_between(grid, current, neighbor) {
    let result;
    if (neighbor.row > current.row) {
        result = grid[current.row+1][current.col];
    } else if (neighbor.row < current.row) {
        result = grid[current.row-1][current.col];
    } else if (neighbor.col > current.col) {
        result = grid[current.row][current.col+1];
    } else if (neighbor.col < current.col) {
        result = grid[current.row][current.col-1];
    }
    return result;
}

function get_in_between(grid, current, neighbors) {
    const in_between = [];
    for (const neighbor of neighbors) {
        if (neighbor.row > current.row) {
            in_between.push(grid[current.row+1][current.col]);
        } else if (neighbor.row < current.row) {
            in_between.push(grid[current.row-1][current.col]);
        } else if (neighbor.col > current.col) {
            in_between.push(grid[current.row][current.col+1]);
        } else if (neighbor.col < current.col) {
            in_between.push(grid[current.row][current.col-1]);
        }
    }
    return in_between;
}

function getNeighbors(grid, current_node, visited, finish_node) {
    //console.log(current_node);
    const directions = [[-2,0],[0,-2],[2,0],[0,2]];
    const {row, col} = current_node;
    const neighbors = [];
    directions.map(function(dir) {
        if(isValid(grid, row+dir[0],col+dir[1])) {
            if (!visited.includes(grid[row+dir[0]][col+dir[1]])) {
                //neighbors.push(grid[row+dir[0]-1][col+dir[1]-1])
                neighbors.push(grid[row+dir[0]][col+dir[1]]);
                
            }
        }
    });
    return neighbors;
}

function isValid(grid,row,col) {
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length){
        return false;
    }
    if (grid[row][col].isWall == false) {
        return false;
    }
    return true;
}