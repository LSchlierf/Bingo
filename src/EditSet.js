import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"
import React, { useState } from "react"
import { BsArrowLeft, BsPencilFill, BsPlus, BsTrashFill } from "react-icons/bs"
import { IconContext } from "react-icons/lib"
import { useLocation, useNavigate } from "react-router"
import NavBar from "./NavBar"
import { v4 as uuidv4 } from 'uuid'
import BingoStorage from "./BingoStorage"

const TitleTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
      color: 'white'
    },
    '&:hover fieldset': {
      borderColor: 'white',
      color: 'white'
    },
  },
})

function EditSet() {
  const [currTitle, setCurrTitle] = useState('')
  const [currEntries, setCurrEntries] = useState([])
  const [id, setId] = useState()
  const [parsed, setParsed] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [currEntry, setCurrEntry] = useState('')
  const [currEntryId, setCurrEntryId] = useState(0)

  let { state } = useLocation()
  let navigate = useNavigate()

  if (!parsed) {
    if (state) {
      let set = BingoStorage.getSet(state)
      if(set) {
        let {id, title, entries} = set
        setId(id)
        setCurrTitle(title)
        setCurrEntries(entries)
      } else {
        setId(state.id)
      }
    }
    setParsed(true)
  }

  // eslint-disable-next-line
  let debugInfo = <div className='debugInfo'>
    ID: {id}
    <br />
    Title: {currTitle.trim()}
    <br />
    {currEntries.length} Entries:
    {currEntries.map(({id, title}) => { return <div key={id}>{title}: {id}</div> })}
    Dialog is {dialogVisible ? '' : 'not '}visible
    <br />
    Current entry being edited: {currEntry}
    <br />
    Current id being edited: {currEntryId}
    <br/>
    <button onClick={() => {setCurrEntries([])}}>Clear entries</button>
  </div>

  let leftButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsArrowLeft onClick={() => { navigate('/') }}></BsArrowLeft></IconContext.Provider>
  let rightButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsPlus onClick={() => { setDialogVisible(true) }}></BsPlus></IconContext.Provider>

  let handleTitleChange = (event) => {
    let title = event.target.value
    setCurrTitle(title)
    BingoStorage.updateSet({id: id, title: title.trim(), entries: currEntries})
  }

  let handleEntryChange = (event) => {
    setCurrEntry(event.target.value)
  }

  let handleDialogClose = () => {
    setDialogVisible(false)
    setCurrEntry('')
    setCurrEntryId(0)
  }

  function addEntry() {
    if(currEntryId === 0) {
      let entriesNew = [...currEntries, ...(currEntry.split('\n').map((newTitle) => {return {id: uuidv4(), title: newTitle.trim()}}).filter(({title: newTitle}) => {return !currEntries.some((containedEntry) => {return containedEntry.title === newTitle}) && newTitle.length > 0}))]
      setCurrEntries(entriesNew)
      BingoStorage.updateSet({id: id, title: currTitle, entries: entriesNew})
    } else {
      if(currEntry.trim().includes('\n')) {
        let entriesNew = [...currEntries.filter(entry => entry.id !== currEntryId), ...(currEntry.split('\n').map((newTitle) => {return {id: uuidv4(), title: newTitle.trim()}}).filter(({title: newTitle}) => {return !currEntries.some((containedEntry) => {return containedEntry.title === newTitle}) && newTitle.length > 0}))]
        setCurrEntries(entriesNew)
        BingoStorage.updateSet({id: id, title: currTitle, entries: entriesNew})
      } else {
        let entriesNew = currEntries.map(entry => entry.id === currEntryId ? {...entry, title: currEntry.trim()} : entry)
        setCurrEntries(entriesNew)
        BingoStorage.updateSet({id: id, title: currTitle, entries: entriesNew})
      }
    }
    handleDialogClose()
  }

  function deleteEntry(entry) {
    let entriesNew = [...currEntries].filter((savedEntry) => {return entry.id !== savedEntry.id})
    setCurrEntries(entriesNew)
    BingoStorage.updateSet({id: id, title: currTitle, entries: entriesNew})
  }

  function editEntry(entry) {
    setCurrEntry(entry.title)
    setCurrEntryId(entry.id)
    setDialogVisible(true)
  }

  function clearEntries() {
    setCurrEntries([])
    BingoStorage.updateSet({id: id, title: currTitle, entries: []})
  }

  function EntryContainer(props) {
    return (
      <div className='listItem'>
        <span>
          {props.entry.title}
        </span>
        <span className='listItemIcons'>
          <IconContext.Provider value={{ color: 'white', size: 25 }}>
            <BsPencilFill onClick={() => editEntry(props.entry)} />
            <div style={{ width: '20px' }} />
            <BsTrashFill onClick={() => deleteEntry(props.entry)}/>
          </IconContext.Provider>
        </span>
      </div>
    )
  }

  function entryList() {
    return (
      <>
        {entriesTitle()}
        {currEntries.map(entry => <EntryContainer key={entry.id} entry={entry}/>)}
      </>
    )
  }

  function entriesTitle() {
    return currEntries.length > 0 ? 
      <div className='listTitle'>
        <span>
          {currEntries.length} {currEntries.length > 1 ? 'entries' : 'entry'}
        </span>
        <span onClick={() => clearEntries()} className='textButton'>
          Delete all
        </span>
      </div> 
      : <div className='listTitle'>
        No entries saved
      </div>
  }

  function keyPressEnter(event) {
    if(event.keyCode === 13) {
      addEntry()
      setCurrEntry('')
    } else {
      handleEntryChange(event)
    }
  }

  let entryDialog = <Dialog open={dialogVisible} onClose={handleDialogClose}>
    <DialogTitle sx={{backgroundColor: '#444', color: 'white'}}>{currEntryId === 0 ? 'Add new entry' : 'Edit entry'}</DialogTitle>
    <DialogContent sx={{backgroundColor: '#444'}}>
      <TitleTextField
        sx={{input: {color: 'white'}, label: {color: 'white'}}}
        autoFocus
        margin='dense'
        label='Entry'
        fullWidth
        onChange={keyPressEnter}
        defaultValue={currEntry}
        multiline
        InputProps={{ sx: { color: 'white'} }}
        onKeyUp={keyPressEnter}
      />
    </DialogContent>
    <DialogActions sx={{backgroundColor: '#444'}}>
      <div onClick={handleDialogClose} className='alertAction'>Cancel</div>
      <div onClick={addEntry} className='alertAction'>{currEntryId === 0 ? 'Add' : 'Save'}</div>
    </DialogActions>
  </Dialog>

  return (
    <div className='gradient'>
      <NavBar title='Edit set' leftButton={leftButton} rightButton={rightButton} />
      <div className='TitleInput'>
        <TitleTextField
          fullWidth
          key='titleInput'
          label='Title'
          value={currTitle}
          onChange={handleTitleChange}
          error={currTitle.trim().length < 1}
          sx={{ input: { color: 'white' }, label: { color: 'white' }, paddingBottom: '5px' }}
          autoFocus={currTitle.length < 1}
          variant='outlined'
        />
      </div>
      <div className='paddedList'>
        {entryList()}
        {entryDialog}
      </div>
      {/* {debugInfo} */}
    </div>
  )
}

export default EditSet