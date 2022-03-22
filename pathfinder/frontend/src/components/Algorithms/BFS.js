export function BFS(grid, start_node, finish_node) {
    // console.log(grid);
    const visitedOrdered = [];
    let node_queue = [];
    node_queue.push(start_node);
    visitedOrdered.push(start_node);
    // console.log(node_queue);
    //console.log(visitedOrdered);
    const directions = [[1,0], [0,1], [-1,0], [0,-1]];
    while(node_queue.length != 0) {
        const current = node_queue.shift();
        if (current == finish_node) {
            //console.log(`${finish_node.col} == ${current.col}. WE DID IT`);
            visitedOrdered.push(current);
            break;
        }
        if (current == finish_node) {
            visitedOrdered.push()
            break;
        }
        for (const dir  of directions) {
            //console.log(`${dir[0]}, ${dir[1]}`);
            const adjRow = current.row + dir[0];
            const adjCol = current.col + dir[1];

            // console.log(`${adjRow}, ${adjCol}`);
            // console.log(grid[adjRow][adjCol]);
            // console.log(visitedOrdered.includes(grid[adjRow][adjCol]));
            if (isValid(visitedOrdered, grid, adjRow, adjCol)) {
                node_queue.push(grid[adjRow][adjCol]);
                visitedOrdered.push(grid[adjRow][adjCol]);
                if (grid[adjRow][adjCol] == finish_node) {
                    node_queue = []
                    break;
                }
                
            }
        }
        
    }
    return visitedOrdered;
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