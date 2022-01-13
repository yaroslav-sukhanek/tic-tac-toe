import './App.css';
import Field from "./components/Field";
import {useState} from "react";
import AI from "./AI";

function App() {
    const defaultFields = [
        {id: 1, active: false, player: null, winner: false},
        {id: 2, active: false, player: null, winner: false},
        {id: 3, active: false, player: null, winner: false},
        {id: 4, active: false, player: null, winner: false},
        {id: 5, active: false, player: null, winner: false},
        {id: 6, active: false, player: null, winner: false},
        {id: 7, active: false, player: null, winner: false},
        {id: 8, active: false, player: null, winner: false},
        {id: 9, active: false, player: null, winner: false}
    ]
    const [winnerExist, setWinnerExist] = useState(false)
    const [fields, setFields] = useState(defaultFields)

    const onClick = (field) => {
        if (winnerExist) return

        const mutableFields = [...fields]
        mutableFields.map(f => {
            if (f.id === field.id) {
                return field;
            }
            return f;
        })
        setFields(mutableFields)
        onAITurn()
    }

    const onAITurn = () => {
        const [winnerExist, aiUpdatedFields] = AI.newTurn(fields)
        if (aiUpdatedFields) {
            setFields(aiUpdatedFields)
        }

        if (winnerExist) {
            setWinnerExist(true)
            const mutableFields = [...fields]
            const winnerLine = AI.getWinnerLineIfExists(mutableFields)
            if (winnerLine) {
                mutableFields.map(field => {
                    if (winnerLine.includes(field.id)) {
                        field.winner = true
                    }
                    return field
                })
                setFields(mutableFields)
            }
        }
    }

    const reset = () => {
        setFields(defaultFields)
        setWinnerExist(false)
    }

    return (
        <div className="App">
            {fields.map((field) => {
                return <Field data={field} key={field.id} onClick={onClick}/>
            })}
            {winnerExist && <>
                <h1 className='game-over'>Game over</h1>
                <button onClick={reset} className='try-again'>Try again!</button>
            </>}
        </div>
    );
}

export default App;
