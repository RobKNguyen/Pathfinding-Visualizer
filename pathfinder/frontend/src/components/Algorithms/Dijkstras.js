export function dijkstras(grid, start_node, finish_node) {


    const visited_nodes = [];
    let node_queue = [];
    start_node.distance = 0;
    node_queue.push(start_node);

    while(node_queue.length != 0) {
        const current = node_queue.shift();
        if (current === finish_node) {
            visited_nodes.push(current);
            current.isVisted = true;
            break;
        }
        let neighbors = getNeighbors(grid, current, visited_nodes, finish_node);
        
        for (const item of neighbors) {
            if (item.distance === Infinity) {
                item.distance = current.distance + 1;
                item.previousNode = current;
            } else {
                if (item.distance > current.distance + 1) {
                    item.distance = current.distance + 1;
                    item.previousNode = current;
                }
            }
            if (!node_queue.includes(item)) {
                node_queue.push(item);
            }
        }
        visited_nodes.push(current);
        current.isVisited = true;

    }
    return visited_nodes;
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

function getAllUnvisitedNodes(grid) {
    const nodeArray =[];
    grid.map(function(row) {
        row.map(function(node) {
            nodeArray.push(node);
        }) 
    })
    return nodeArray;
}

export function getShortestPathDijkstras(finishNode) {
    const nodesShortestPathOrder = [];
    let currentNode = finishNode;
    while(currentNode !== null) {
        nodesShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesShortestPathOrder;
}