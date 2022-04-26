export function MazeKruskals(grid, start_node, finish_node) {

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
    const visited = [];
    const MST = [];

    grid[start_node.row][start_node.col].isWall = false;
    grid[finish_node.row][finish_node.col].isWall = false;

    for (let i = 1; i < grid.length; i += 2) {
        for (let j = 1; j < grid[i].length; j += 2) {
            node_stack.push(grid[i][j]);
        }
    }

    // console.log(`count: ${node_stack.length}`);

    while(node_stack.length != 0) {
        // -- Randomly Select Current from node_stack -- //
        const random_int = Math.floor(Math.random() * node_stack.length);
        const curr = node_stack[random_int];
        grid[curr.row][curr.col].isWall=false;
        visited.push(curr);
        // ----------------------------------------------------------- //

        const curr_set_index = belongs_to_set(curr, MST);
        if (curr_set_index != -1) {
            const curr_set = MST[curr_set_index];

            const neighbors = getNeighbors(grid, curr, curr_set, finish_node);

            if (neighbors.length != 0) {

                const random_neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                const between = fill_in_between(grid, curr, random_neighbor);
                grid[curr.row][curr.col].isWall=false;
                grid[between.row][between.col].isWall = false;
                grid[random_neighbor.row][random_neighbor.col].isWall = false;
                visited.push(grid[between.row][between.col]);
                visited.push(grid[random_neighbor.row][random_neighbor.col]);
                const random_neighbor_index = belongs_to_set(random_neighbor, MST);
                if (random_neighbor_index != -1 && random_neighbor_index != curr_set_index) {
                    const new_curr_mst = MST[curr_set_index].slice();
                    const new_neighbor_set = MST[random_neighbor_index].slice();
                    const new_set = [...new_curr_mst, ...new_neighbor_set];
                    MST.splice(belongs_to_set(curr, MST), 1);
                    MST.splice(belongs_to_set(random_neighbor, MST), 1);
                    MST.push(new_set);

                } else if (random_neighbor_index == -1){
                    MST[curr_set_index].push(random_neighbor);
                }
            }
        }
        else if (curr_set_index === -1) {
            // -- Begin Option 2 --
            // -- current is not in a set. Select any neighbor that is valid --
            // -- and create a path towards that neighbor. --
            const new_spanning_tree = [];
            new_spanning_tree.push(curr);
            const neighbors = getNeighbors(grid, curr, [], finish_node);
            if (neighbors.length != 0) {
                const random_neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                const between = fill_in_between(grid, curr, random_neighbor);
                grid[curr.row][curr.col].isWall=false;
                grid[between.row][between.col].isWall = false;
                grid[random_neighbor.row][random_neighbor.col].isWall = false;
                visited.push(grid[between.row][between.col]);
                visited.push(grid[random_neighbor.row][random_neighbor.col]);
                // console.log(`(${curr.row}, ${curr.col}) ----> (${random_neighbor.row}, ${random_neighbor.col})`);
                new_spanning_tree.push(random_neighbor);
                if (belongs_to_set(random_neighbor, MST) != -1) {
                    curr_set_index= belongs_to_set(random_neighbor, MST);
                    MST[curr_set_index].push(curr);
                } else {
                    MST.push(new_spanning_tree);
                }
            }
            // console.log(new_spanning_tree);
            // -- End Option 2 --
        }

        node_stack.splice(random_int, 1);
    }
    // console.log(`MST SIZE: ${MST.length}`);
    const mst_node_visited = [];
    while(MST.length > 1) {
        const curr_mst_index = 0;
        const neighboring_mst_info = find_other_mst(grid, curr_mst_index, MST);
        const current_mst_connect = neighboring_mst_info[0];
        const neighbor_of_closest_mst = neighboring_mst_info[1];
        const in_between = fill_in_between(grid, current_mst_connect, neighbor_of_closest_mst);
        grid[in_between.row][in_between.col].isWall=false;
        visited.push(grid[in_between.row][in_between.col]);

        if (neighbor_of_closest_mst != null){
        // console.log(`neighbor of closest mst: ${neighbor_of_closest_mst.row}, ${neighbor_of_closest_mst.col}`);
        const neighbor_mst_index = belongs_to_set(neighbor_of_closest_mst, MST);
        const current_mst = MST[curr_mst_index].slice();
        const neighboring_mst = MST[neighbor_mst_index].slice();

        MST.splice(0, 1);
        MST.splice(belongs_to_set(neighbor_of_closest_mst, MST), 1);
        const new_set = [...current_mst, ...neighboring_mst];

        MST.push(new_set);
        } else {
            MST.splice(0, 1);
        }
        // console.log(`MST SIZE: ${MST.length}`);
    }
    return [grid, visited];
}

function find_other_mst(grid, curr_mst_index, MST) {
    for (const node of MST[curr_mst_index]) {
        const neighbors = getNeighbors(grid, node, MST[curr_mst_index], node);
        for (const neighbor of neighbors) {
            if (belongs_to_set(neighbor, MST) != belongs_to_set(node, MST)) {
                // console.log(`MST LINK : (${node.row}, ${node.col}) -> (${neighbor.row}, ${neighbor.col})`);
                return [node, neighbor];
            }
        }
    }
    return null;
}

function belongs_to_set(current, mst) {
    for (let i = 0; i < mst.length; i++) {
        if (mst[i].includes(current)) {
            // console.log(mst[i]);
            return i;
        }
    }
    return -1;
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

function getNeighbors(grid, current_node, curr_set, finish_node) {
    //console.log(current_node);
    const directions = [[-2,0],[0,-2],[2,0],[0,2]];
    const {row, col} = current_node;
    const neighbors = [];
    directions.map(function(dir) {
        if(isValid(grid, row+dir[0],col+dir[1])) {
            if (!curr_set.includes(grid[row+dir[0]][col+dir[1]])) {
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
    // if (grid[row][col].isWall == false) {
    //     return false;
    // }
    return true;
}