import React, { useState } from 'react'
import NavBar from './NavBar.js'
import { useNavigate, useLocation } from "react-router-dom";
import Button from '@restart/ui/esm/Button'
import { isBrowser, isTablet, } from 'react-device-detect'
import { v4 as uuidv4 } from 'uuid'
import { IconContext } from 'react-icons/lib';
import { BsInfoCircle, BsPencilFill, BsPlayFill, BsPlus, BsTrashFill } from 'react-icons/bs';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function App() {
  const [games, setGames] = useState([])
  const [sets, setSets] = useState([])
  const [parsed, setParsed] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)

  let { state } = useLocation()

  const LOCAL_STORAGE_KEY_GAMES = 'bingogames'
  const LOCAL_STORAGE_KEY_SETS = 'bingosets'

  if (!parsed) {
    const storedGames = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_GAMES))
    if (storedGames) setGames(storedGames)
    const storedSets = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SETS))
    if (storedSets) {
      setSets(storedSets)
    }
    if (state) {
      let { id: savedId, title: savedTitle, entries: savedEntries } = state
      if (savedTitle.length > 0) {
        if (storedSets) {
          if (storedSets.some(({ id: containedId }) => { return containedId === savedId })) {
            let setsNew = [...storedSets]
            setsNew = setsNew.map(({ id: containedId, title: containedTitle, entries: containedEntries }) => {
              if (containedId === savedId) {
                return { id: containedId, title: savedTitle, entries: savedEntries }
              }
              return { id: containedId, title: containedTitle, entries: containedEntries }
            })
            setSets(setsNew)
            localStorage.setItem(LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
          } else {
            let setsNew = [state, ...storedSets]
            setSets(setsNew)
            localStorage.setItem(LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
          }
        } else {
          setSets([state])
          localStorage.setItem(LOCAL_STORAGE_KEY_SETS, JSON.stringify([state]))
        }
      }
      window.history.replaceState({}, document.title)
    }
    setParsed(true)
  }

  let navigate = useNavigate()

  const debugTestLines = [['Lucas verpasst Einsatz', 'Gitarre muss so laut', 'Daniel lässt sticks fallen', 'Jakob und Juli streiten', 'Juli vergisst wonderwall text'], ['Luisa macht Geräusche', 'Daniel hört nichts', 'Leo kommt später', 'Lucas sofort heiser', 'Juli vergisst wonderwall text'], ['Julian vergisst Bridge Chords', 'Zuhörer platzt rein', 'Jakob sucht Tonart', 'Leo sucht sein Blatt', 'Juli vergisst wonderwall text'], ['Neuer Song zu hoch für Lucas', 'Pumuckl wird zitiert', 'Neues Stück wird verschoben', 'Juli vergisst text von Wonderwall', 'Juli vergisst wonderwall text'], ['Juli vergisst wonderwall text', 'Juli vergisst wonderwall text', 'Juli vergisst wonderwall text', 'Juli vergisst wonderwall text', 'Juli vergisst wonderwall text']]

  const testButton = <Button onClick={() => startGame({ title: 'Band', lines: debugTestLines })}>generate game</Button>
  const clearButton = <Button onClick={clearGames}>clear games</Button>
  // eslint-disable-next-line
  const debugInfo =
    <div className='debugInfo'>
      {isBrowser || isTablet ? 'Desktop / Tablet' : 'Mobile'}
      <br />
      {testButton}{clearButton}
      <br />
      Alert is {alertVisible ? '' : 'not '}visible
      {games.length > 0 ? <div>
        {games.length} games saved:
        {games.map(({ title, id }) => <div>{title}: {id}</div>)}
      </div> : <div>
        No games saved
      </div>}
      {sets.length > 0 ? <div>
        {sets.length} sets saved:
        {sets.map(({ id, title, entries }) => <div>{title}, ID: {id}, {entries.length} entries: {entries.map((entry) => { return <><br /> {entry.title}</> })}</div>)}
      </div> : <div />}
    </div>

  function startGame(game) {
    let { title, lines } = game
    let id = uuidv4()
    let newGame = { title: title, lines: lines, id: id }
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMES, JSON.stringify([...games, newGame]))
    navigate('/game', { state: newGame })
  }

  function resumeGame(game) {
    navigate('/game', { state: game })
  }

  function deleteGame(gameId) {
    const gamesNew = games.filter(({ id }) => (id !== gameId))
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
    setGames(gamesNew)
    localStorage.removeItem('bingoCard.' + gameId + 'MARKED_OFF')
  }

  function clearGames() {
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMES, JSON.stringify([]))
    setGames([])
  }

  function editSet(set) {
    navigate('edit', { state: set })
  }

  function deleteSet(set) {
    let setsNew = [...sets]
    setsNew = setsNew.filter((savedSet) => { return set.id !== savedSet.id })
    localStorage.setItem(LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
    setSets(setsNew)
  }

  function clearSets() {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETS, JSON.stringify([]))
    setSets([])
  }

  function playSet(set) {
    if (set.entries.length < 25) {
      setAlertVisible(true)
    } else {
      let lines = Array.from(Array(5), () => [])
      let stack = [...set.entries].sort((a, b) => 0.5 - Math.random())
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          lines[r].push(stack.pop().title)
        }
      }
      startGame({title: set.title, lines: lines})
    }
  }

  function listItem(game) {
    let { title, id } = game
    return (
      <div className='listItem' key={game.id}>
        <span style={{ display: 'flex', maxWidth: '200px' }} onClick={() => resumeGame(game)}>
          {title}
        </span>
        <span onClick={() => resumeGame(game)} style={{ flex: 1 }} />
        <span className='listItemIcons'>
          <IconContext.Provider value={{ color: 'white', size: 25 }}>
            <BsTrashFill onClick={() => deleteGame(id)} />
            <div style={{ width: '20px' }} />
            <BsPlayFill onClick={() => resumeGame(game)} />
          </IconContext.Provider>
        </span>
      </div>
    )
  }

  function setContainer(set) {
    let { title } = set
    return (
      <div className='listItem' key={set.id}>
        <span style={{ display: 'flex', maxWidth: '200px' }} onclick={() => playSet(set)}>
          {title}
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
        {games.map((game) => listItem(game))}
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
        <span>
          {games.length} {games.length > 1 ? 'games' : 'game'} paused:
        </span>
        <span onClick={() => clearGames()} className='deleteAll'>
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
        <span>
          {sets.length} {sets.length > 1 ? 'sets' : 'set'} saved:
        </span>
        <span onClick={() => clearSets()} className='deleteAll'>
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
        A set needs at least 25 entries.
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{backgroundColor: '#444'}}>
      <div onClick={handleAlertClose} className='alertAction'>Ok</div>
    </DialogActions>
  </Dialog>

  let rightButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsPlus onClick={() => navigate('edit', { state: { id: uuidv4(), title: '', entries: [] } })}></BsPlus></IconContext.Provider>
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
