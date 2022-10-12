import React, { useState } from "react"
import { isIOS, isTablet } from "react-device-detect"
import { BsStarFill } from "react-icons/bs"
import { IconContext } from "react-icons/lib"
import { v4 as uuidv4 } from 'uuid'
import BingoStorage from "./BingoStorage"

function BingoCard(props) {
    const size = props.game.lines.length
    const [markedOff, setMarkedOff] = useState(props.game.markedOff)
    const middle = Math.floor(size / 2)

    function BingoField(props) {
        return (
            <button className='bingoField' onClick={props.callback} style={{
                borderTopLeftRadius: props.radii[0],
                borderTopRightRadius: props.radii[1],
                borderBottomLeftRadius: props.radii[2],
                borderBottomRightRadius: props.radii[3],
                backgroundColor: props.markedOff ? '#1FD633' : '#666',
                color: props.markedOff ? 'black' : 'white',
                key: props.key
            }}>
                <div className='bingo-entry' style={{ fontSize: (isIOS && !isTablet) ? '9px' : '12px' }}>
                    {props.text}
                </div>
            </button>
        )
    }

    function FreeBingoField() {
        return <button className='bingoField' style={{backgroundColor: '#1FD633'}} >
            <IconContext.Provider value={{ color: 'white', size: '70%' }}>
                <BsStarFill/>
            </IconContext.Provider>
        </button>
    }

    function handleFieldClick(index0, index1) {
        const markedOffNew = [...markedOff]
        markedOffNew[index0][index1] = !markedOffNew[index0][index1]
        setMarkedOff(markedOffNew)
        BingoStorage.updateGame({...props.game, markedOff: markedOffNew})
    }

    function getRadii(index0, index1, maxVal) {
        let radii = [0, 0, 0, 0]
        if (index0 === 0) {
            if (index1 === 0) {
                radii[0] = maxVal
            } else if (index1 === size - 1) {
                radii[1] = maxVal
            }
        } else if (index0 === size - 1) {
            if (index1 === 0) {
                radii[2] = maxVal
            } else if (index1 === size - 1) {
                radii[3] = maxVal
            }
        }
        return radii
    }

    function renderLines() {
        return (
            <div className='card-grid'>
                {props.game.lines.map((line, lineIndex) => {
                    return (
                        <div className='card-row'>
                            {line.map((item, rowIndex) => {
                                if (props.game.useFreeTile && lineIndex === rowIndex && lineIndex === middle) {
                                    return <FreeBingoField />
                                }
                                return <BingoField
                                    text={item}
                                    markedOff={markedOff[lineIndex][rowIndex]}
                                    callback={() => handleFieldClick(lineIndex, rowIndex)}
                                    radii={getRadii(lineIndex, rowIndex, 30)}
                                    key={uuidv4()} />
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    function isSolved() {
        let solvedH = true
        let solvedV = true
        let solvedD0 = true
        let solvedD1 = true
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (!(solvedH || solvedV)) {
                    break
                }
                solvedH &= markedOff[i][j]
                solvedV &= markedOff[j][i]
            }
            if (solvedH || solvedV) {
                return true
            }
            solvedH = true
            solvedV = true
            solvedD0 &= markedOff[i][i]
            solvedD1 &= markedOff[i][size - i - 1]
        }
        return solvedD0 || solvedD1
    }

    return (
        <>
            {renderLines()}
            <div style={{ height: 20 }}></div>
            {isSolved() ? '🎉 🎉 Bingo 🎉 🎉' : ''}
        </>
    )
}

export default BingoCard