import React, { Component } from 'react'
import store from './store'

class GenreBase extends Component {
  getTopN = (genres, slice) => {
    const sliceTo = store.data.length > slice ?  slice : store.data.length
    return Object.entries(genres)
      .map(g => { return { label: g[0], val: g[1] }})
      .sort((a, b) => b.val - a.val).slice(0, sliceTo)
  }

  countGenres = () => {
      const genres = {}

      store.data.forEach(d => {
        d.genres.forEach(g => {
          if (genres.hasOwnProperty(g))
            genres[g] += 1
          else
            genres[g] = 0
        })
      })

    return genres
  }

  render() {
    let values = []
    let labels = []

    if (store.loaded) {
      const genres = this.countGenres()
      const top = this.getTopN(genres, 20)
      const sorted = this.sortFunc ? top.sort(this.sortFunc) : top
      values = sorted.map(s => s.val)
      labels = sorted.map(s => s.label)
    }

    return this.renderAux(values, labels)
  }
}

export default GenreBase
