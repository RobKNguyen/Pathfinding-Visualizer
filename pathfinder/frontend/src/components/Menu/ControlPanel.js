import React, { Component} from "react";

export default class ControlPanel extends Component {
        


        render() {
            const {
                
            } = this.props;
            return (
                <>
                <div className="control-form">
                <form>
                    <label>Start Node:</label>
                    <input type="text"></input>
                    <input type="range"></input>
                    <input type="text"></input>
                    <input type="range"></input>
                    <label>End Node:</label>
                    <input type="text"></input>
                    <input type="range"></input>
                    <input type="text"></input>
                    <input type="range"></input>
                </form>
                </div>
                </>
            );
        }

}