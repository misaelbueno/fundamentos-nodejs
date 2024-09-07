import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const { title, description } = data

    // const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const findRow = this.#database[table].find(row => row.id === id)

    if (findRow) {
      if (title) {
        findRow.title = title
      }

      if (description) {
        findRow.description = description
      }

      // this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], ...data }

      this.#persist()
      return findRow
    }

    return false
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex].completed_at = new Date()
      this.#persist()

      return true
    }

    return false
  }
}