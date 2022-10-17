import React, { useState } from "react"
import { isIOS, isTablet } from "react-device-detect"
import { IoStarSharp } from "react-icons/io5"
import { IconContext } from "react-icons/lib"
import BingoStorage from "./BingoStorage"

function BingoCard(props) {
  const size = props.game.lines.length
  const [markedOff, setMarkedOff] = useState(props.game.markedOff)
  const middle = Math.floor(size / 2)

  function BingoField(props) {
    return (
      <button className='bingoField' onClick={props.callback} style={{
        backgroundColor: props.markedOff ? '#1FD633' : '#666',
        color: props.markedOff ? 'black' : 'white'
      }}>
        <div className='bingo-entry' style={{ fontSize: (isIOS && !isTablet) ? '9px' : '12px' }}>
          {props.text}
        </div>
      </button>
    )
  }

  function FreeBingoField() {
    return <button className='bingoField' style={{ backgroundColor: '#1FD633' }} >
      <IconContext.Provider value={{ color: 'white', size: '75%' }}>
        <IoStarSharp />
      </IconContext.Provider>
    </button>
  }

  function handleFieldClick(index0, index1) {
    const markedOffNew = [...markedOff]
    markedOffNew[index0][index1] = !markedOffNew[index0][index1]
    setMarkedOff(markedOffNew)
    BingoStorage.updateGame({ ...props.game, markedOff: markedOffNew })
  }

  function renderLines() {
    return (
      <div className='card-grid'>
        {props.game.lines.map((line, lineIndex) =>
          <div className='card-row' key={lineIndex.toString()}>
            {line.map((item, rowIndex) => {
              if (props.game.useFreeTile && lineIndex === rowIndex && lineIndex === middle) {
                return <FreeBingoField key='middle'/>
              }
              return <BingoField
                text={item}
                markedOff={markedOff[lineIndex][rowIndex]}
                callback={() => handleFieldClick(lineIndex, rowIndex)}
                key={rowIndex.toString()} />
            })}
          </div>
        )}
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