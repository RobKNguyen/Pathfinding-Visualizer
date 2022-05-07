import React, {Component, useRef} from 'react';

// import './Node.css';

export default class Node extends Component {


  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
      row
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';
    return (
      <div
        id={`node-${row}-${col}`}
        className={(isWall) ? `node-wall` : `node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col, this)}
        onMouseEnter={() => onMouseEnter(row, col, this)}
        onMouseLeave={() => onMouseLeave(row, col)}
        onMouseUp={() => onMouseUp()}
        ></div>
    );
  }
}