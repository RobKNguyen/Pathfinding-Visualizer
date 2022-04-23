
// Main BFS function:
export function DFS(grid, start_node, finish_node) {

    const visited = [];
    visited.push(start_node);
    start_node.isVisited=true;
    // const directions = [[0,-1], [-1,0], [0,1], [1,0]];
    // const x = current.row;
    // const y = current.col;

    const node_queue = [];
    node_queue.push(start_node);
    
    while (node_queue.length != 0 && !visited.includes(finish_node)) {
        const curr = node_queue[node_queue.length-1];
        curr.isVisited=true;
        visited.push(curr);
        node_queue.pop();
        if (curr === finish_node) break;
        console.log(`curr: ${curr.row},${curr.col}`);
        let neighbors = getNeighbors(grid, curr, visited, finish_node);
        for (const neighbor of neighbors) {
            neighbor.previousNode = curr;
            node_queue.push(neighbor);
        }
    }

    console.log(visited);
    return visited;
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

export function getShortestPathDFS(finishNode) {
    const nodesShortestPathOrder = [];
    let currentNode = finishNode;
    while(currentNode !== null) {
        nodesShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesShortestPathOrder;
}