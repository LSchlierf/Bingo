import React from "react"

export default function NavBar(props) {

  return (
    <div className='NavBar'>
      <span style={{ width: 42, display: 'flex' }}>
        {props.leftButton}
      </span>
      <span className='Title'>
        {props.title}
      </span>
      <span style={{ width: 42, display: 'flex' }}>
        {props.rightButton}
      </span>
    </div>
  )
}