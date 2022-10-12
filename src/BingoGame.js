import React from "react"
import NavBar from "./NavBar"
import { useLocation, useNavigate } from "react-router"
import { BsArrowLeft } from 'react-icons/bs'
import { IconContext } from 'react-icons'
import BingoCard from "./BingoCard"

export default function BingoGame() {
    let navigate = useNavigate()
    const { state } = useLocation()
    const { title } = state
    const backButtonCallBack = () => navigate('/')

    let leftButton = (<button className='backButton' onClick={backButtonCallBack}><IconContext.Provider value={{ color: 'white', size: 30 }}><BsArrowLeft /></IconContext.Provider></button>)

    return (
        <div className='gradient'>
            <NavBar leftButton={leftButton} title={title + ' Bingo'} />
            <div className='BingoGame'>
                <div style={{ height: 20 }}></div>
                {<BingoCard game={state}/>}
            </div>
        </div>
    )
}