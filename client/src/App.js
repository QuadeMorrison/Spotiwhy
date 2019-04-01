import React, { Component } from 'react'
import { view } from 'react-easy-state'
import store from './store'
import './App.css';
import spotiwhyLogo from './spotiwhy-logo.png'
import TimeSeriesToggle from './timeSeriesToggle.js'
import TimeSeriesPlot from './timeSeriesPlot.js'
import ScatterPlots from './scatterPlots.js'
import GenreBar from './genreBar.js'
import GenrePlot from './genrePlot.js'
import { Spinner, Button } from 'react-bootstrap'

import {spotifyApi, getDataset, asCsv} from './spotify'

class App extends Component {

  getHashParams = () => {
    var hashParams = {}
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1)
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }
    return hashParams
  }

  cache = (name, data) => {
    const str = JSON.stringify(data)
    localStorage.setItem(name, str)
  }

  componentDidMount() {
    const params = this.getHashParams();

    let promise = null;

    if (localStorage.hasOwnProperty("cleanTracks")) {
      store.auth = true
      promise = new Promise((resolve) => {
        const tracks = JSON.parse(localStorage.getItem("cleanTracks"))
        resolve(tracks)
      })
    } else {
      if (params.access_token) {
        window.history.replaceState({}, "", "#")
        store.auth = true
        spotifyApi.setAccessToken(params.access_token)
        promise = getDataset().then(data => {
          this.cache("cleanTracks", data)
          return data
        })
      }
    }

    if (store.auth)
      promise.then(data => {
        store.data = data
        store.loaded = true
      })
  }

  title = () => {
    return (
      <div className="logoContainer">
        <h1>Spotiwhy</h1>
        <img className="logo" src={spotiwhyLogo} height={40} alt="spotiwhy questionmark" />
      </div>
    )
  }

  plots = () => {
    return (
      <div>
        <div className="flexible">
          <TimeSeriesToggle />
        </div>
        <TimeSeriesPlot />
        <div className="flex">
          <GenrePlot />
          <GenreBar />
        </div>
        <ScatterPlots />
      </div>
    );
  }

  handleLogout = () => {
    localStorage.clear()
    store.auth = false
    store.loaded = false
  }

  handleRefresh = () => {
    if (localStorage.hasOwnProperty("cleanTracks")) {
      localStorage.clear()
    }

    window.history.pushState({}, "", "login")
    window.location.reload()
  }

  login = () => {
    if (store.auth)
      return (
        <div className="flex">
          <Button variant="link" onClick={this.handleRefresh}>Refresh Data</Button>
          <Button variant="link" onClick={this.handleLogout}>Log Out</Button>
        </div>
      )
    else
      return <Button variant="primary" href="/login">Login using Spotify</Button>
  }

  loadPlots = () => {
    if (store.auth) {
      if (store.loaded)
        return this.plots()
      else
        return (
          <div className="spinner flexible">
            <Spinner animation="border" variant="info" />
          </div>
        )
    }
  }

  render() {
    return (
      <div className="App">
        <div className="appContainer">
          <div className="flexible">
            {this.title()}
            {this.login()}
          </div>
          { this.loadPlots() }
        </div>
      </div>
    );
  }
}

export default view(App);
