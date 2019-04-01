import React, { Component } from 'react'
import { view } from 'react-easy-state'
import {Radar} from 'react-chartjs-2'
import {Button} from 'react-bootstrap'
import GenreBase from './genreBase.js'

class GenrePlot extends GenreBase {
  state = {
    byFirst: true
  }

  handleClick = e => {
      this.setState({ byFirst: !this.state.byFirst })
  }

  sortFunc = (a, b) => {
    const index = this.state.byFirst ? 0 : 1
    var aWordList = a.label.split(' ')
    var bWordList = b.label.split(' ')
    var aWord = aWordList.length <= 1 ? aWordList.label : aWordList[index]
    var bWord = bWordList.length <= 1 ? bWordList.label : bWordList[index]
    if(aWord === bWord) return 0;
    return aWord > bWord ? 1 : -1;
  }

  renderAux = (values, labels) => {
    return (
      <div className="genrePlot">
        <Radar data={{
          labels: labels,
          datasets: [{
            label: "Genre Distribution",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: values,
          }]
        }}
        options = {{
          legend: { display: false },
          title: {
            display: true,
            text: "Genre Distribution",
            fontColor: "white"
          },
          scale: {
            pointLabels: { fontColor: "white" },
            gridLines: { color: "#444" },
          }
        }}
        / >
        <div className="flex radioControl">
          <Button onClick={this.handleClick}>
            {"Sort by " + (this.state.byFirst ? "second word" : "first word")}
          </Button>
        </div>
    </div>
    )
  }
}

export default view(GenrePlot)
