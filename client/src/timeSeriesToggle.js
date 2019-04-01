import React, { Component } from 'react'
import { view } from 'react-easy-state'
import store from './store'

import { Button, ButtonToolbar } from 'react-bootstrap'

import './timeSeriesToggle.css'

class TimeSeriesToggle extends Component {
  state = {
    variants: [
      "primary", "secondary", "success", "warning",
      "danger", "info", "light"
    ]
  }

  handleClick = (e, k) => {
    store.timeSeries[k] = !store.timeSeries[k]
  }

  render() {
    const ts = store.timeSeries
    let buttons = Object.keys(store.timeSeries).map((k, i) => {
      let isEnabled = ts[k] ? "enabled" : "disabled"
      return (
        <Button
          key={k}
          className={isEnabled}
          variant={this.state.variants[i % 7]}
          onClick={(e) => { this.handleClick(e, k) }}
        >
          {k}
        </Button>)
    })

    return (
      <div className = "flex">
        <ButtonToolbar className = "tsButtons">
          {buttons}
        </ButtonToolbar>
      </div>
    )
  }
}

export default view(TimeSeriesToggle)
