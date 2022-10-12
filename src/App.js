import React, { useState } from 'react'
import NavBar from './NavBar.js'
import { useNavigate } from "react-router-dom";
import { isBrowser, isIOS, isTablet, } from 'react-device-detect'
import { IconContext } from 'react-icons/lib';
import { BsInfoCircle, BsPencilFill, BsPlayFill, BsPlus, BsTrashFill } from 'react-icons/bs';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import BingoStorage from './BingoStorage'

function App() {
  const [games, setGames] = useState([])
  const [sets, setSets] = useState([])
  const [parsed, setParsed] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)

  if (!parsed) {
    setGames(BingoStorage.getSavedGames())
    setSets(BingoStorage.getSavedSets())
    setParsed(true)
  }

  let navigate = useNavigate()

  // eslint-disable-next-line
  const debugInfo =
    <div className='debugInfo'>
      {isBrowser || isTablet ? 'Desktop / Tablet' : 'Mobile'}
      <br />
      Alert is {alertVisible ? '' : 'not '}visible
      {games.length > 0 ? <div>
        {games.length} games paused:
        {games.map(({ title, id }) => <div>{title}: {id}</div>)}
      </div> : <div>
        No games saved
      </div>}
      {sets.length > 0 ? <div>
        {sets.length} sets saved:
        {sets.map(({ id, title, entries }) => <div>{title}, ID: {id}, {entries.length} entries: {entries.map((entry) => { return <><br /> {entry.title}</> })}</div>)}
      </div> : <div />}
    </div>

  function resumeGame(game) {
    navigate('game', { state: game })
  }

  function deleteGame(game) {
    setGames(BingoStorage.deleteGame(game))
  }

  function clearGames() {
    setGames(BingoStorage.clearGames())
  }

  function editSet(set) {
    navigate('edit', { state: set })
  }

  function deleteSet(set) {
    setSets(BingoStorage.deleteSet(set))
  }

  function clearSets() {
    setSets(BingoStorage.clearSets())
  }

  function playSet(set) {
    if (set.entries.length < 8) {
      setAlertVisible(true)
    } else {
      navigate('pregame', {state: set})
    }
  }

  function gameContainer(game) {
    return (
      <div className='listItem' key={game.id}>
        <span style={{ display: 'flex', maxWidth: '200px' }} onClick={() => resumeGame(game)}>
          {game.title}
        </span>
        <span onClick={() => resumeGame(game)} style={{ flex: 1 }} />
        <span className='listItemIcons'>
          <IconContext.Provider value={{ color: 'white', size: 25 }}>
            <BsTrashFill onClick={() => deleteGame(game)} />
            <div style={{ width: '20px' }} />
            <BsPlayFill onClick={() => resumeGame(game)} />
          </IconContext.Provider>
        </span>
      </div>
    )
  }

  function setContainer(set) {
    return (
      <div className='listItem' key={set.id}>
        <span style={{ display: 'flex', maxWidth: '200px' }} onClick={() => playSet(set)}>
          {set.title}
        </span>
        <span onClick={() => playSet(set)} style={{ flex: 1 }} />
        <span className='listItemIcons'>
          <IconContext.Provider value={{ color: 'white', size: 25 }}>
            <BsTrashFill onClick={() => deleteSet(set)} />
            <div style={{ width: '20px' }} />
            <BsPencilFill onClick={() => editSet(set)} />
            <div style={{ width: '20px' }} />
            <BsPlayFill onClick={() => playSet(set)} />
          </IconContext.Provider>
        </span>
      </div>
    )
  }

  function gameList() {
    return (
      <>
        {resumelistTitle()}
        {games.map((game) => gameContainer(game))}
      </>
    )
  }

  function setList() {
    return (
      <>
        {setListTitle()}
        {sets.map((set) => setContainer(set))}
      </>
    )
  }

  function resumelistTitle() {
    return games.length > 0 ?
      <div className='listTitle'>
        <span className='listCount'>
          {games.length} {games.length > 1 ? 'games' : 'game'}{isIOS && !isTablet ? ':' : ' saved:'}
        </span>
        <span onClick={() => clearGames()} className='textButton'>
          Delete all
        </span>
      </div>
      : <div className='listTitle'>
        No games saved
      </div>
  }

  function setListTitle() {
    return sets.length > 0 ?
      <div className='listTitle'>
        <span className='listCount'>
          {sets.length} {sets.length > 1 ? 'sets' : 'set'} saved:
        </span>
        <span onClick={() => clearSets()} className='textButton'>
          Delete all
        </span>
      </div>
      : <div className='listTitle'>
        No sets saved
      </div>
  }

  function handleAlertClose() {
    setAlertVisible(false)
  }

  let alert = <Dialog open={alertVisible} onClose={handleAlertClose}>
    <DialogTitle sx={{backgroundColor: '#444', color: 'white'}}>Not enough entries</DialogTitle>
    <DialogContent sx={{color: 'white', paddingBottom: '10px', backgroundColor: '#444'}}>
      <DialogContentText sx={{color: 'white'}}>
        A set needs at least 8 entries.
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{backgroundColor: '#444'}}>
      <div onClick={handleAlertClose} className='alertAction'>Ok</div>
    </DialogActions>
  </Dialog>

  let rightButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsPlus onClick={() => navigate('edit', { state: BingoStorage.addSet({title: '', entries: []}) })}></BsPlus></IconContext.Provider>
  let leftButton = <IconContext.Provider value={{ color: 'white', size: 26 }}><BsInfoCircle style={{ padding: '7px' }} onClick={() => navigate('imprint')}></BsInfoCircle></IconContext.Provider>

  return (
    <div className='gradient'>
      <NavBar title='Buzzword Bingo' rightButton={rightButton} leftButton={leftButton} />
      {isTablet || isBrowser ?
        <div className='browserContainer'>
          <div className='gameList'>
            {gameList()}
          </div>
          <div className='setList'>
            {setList()}
          </div>
          {/* {debugInfo} */}
        </div> :
        <div>
          {gameList()}
          {setList()}
          {/* {debugInfo} */}
        </div>}
      {alert}
    </div>
  )
}

export default App;
