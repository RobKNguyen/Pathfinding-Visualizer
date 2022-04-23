import React, { useState, useEffect, useRef } from "react";
import onClickOutside from 'react-onclickoutside';


function MazeDropdown ({ title, items=[], multiSelect = false, maze_algorithm, handleMazeAlgorithmChange }) {

        const [open, setOpen] = useState(false);
        const [selection, setSelection] = useState([]);
        const toggle = () => setOpen(!open);

        MazeDropdown.handleClickOutside = () => setOpen(false);

        function handleOnClick(item) {
            console.log(item);
            handleMazeAlgorithmChange(item);
            if(!selection.some(current => current.id === item.id)) {
                if(!multiSelect) {
                    setSelection([item]);
                } else if (multiSelect) {
                    setSelection([...selection, item]);
                }
            } else {
                let selectionAfterRemoval = selection;
                selectionAfterRemoval = selectionAfterRemoval.filter(
                    current => current.id !== item.id
                );
                setSelection([...selectionAfterRemoval]);
            }
        }

        function isItemSelected(item) {
            if (selection.find(current => current.id === item.id)) {
                return true;
            }
            return false;
        }

        return (
            <div className="dd-wrapper">
                <div
                    tabIndex={0}
                    className="dd-header"
                    role="button" onKeyPress={() => toggle(!open)}
                    onClick={() => toggle(!open)}
                >
                    <div className="dd-header-__title">
                        <p className="dd-header__title--bold">{title.toUpperCase()}</p>
                    </div>
                    <div className="dd-header__action">
                        <p>{open ? 'Close' : 'Open'}</p>
                    </div>
                </div>
                {open && (
                    <ul className="dd-list">
                        {items.map(item => (
                            <li className="dd-list-item" key={item.id}>
                                <button type="button" onClick={() => handleOnClick(item)}>
                                    <span>{item.value}</span>
                                    <span>{isItemSelected(item) && 'Selected'}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
}

const clickOutsideConfig = {
    handleClickOutside: () => MazeDropdown.handleClickOutside
}

export default onClickOutside(MazeDropdown, clickOutsideConfig);