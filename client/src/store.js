import { store, view } from 'react-easy-state'

const globalStore = store({
  loaded: false,

  data: [],

  timeSeries: {
    Popularity: true,
    Energy: false,
    Danceability: false,
    Speechiness: false,
    Loudness: false,
    Valence: false,
    Acousticness: false,
  }
})

export default globalStore
