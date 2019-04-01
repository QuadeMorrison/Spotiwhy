import React, { Component } from 'react'
import { view } from 'react-easy-state'
import store from './store'
import ScatterPlot from './scatterPlot.js'
import {Modal, Button} from "react-bootstrap"

class ScatterPlots extends Component {
  state = {
    show: false,
    variablesChecklist: {},
    numChecked: 0,
    plots: [],
    colors: [
      "#218838", "#007BFF", "#FFC104",
      "#DB3545", "#16A2B7", "#6C757D", "#22262A"
    ]
  }

  resetChecklist = () => {
    let variablesChecklist = Object.assign({}, this.state.variablesChecklist);
    this.clearChecklist(variablesChecklist)
    this.setState({ show: false, numChecked: 0, variablesChecklist });
  }

  handleClose = () => {
    this.resetChecklist()
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  handleAdd = () => {
    let plots = this.state.plots.slice()

    const variables = Object.keys(this.state.variablesChecklist)
      .filter(k => this.state.variablesChecklist[k])

    plots.push({ x: variables[0], y: variables[1] })

    this.setState({ plots })
    this.resetChecklist()
  }

  clearChecklist = (checklist) => {
      Object.keys(checklist).forEach(k => checklist[k] = false)
  }

  handleCheck = (e, key) => {
    let variablesChecklist = Object.assign({}, this.state.variablesChecklist);
    let numChecked = this.state.numChecked

    if (numChecked == 2) {
      this.clearChecklist(variablesChecklist)
      numChecked = 0
    }

    variablesChecklist[key] = !variablesChecklist[key]
    numChecked += 1

    this.setState({ variablesChecklist, numChecked })
  }

  addPlotModal = () => {
    const inputs = Object.keys(this.state.variablesChecklist).map(k => {
      return (
        <div key={k}>
          <input
            checked={this.state.variablesChecklist[k]}
            onClick={e => this.handleCheck(e, k)}
            type="checkbox"
            name={k}
            value={k}
            readOnly
          />
          <span> {k}</span>
        </div>
      )
    })

    return (
        <Modal  show={this.state.show} onHide={this.handleClose}>
          <Modal.Body>
            Select two variables to plot against
            {inputs}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
    )
  }

  componentDidMount() {
    const variablesChecklist = []

    Object.keys(store.timeSeries).forEach(k => {
      variablesChecklist[k] = false;
    })

    this.setState({ variablesChecklist })
  }

  render() {
    const plots = this.state.plots.map((p, i) => <ScatterPlot
      key={p.x + p.y}
      color={this.state.colors[i % this.state.colors.length]}
      x={p.x}
      y={p.y} />
  )

    return (
      <div>
        {this.addPlotModal()}
        <div className="scatterContainer">
          {plots}
          <div id="newScatter" onClick={this.handleShow}>
            <span id="newPlot"> New Plot </span>
            <div id="addSign"> + </div>
          </div>
        </div>
      </div>
    )
  }
}

export default view(ScatterPlots)
