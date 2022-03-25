import React, { Component} from "react";

export default class Navbar extends Component {



        render() {
            const {
                handleBFS,
                handleDijkstras
            } = this.props;
            return (
                <>
                <h1>Navbar</h1>
                <button
                    className="bfs"
                    onClick={() => handleBFS()}
                >Breadth-First Search</button>
                <button
                    className="dijkstras"
                    onClick={() => handleDijkstras()}
                >Change Starter</button>
                </>
            );
        }

}
