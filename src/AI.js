export default class AI {

    static getWinConditions() {
        return [
            [1,2,3],
            [4,5,6],
            [7,8,9],
            [1,4,7],
            [2,5,8],
            [3,6,9],
            [1,5,9],
            [3,5,7]
        ]
    }

    static getPlayerTurns(fields, player) {
        const turns = []
        fields.forEach(f => {
            if (f.active && f.player === player) {
                turns.push(f.id)
            }
        })
        return turns.sort()
    }

    static findPlayerPossibleWins(fields, player) {
        const playerTurns = this.getPlayerTurns(fields, player)
        const winConditions = this.getWinConditions()
        const playerWinConditions = []
        winConditions.forEach(wc => {
            const wcCandidate = playerTurns.filter(turn => wc.includes(turn))
            let wcCandidateHasEmptyField = false
            for (const i in wc) {
                const field = this.getFieldById(wc[i], fields)
                if (!field.active) {
                    wcCandidateHasEmptyField = true
                    break
                }
            }
            if (wcCandidate.length > 1 && wcCandidateHasEmptyField) {
                playerWinConditions.push(wc)
            }
        })
        return playerWinConditions
    }

    static completeWinCondition(fields, winCondition) {
        let canComplete = false
        fields.map(f => {
            if (winCondition.includes(f.id) && !f.active) {
                f.active = true
                f.player = 'AI'
                canComplete = true
            }
            return f
        })
        return [canComplete, fields]
    }

    static getPossibleTurns(fields) {
        const possibleTurns = []
        fields.forEach(f => {
            if (!f.active) {
                possibleTurns.push(f.id)
            }
        })
        return possibleTurns
    }

    static getFieldById(id, fields) {
        return fields.filter(f => f.id === id).pop()
    }

    static getWinnerLineIfExists(fields) {
        const winConditions = this.getWinConditions()

        for (const i in winConditions) {
            const winCondition = winConditions[i]
            let currentPlayer = null
            let countOfActive = 0
            for (const i in winCondition) {
                const currentId = winCondition[i]
                const field = this.getFieldById(currentId, fields)
                if (field.active && (currentPlayer === null || currentPlayer === field.player)) {
                    countOfActive++
                    currentPlayer = field.player
                }
            }
            if (countOfActive === 3) {
                return winCondition
            } else {
                currentPlayer = null
                countOfActive = 0
            }
        }
        return false
    }

    static newTurn (fields) {
        let mutableFields = [...fields]

        // проверим, не выйграл ли уже кто-нибудь
        if (this.getWinnerLineIfExists(mutableFields)) {
            return [true, null]
        }

        // найти свои возможные выйгрыши и дополнить их
        const possibleAIWins = this.findPlayerPossibleWins(mutableFields, 'AI')
        let canCompleteWin = false
        for (const i in possibleAIWins) {
            const possibleAIWin = possibleAIWins[i]
            const [canComplete, updatedFields] = this.completeWinCondition(mutableFields, possibleAIWin)
            if (canComplete) {
                canCompleteWin = true
                mutableFields = updatedFields
                break
            }
        }

        if (possibleAIWins.length > 0 && canCompleteWin) {
            return [true, mutableFields]
        }

        // найти возможный выйгрыш человека и запороть его
        const possibleHumanWins = this.findPlayerPossibleWins(mutableFields, 'HUMAN')
        let canRuinedWin = false
        for (const i in possibleHumanWins) {
            const possibleHumanWin = possibleHumanWins[i]
            const [canComplete, updatedFields] = this.completeWinCondition(mutableFields, possibleHumanWin)
            if (canComplete) {
                canRuinedWin = true
                mutableFields = updatedFields
                break
            }
        }

        if (possibleHumanWins.length > 0 && canRuinedWin) {
            return [false, mutableFields]
        } else if (possibleHumanWins.length > 0 && !canRuinedWin) {
            return [true, null]
        }

        // если своих возможных выйгрышей нет человеку пороть нечего - сходить в рандомную пустую линию
        const possibleAITurns = this.getPossibleTurns(mutableFields)
        if (possibleAITurns.length > 0) {
            const nextTurnId = possibleAITurns[Math.floor(Math.random()*possibleAITurns.length)];
            mutableFields.map(f => {
                if (f.id === nextTurnId) {
                    f.active = true
                    f.player = 'AI'
                }
                return f
            })
        } else {
            return [true, null]
        }

        return [false, mutableFields];
    }
}
