import React, { useState } from "react"
import { BsArrowLeft } from "react-icons/bs"
import { IconContext } from "react-icons/lib"
import { useLocation, useNavigate } from "react-router"
import NavBar from "./NavBar"
import { Checkbox, MenuItem, Select } from '@mui/material';
import { styled } from "@mui/system"
import BingoStorage from "./BingoStorage"

const FreeFieldCheckBox = styled(Checkbox)({
    '&.Mui-disabled': {
        color: 'gray'
    },
    color: 'white'
})

const SizeSelect = styled(Select)({
    color: 'white',
    borderRadius: '7px',
    '.MuiSvgIcon-root ': {
        fill: "white",
    },
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //     borderColor: 'white',
    // },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    height: '42px'
})

function range(count, offset = 0, stepSize = 1) {
    return [...Array(count).keys()].map(x => (x * stepSize) + offset)
}

function Pregame() {
    let navigate = useNavigate()
    let { state } = useLocation()
    let set = state

    let leftButton = <button className='backButton' onClick={() => navigate('/')}><IconContext.Provider value={{ color: 'white', size: 30 }}><BsArrowLeft /></IconContext.Provider></button>

    let maxWith = Math.floor(Math.sqrt(set.entries.length + 1))
    let maxWithout = Math.floor(Math.sqrt(set.entries.length))
    let canUseWithout = maxWithout > 2
    let sizesDiff = maxWith !== maxWithout  

    const [freeField, setFreeField] = useState(true)
    const [size, setSize] = useState(maxWith)

      
    // eslint-disable-next-line
    let debugInfo = <div className='debugInfo'>
        Max with: {maxWith} Max without: {maxWithout} / {sizesDiff ? 'different' : 'not different'}
        <br />
        {canUseWithout ? 'Can use without' : 'Cannot use without'}
        <br />
        currently: size {size} {freeField ? 'with' : 'without'} free tile
        <br />
        Set name: {set.title}
        <br />
        Set ID: {set.id}
        <br />
        {set.entries.length} entries:
        {set.entries.map(({id, title}) => { return <><br />{title}: {id}</> })}
    </div>

    let handleCheckboxClick = () => {
        let freeFieldNew = !freeField || !canUseWithout
        if(freeFieldNew && (size % 2 === 0)) {
            let sizeNew = maxWith > size ? size + 1 : size - 1
            setSize(sizeNew)
        }
        if(sizesDiff && !freeFieldNew && size === maxWith) {
            setSize(maxWithout)
        }
        setFreeField(freeFieldNew)
    }

    let handleSizeSelect = (event) => {
        let newSize = event.target.value
        if(newSize % 2 === 0) {
            setFreeField(false)
        }
        if(sizesDiff && newSize === maxWith) {
            setFreeField(true)
        }
        setSize(newSize)
    }

    function startGame(){
        let markedOff = Array.from(Array(size), () => Array.from(Array(size), () => false))
        let middle = Math.floor(size / 2)
        if(freeField){
            markedOff[middle][middle] = true
        }
        let stack = [...set.entries].sort(() => 0.5 - Math.random())
        let lines = markedOff.map((line, i) => line.map((_, j) => {
            return freeField && i === j && i === middle ? '' : stack.pop().title
        }))
        let title = set.title
        let useFreeTile = freeField
        let game = BingoStorage.addGame({title, lines, markedOff, useFreeTile})
        navigate('/game', {state: game, replace: true})
    }

    return(
        <div className='gradient'>
            <NavBar leftButton={leftButton} title='Configure game'/>
            <div className='listTitle' >
                Available entries: {set.entries.length}
            </div>
            <div className = 'listItem' >
                <div style={{fontSize: '30px'}}>
                    Choose size
                </div>
                <div className='listIcons'>
                    <SizeSelect defaultValue={maxWith} value={size} onChange={handleSizeSelect}>
                        {range(maxWith - 2, 3).map(x => <MenuItem value={x}>{x} x {x}</MenuItem>)}
                    </SizeSelect>
                </div>
            </div>
            <div className = 'listItem' >
                <div style={{fontSize: '30px'}}>
                    Use free field
                </div>
                <div className='listIcons'>
                    <FreeFieldCheckBox
                        disabled={!canUseWithout} 
                        checked={freeField}
                        onChange={handleCheckboxClick}/>
                </div>
            </div>
            <div className='startButton'>
                <div className='textButton' onClick={startGame}>
                    Let's go!
                </div>
            </div>
            {/* {debugInfo} */}
        </div>
    )
}

export default Pregame