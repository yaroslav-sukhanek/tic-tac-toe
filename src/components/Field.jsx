import React from 'react';
import classes from './Field.module.css'

const Field = ({data, onClick}) => {

    const mutate = () => {
        data.active = true
        data.player = 'HUMAN'
        onClick(data)
    }

    const currentPlayer = data.player === 'AI' ? classes.x : classes.o
    let currentClass = data.active ? classes.field + ' ' + currentPlayer : classes.field
    if (data.winner) {
        currentClass += ' ' + classes.green
    }
    return (
        <div className={currentClass} onClick={mutate}>

        </div>
    );
};

export default Field;