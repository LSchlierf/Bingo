import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"
import React, { useState } from "react"
import { BsArrowLeft, BsPlus, BsTrashFill } from "react-icons/bs"
import { IconContext } from "react-icons/lib"
import { useLocation, useNavigate } from "react-router"
import NavBar from "./NavBar"
import { v4 as uuidv4 } from 'uuid'

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

  let { state } = useLocation()
  let navigate = useNavigate()

  if (!parsed) {
    if (state) {
      let { id, title, entries } = state
      setCurrTitle(title)
      setCurrEntries(entries)
      setId(id)
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
    {currEntries.map(({id, title}) => { return <><br />{title}: {id}</> })}
    <br />
    Dialog is {dialogVisible ? '' : 'not '}visible
    <br />
    Current entry being edited: {currEntry}
    <br />
    <button onClick={() => {setCurrEntries([])}}>Clear entries</button>
  </div>

  let leftButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsArrowLeft onClick={() => { navigate('/', { state: { id: id, title: currTitle.trim(), entries: currEntries } }) }}></BsArrowLeft></IconContext.Provider>
  let rightButton = <IconContext.Provider value={{ color: 'white', size: 40 }}><BsPlus onClick={() => { setDialogVisible(true) }}></BsPlus></IconContext.Provider>

  let handleTitleChange = (event) => {
    setCurrTitle(event.target.value)
  }

  let handleEntryChange = (event) => {
    setCurrEntry(event.target.value)
  }

  let handleDialogClose = () => {
    setDialogVisible(false)
    setCurrEntry('')
  }

  function addEntry() {
    let entriesNew = [...currEntries, ...(currEntry.split('\n').map((newTitle) => {return {id: uuidv4(), title: newTitle.trim()}}).filter(({title: newTitle}) => {return !currEntries.some((containedEntry) => {return containedEntry.title === newTitle}) && newTitle.length > 0}))]
    setCurrEntries(entriesNew)
    handleDialogClose()
  }

  function deleteEntry(id) {
    let entriesNew = [...currEntries].filter((savedEntry) => {return id !== savedEntry.id})
    setCurrEntries(entriesNew)
  }

  function entryContainer(entry) {
    let { id, title } = entry
    return (
      <div className='listItem' key={id}>
        <span>
          {title}
        </span>
        <span className='listItemIcons'>
          <IconContext.Provider value={{ color: 'white', size: 25 }}>
            <BsTrashFill onClick={() => deleteEntry(id)}/>
          </IconContext.Provider>
        </span>
      </div>
    )
  }

  function entryList() {
    return (
      <>
        {entriesTitle()}
        {currEntries.map((entry) => entryContainer(entry))}
      </>
    )
  }

  function entriesTitle() {
    return currEntries.length > 0 ? 
      <div className='listTitle'>
        <span>
          {currEntries.length} {currEntries.length > 1 ? 'entries' : 'entry'}
        </span>
        <span onClick={() => setCurrEntries([])}>
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
    <DialogTitle sx={{backgroundColor: '#444', color: 'white'}}>Add new entry</DialogTitle>
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
      <div onClick={addEntry} className='alertAction'>Add</div>
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
          hintText='Title is required'
          sx={{ input: { color: 'white' }, label: { color: 'white' }, paddingBottom: '5px' }}
          autoFocus={currTitle.length < 1}
          variant='outlined'
        />
        {entryList()}
        {entryDialog}
      </div>
      {/* {debugInfo} */}
    </div>
  )
}

export default EditSet