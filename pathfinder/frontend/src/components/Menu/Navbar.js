import React, { Component} from "react";

export default class Navbar extends Component {



        render() {
            const {
                onClick,
                handleChangeStarter
            } = this.props;
            return (
                <>
                <h1>Navbar</h1>
                <button
                    className="bfs"
                    onClick={() => onClick()}
                >Breadth-First Search</button>
                <button
                    className="clicker"
                    onClick={() => handleChangeStarter()}
                >Change Starter</button>
                </>
            );
        }

}
    