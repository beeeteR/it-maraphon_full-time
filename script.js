const gameElem = document.getElementById('game')
const fieldElem = document.getElementById('field')

let enemy = 'b'
let choicedPawn = ''
let allowsMotions = { green: [], red: [] }
let field = [
    ['b', 'x', 'b', 'x', 'b', 'x', 'b', 'x'],
    ['x', 'b', 'x', 'b', 'x', 'b', 'x', 'b'],
    ['b', 'x', 'b', 'x', 'b', 'x', 'b', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'w', 'x', 'w', 'x', 'w', 'x', 'w'],
    ['w', 'x', 'w', 'x', 'w', 'x', 'w', 'x'],
    ['x', 'w', 'x', 'w', 'x', 'w', 'x', 'w']
]

function startGame() {
    renderField()
    renderCheckers()
    addEvents()
}

function renderField() {
    for (let i = 0; i < 8; i++) {
        let row = document.createElement('div')
        row.className = 'row'
        fieldElem.insertAdjacentElement('beforeend', row)
        for (let j = 0; j < 8; j++) {
            let cell = document.createElement('div')
            cell.className = 'cell'
            cell.id = `${i}${j}`
            row.insertAdjacentElement('beforeend', cell)
        }
    }
}

function renderCheckers() {
    const rowElems = document.querySelectorAll('.row')

    field.forEach((rowField, indRow) => {

        let cellElems = rowElems[indRow].querySelectorAll('.cell')

        rowField.forEach((elRowField, indCell) => {

            let pawn = document.createElement('div')
            pawn.className = 'pawn'

            let circleInPawn = document.createElement('div')
            circleInPawn.className = 'pawn__in-circle'

            pawn.insertAdjacentElement('beforeend', circleInPawn)

            if (elRowField == 'b') {
                pawn.classList.add('black__side')
            } else if (elRowField == 'w') {
                pawn.classList.add('white__side')
            }

            if (elRowField != 'x') {
                cellElems[indCell].insertAdjacentElement('beforeend', pawn)
            }

        })
    })
}

function addEvents() {
    document.querySelectorAll('.cell').forEach(el => {
        el.addEventListener('mouseover', e => {
            checkPos(getCell(e.target))
        })

        el.addEventListener('click', e => {
            const clickedCell = getCell(e.target)
            if (clickedCell.childNodes[0]) {
                choicePawn(clickedCell)
            } else {
                movePawn(clickedCell)
            }
        })
    })
}

function getCell(el) {
    if (Array.from(el.classList).includes('cell')) {
        return el
    } else {
        return getCell(el.parentElement)
    }
}

function nullableCells() {
    document.querySelectorAll('.cell').forEach(el => {
        el.innerHTML = ''
    })

    renderCheckers()
}

function checkPos(trg) {
    document.querySelector('.hovered__cell')?.classList.remove('hovered__cell')

    const hoveredRow = Number(trg.id[0])
    const hoveredCol = Number(trg.id[1])

    allowsMotions.green = []
    allowsMotions.red = []

    const trgChild = trg.childNodes[0]

    if (trgChild) {
        if (Array.from(trgChild.classList).indexOf('white__side') != -1) {

            if (checkCell(hoveredRow - 1, hoveredCol - 1) == 'x') {
                allowsMotions.green.push([hoveredRow - 1, hoveredCol - 1])
            }
            if (checkCell(hoveredRow - 1, hoveredCol + 1) == 'x') {
                allowsMotions.green.push([hoveredRow - 1, hoveredCol + 1])
            }

            if (checkCell(hoveredRow - 1, hoveredCol - 1) == enemy) {
                if (checkCell(hoveredRow - 2, hoveredCol - 2) == 'x') {
                    allowsMotions.red.push([hoveredRow - 1, hoveredCol - 1])
                    allowsMotions.green.push([hoveredRow - 2, hoveredCol - 2])
                }
            }
            if (checkCell(hoveredRow - 1, hoveredCol + 1) == enemy) {
                if (checkCell(hoveredRow - 2, hoveredCol + 2) == 'x') {
                    allowsMotions.red.push([hoveredRow - 1, hoveredCol + 1])
                    allowsMotions.green.push([hoveredRow - 2, hoveredCol + 2])
                }
            }

            if (checkCell(hoveredRow + 1, hoveredCol - 1) == enemy) {
                if (checkCell(hoveredRow + 2, hoveredCol - 2) == 'x') {
                    allowsMotions.red.push([hoveredRow + 1, hoveredCol - 1])
                    allowsMotions.green.push([hoveredRow + 2, hoveredCol - 2])
                }
            }
            if (checkCell(hoveredRow + 1, hoveredCol + 1) == enemy) {
                if (checkCell(hoveredRow + 2, hoveredCol + 2) == 'x') {
                    allowsMotions.red.push([hoveredRow + 1, hoveredCol + 1])
                    allowsMotions.green.push([hoveredRow + 2, hoveredCol + 2])
                }
            }
        }
    }

    if (allowsMotions.green.length != 0) {
        trg.classList.add('hovered__cell')
    }
}

