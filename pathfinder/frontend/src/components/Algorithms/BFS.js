// Main BFS function:
export function BFS(grid, start_node, finish_node) {

    const visitedOrdered = [];
    let node_queue = [];
    visitedOrdered.push(start_node);
    node_queue.push(start_node);
    const directions = [[1,0], [0,1], [-1,0], [0,-1]];
    node_queue[0].distance = 0;

    while(node_queue.length != 0) {
        const current = node_queue.shift();
        if (current == finish_node) {
            visitedOrdered.push(current);
            break;
        }

        for (const dir  of directions) {
            const adjRow = current.row + dir[0];
            const adjCol = current.col + dir[1];

            if (isValid(visitedOrdered, grid, adjRow, adjCol)) {
                node_queue.push(grid[adjRow][adjCol]);
                visitedOrdered.push(grid[adjRow][adjCol]);
                updateUnvisitedNeighbors(current, grid[adjRow][adjCol], grid);
                
                if (grid[adjRow][adjCol] == finish_node) {
                    node_queue = []
                    break;
                }
            }
        }
        
    }
    return visitedOrdered;
}

function updateUnvisitedNeighbors(node, neighbor, grid) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
}

export function getShortestPathBFS(finishNode) {
    const nodesShortestPathOrder = [];
    let currentNode = finishNode;
    while(currentNode !== null) {
        nodesShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesShortestPathOrder;
}



function isValid(visited,grid, row, col) {
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length){
        return false;
    }
    if (visited.includes(grid[row][col])){
        return false;
    }
    if (grid[row][col].isWall) {
        return false;
    }
    return true;
}

