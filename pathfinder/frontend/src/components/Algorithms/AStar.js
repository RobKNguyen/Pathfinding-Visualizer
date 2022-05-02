export function A_STAR(grid, start_node, finish_node) {


    const visited_nodes = [];
    const node_dict = {};
    grid[start_node.row][start_node.col].distance = 0;
    const heuristic_values = {};

    // Get heuristic for all nodes (hypotenuse distance to finish node)
    for (const row of grid) {
        for (const node of row) {
            heuristic_values[`node-${node.row}-${node.col}`] = heuristicValue(grid, node, finish_node);
        }
    }

    node_dict[`node-${start_node.row}-${start_node.col}`] = start_node.distance + heuristic_values[`node-${start_node.row}-${start_node.col}`];

    while(Object.keys(node_dict).length != 0) {
        const current = getMinimumFValue(node_dict);
        const current_row = current.split('-')[1];
        const current_col = current.split('-')[2];
        const current_node = grid[current_row][current_col];
        delete node_dict[`node-${current_row}-${current_col}`];

        if (current_node === finish_node){
            visited_nodes.push(current_node);
            current_node.isVisited = true;
            break;
        }
        const neighbors = getNeighbors(grid, current_node, visited_nodes, finish_node);
        for (const neighbor of neighbors) {
            if (neighbor.distance === Infinity) {
                neighbor.distance = current_node.distance + 10;
                neighbor.previousNode = current_node;
            } else {
                if (neighbor.distance > current_node.distance + 10) {
                    neighbor.distance = current_node.distance + 10;
                    neighbor.previousNode = current_node;
                }
            }

            if (!node_dict.hasOwnProperty(`node-${neighbor.row}-${neighbor.col}`)) {
                // console.log(`${neighbor.distance} + ${heuristic_values[neighbor]}`);
                node_dict[`node-${neighbor.row}-${neighbor.col}`] = neighbor.distance + heuristic_values[`node-${neighbor.row}-${neighbor.col}`];
            } else {
                node_dict[`node-${neighbor.row}-${neighbor.col}`] = neighbor.distance + heuristic_values[`node-${neighbor.row}-${neighbor.col}`];
            }
        }
        visited_nodes.push(current_node);
        current_node.isVisited = true;
    }

    return visited_nodes;
}

function getMinimumFValue(node_dict) {
    // console.log(`${JSON.stringify(node_dict)}`);
    let minimum = Number.MAX_SAFE_INTEGER;
    let result = null;
    //console.log(JSON.stringify(node_dict));
    Object.keys(node_dict).forEach(function(key) {
        // console.log(`${key}: ${node_dict[key]}`);
        if (node_dict[key] < minimum) {
            minimum = node_dict[key];
            result = key;
        }
    });
    // console.log(`result is: ${result}`);
    return result;
}

function getNeighbors(grid, current_node, visited, finish_node) {
    const directions = [[-1,0],[0,-1],[1,0],[0,1]];
    const {row, col} = current_node;
    const neighbors = [];
    directions.map(function(dir) {
        if(isValid(grid, row+dir[0],col+dir[1])) {
            if (!visited.includes(grid[row+dir[0]][col+dir[1]])) {
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
    if (grid[row][col].isWall) {
        return false;
    }
    return true;
}

function heuristicValue(grid, curr, finish_node) {
    return Math.floor(Math.sqrt(Math.pow((finish_node.row - curr.row), 2) + Math.pow((finish_node.col - curr.col), 2)) * 10);
}


export function getShortestPathAStar(finishNode) {
    const nodesShortestPathOrder = [];
    let currentNode = finishNode;
    while(currentNode !== null) {
        nodesShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesShortestPathOrder;
}