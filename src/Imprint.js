import React from "react"
import { BsHouse } from "react-icons/bs"
import { IconContext } from "react-icons/lib"
import { useNavigate } from "react-router"
import NavBar from "./NavBar"

function Imprint() {
  let navigate = useNavigate()

  let leftButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsHouse onClick={() => navigate('/')}/></IconContext.Provider>

  return (
    <div className='gradient'>
      <NavBar title='Imprint' leftButton={leftButton} />
      <div className='imprint'>
        Responsible for this website:
        <br />
        <b>Lucas Schlierf</b>
        <br />
        Pressburger Straße 23a
        <br />
        81377 München
        <br />
        Germany
        <br />
        Reach me via:
        <br />
        <a href='mailto:LucasSchlierf@gmail.com'>
          Email
        </a>
        {' | '}
        <a href='https://www.github.com/LSchlierf/Bingo'>
          GitHub
        </a>
      </div>
    </div>
  )
}

export default Imprint