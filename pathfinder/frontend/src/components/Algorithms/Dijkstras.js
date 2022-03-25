export function dijkstras(grid, start_node, finish_node) {
    const visited_nodes = [];
    const node_queue = [];
    start_node.distance = 0;
    node_queue.push(start_node);
    // console.log(start_node);
    // const univisted_nodes = getAllUnvisitedNodes(grid);
    let neighbors = getNeighbors(grid, start_node);


}

function getNeighbors(grid, current_node) {
    const directions = [[-1,0],[0,-1],[1,0],[0,1]];
    const {row, col} = current_node;
    const neighbors = [];
    console.log(`(getNeighbors) ${row}, ${col}`);
    directions.map(function(dir) {
        if(isValid(grid, row+dir[0],col+dir[1])) {
            console.log(`(${row+dir[0]}, ${col+dir[1]}) is valid!`);
            neighbors.push(grid[row+dir[0]][col+dir[1]]);
        }
    });
    return neighbors.filter(neighbor => !neighbor.isVisited);


}

function isValid(grid,row,col) {
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length){
        return true;
    }
    return false;
}

function getAllUnvisitedNodes(grid) {
    const nodeArray =[];
    grid.map(function(row) {
        row.map(function(node) {
            nodeArray.push(node);
        }) 
    })
    // console.log(nodeArray);
    return nodeArray;
}
