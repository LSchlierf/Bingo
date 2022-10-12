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
    let newSet = { ...set, id: uuidv4() }
    let setsNew = [newSet].concat(this.getSavedSets())
    localStorage.setItem(this.LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
    return newSet
  }

  static updateSet(set) {
    let setsNew = this.getSavedSets().map((savedSet) => {
      if (savedSet.id === set.id) return set
      return savedSet
    })
    localStorage.setItem(this.LOCAL_STORAGE_KEY_SETS, JSON.stringify(setsNew))
    return setsNew
  }

  static deleteSet(set) {
    let { id: newId } = set
    let setsNew = this.getSavedSets().filter(({ id: savedId }) => { return savedId !== newId })
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

  static getGame(game) {
    return this.getSavedGames().find(g => g.id === game.id)
  }

  static addGame(game) {
    let newGame = { ...game, id: uuidv4() }
    let gamesNew = [newGame].concat(this.getSavedGames())
    localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
    return newGame
  }

  static updateGame(game) {
    let gamesNew = this.getSavedGames().map((savedGame) => {
      if (savedGame.id === game.id) return game
      return savedGame
    })
    localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
    return gamesNew
  }

  static deleteGame(game) {
    let { id: newId } = game
    let gamesNew = this.getSavedGames().filter(({ id: savedId }) => { return savedId !== newId })
    localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify(gamesNew))
    return gamesNew
  }

  static clearGames() {
    localStorage.setItem(this.LOCAL_STORAGE_KEY_GAMES, JSON.stringify([]))
    return []
  }
}

export default BingoStorage