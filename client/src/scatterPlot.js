import React, { Component } from 'react'
import { view } from 'react-easy-state'
import store from './store'
import {Scatter} from 'react-chartjs-2'
import FormatData from './formatData'

class ScatterPlot extends Component {

  getCoordinates = (data, x, y) => {
    const format = new FormatData(data)
    const xFunc = `format${x}`
    const yFunc = `format${y}`

    return {
      x: typeof format[xFunc] === "function" ? format[xFunc]() : data[x.toLowerCase()],
      y: typeof format[yFunc] === "function" ? format[yFunc]() : data[y.toLowerCase()]
    }
  }

  render() {
    let data = []

    if (store.loaded) {
      data = store.data.map(d => this.getCoordinates(d, this.props.x, this.props.y))
    }

    return (
      <div className="scatterPlot">
        <Scatter data={{
          datasets: [{
            label: `${this.props.x} vs ${this.props.y}`,
            backgroundColor: this.props.color,
            borderColor: this.props.color,
            data: data,
          }]
        }}
        options = {{
          legend: {
            labels: { fontColor: 'white' }
          },
          scales: {
            yAxes: [{
              ticks: { fontColor: 'white' },
              scaleLabel: {
                display: true,
                labelString: this.props.y,
                fontColor: 'white'
              }
            }],
            xAxes: [{
              ticks: { fontColor: 'white' },
              scaleLabel: {
                display: true,
                labelString: this.props.x,
                fontColor: 'white'
              }
            }]
          }
        }}
        / >
    </div>
    )
  }
}

export default view(ScatterPlot)
