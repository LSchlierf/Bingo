import { v4 as uuidv4 } from 'uuid'

class BingoStorage {

    static LOCAL_STORAGE_KEY_GAMES = 'bingogames'
    static LOCAL_STORAGE_KEY_SETS = 'bingosets'
    
    static getSavedSets() {
        const savedSets = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY_SETS))
        if (savedSets) return savedSets
        return []
    }

    static addSet(set) {
        let {title, entries} = set
        let newSet = {id: uuidv4(), title: title, entries: entries}
        let setsNew = [...this.getSavedSets(), newSet]
        localStorage.setItem(this.LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
        return newSet
    }

    static updateSet(set) {
        let {id: newId, title: newTitle, entries: newEntries} = set
        let setsNew = this.getSavedSets().map(({id: savedId, title: savedTitle, entries: savedEntreis}) => {
            if (savedId === newId) return {id: savedId, title: newTitle, entries: newEntries}
            return {id: savedId, title: savedTitle, entries: savedEntreis}
        })
        localStorage.setItem(this.LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
        return setsNew
    }

    static deleteSet(set) {
        let {id: newId} = set
        let setsNew = this.getSavedSets().filter(({id: savedId}) => {return savedId !== newId})
        localStorage.setItem(this.LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
        return setsNew
    }

    static clearSets() {
        localStorage.setItem(this.LOCAL_STORAGE_KEY_SETS, JSON.stringify([]))
        return []
    }


    static getSavedGames() {
        const savedGames = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY_GAMES))
        if (savedGames) return savedGames
        return []
    }

    static addGame(game) {
        let {title, lines, markedOff, useFreeTile} = game
        let newGame = {id: uuidv4(), title: title, lines: lines, markedOff: markedOff, useFreeTile: useFreeTile}
        let gamesNew = [...this.getSavedGames(), newGame]
        localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
        return newGame
    }

    static updateGame(game) {
        let {id: newId, title: newTitle, lines: newLines, markedOff: newMarkedOff, useFreeTile: newUseFreeTile} = game
        let gamesNew = this.getSavedGames().map(({id: savedId, title: savedTitle, lines: savedLines, markedOff: savedMarkedOff, useFreeTile: savedUseFreeTile}) => {
            if (savedId === newId) return {id: savedId, title: newTitle, lines: newLines, markedOff: newMarkedOff, useFreeTile: newUseFreeTile}
            return {id: savedId, title: savedTitle, lines: savedLines, markedOff: savedMarkedOff, useFreeTile: savedUseFreeTile}
        })
        localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
        return gamesNew
    }

    static deleteGame(game) {
        let {id: newId} = game
        let gamesNew = this.getSavedGames().filter(({id: savedId}) => {return savedId !== newId})
        localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
        return gamesNew
    }

    static clearGames() {
        localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify([]))
        return []
    }
}

export default BingoStorage