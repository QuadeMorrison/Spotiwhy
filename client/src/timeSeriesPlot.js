import React, { Component } from 'react'
import { view } from 'react-easy-state'
import store from './store'
import Dygraph from 'dygraphs'

import {asCsv} from './spotify'
import FormatData from './formatData'
import './timeSeriesPlot.css'

class TimeSeriesPlot extends Component {
  state = {
    plot: null,
    legendX: null,
    legendY: [],
    song: "",
    showLegend: true,
    colors: [
      "#007BFF", "#6C757D", "#218838", "#FFC104",
      "#DB3545", "#16A2B7", "#E2E6EA"
    ]
  }

  enableData = (data) => {
    const format = new FormatData(data)
    const keys = Object.keys(store.timeSeries).filter(k => store.timeSeries[k])

    return ["Date", ...keys].map(k => {
      const func = `format${k}`
      return typeof format[func] === 'function' ? format[func](data) : data[k.toLowerCase()]
    })
  }

  setLegend = (e, x, points) => {
    const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const legendX = (new Date(x)).toLocaleDateString(dateFormat)

    const keys = Object.keys(store.timeSeries).filter(k => store.timeSeries[k])
    const legendY = keys.map((k, i) => {
      return { name: k, val: points[i].yval }
    })

    const song = ""

    this.setState({ legendX, legendY, song })
  }

  componentDidMount() {
    const plot = new Dygraph("plot")

    this.setState({ plot })
  }

  render() {
    let colors = []

    Object.keys(store.timeSeries).forEach((k, i) => {
      if (store.timeSeries[k])
        colors.push(this.state.colors[i % 7])
    })

    if (this.state.plot && store.loaded) {
      let data = store.data.map(this.enableData)
      let csv = asCsv(data.slice().reverse())
      this.state.plot.updateOptions({
        file: csv,
        highlightCallback: this.setLegend,
        colors: colors,
        width: 1
      })
    }

    let legendColors = {}
    Object.keys(store.timeSeries).forEach((k, i) => {
        legendColors[k] = this.state.colors[i % 7]
    })

    const legendY = this.state.legendY.map((l, i) => {
      return (
        <tr key={l.name + l.val}>
          <th style={{color: legendColors[l.name]}}>{l.name}:</th>
          <td>{l.val}</td>
        </tr>
      )
    })

    return (
      <div className="flex">
        <div className="container">
          <div id="plot"></div>
        </div>
        <div id="legend">
          <div>
            <div>{this.state.legendX}</div>
            <div>{this.state.song}</div>
            <table>
              <tbody>
                {legendY}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default view(TimeSeriesPlot)