function choicePawn(trg) {
    if (Array.from(trg.classList).indexOf('hovered__cell') != -1) {
        document.querySelector('.choiced__cell')?.classList.remove('choiced__cell')

        trg.classList.add('choiced__cell')
        choicedPawn = [Number(trg.id[0]), Number(trg.id[1])]
        illuminateCells()
    }
}

function illuminateCells() {
    document.querySelectorAll('.allowed__cell').forEach(el => {
        el.classList.remove('allowed__cell')
    })

    document.querySelectorAll('.kill__cell').forEach(el => {
        el.classList.remove('kill__cell')
    })

    allowsMotions.green.forEach(coords => {
        document.getElementById(`${coords[0]}${coords[1]}`).classList.add('allowed__cell')
    })

    allowsMotions.red.forEach(coords => {
        document.getElementById(`${coords[0]}${coords[1]}`).classList.add('kill__cell')
    })
}

function movePawn(trg) {

    if (Array.from(trg.classList).indexOf('allowed__cell') != -1) {
        const newRow = Number(trg.id[0])
        const newCol = Number(trg.id[1])

        if (choicedPawn[0] - newRow == 2 || newRow - choicedPawn[0] == 2) {
            const killed = document.querySelector('.kill__cell')
            const killedRow = Number(killed.id[0])
            const killedCol = Number(killed.id[1])
            
            field[killedRow][killedCol] = 'x'
        }

        field[newRow][newCol] = 'w'
        field[choicedPawn[0]][choicedPawn[1]] = 'x'

        reRender('player')
    }
}

function checkCell(row, col) {
    try {
        return field[row][col]
    } catch (error) { }
}

function reRender(who) {
    document.querySelectorAll('.cell').forEach(el => {
        el.innerHTML = ''
    })

    removeDecorStyles()
    renderCheckers()

    if (who == 'player') {
        enemy = 'w'
        moveAI()
    } else {
        enemy = 'b'
    }
}

function moveAI() {
    let isDone = false

    field.forEach((row, indRow) => {
        if (!isDone) {

            row.forEach((cell, indCell) => {
                if (cell == 'b' && !isDone) {
                    if (checkCell(indRow + 1, indCell + 1) == 'x') {
                        field[indRow + 1][indCell + 1] = 'b'
                        field[indRow][indCell] = 'x'

                        isDone = true

                    } else if (checkCell(indRow + 1, indCell - 1) == 'x') {
                        field[indRow + 1][indCell + 1] = 'b'
                        field[indRow][indCell] = 'x'

                        isDone = true
                    }

                    reRender()
                }
            })
        }
    })
}

function removeDecorStyles() {
    document.querySelectorAll('.hovered__cell').forEach(el => {
        el.classList.remove('hovered__cell')
    })

    document.querySelectorAll('.choiced__cell').forEach(el => {
        el.classList.remove('choiced__cell')
    })

    document.querySelectorAll('.allowed__cell').forEach(el => {
        el.classList.remove('allowed__cell')
    })

    document.querySelectorAll('.kill__cell').forEach(el => {
        el.classList.remove('kill__cell')
    })
}

startGame()