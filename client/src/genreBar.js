import React, { Component } from 'react'
import { view } from 'react-easy-state'
import { Bar } from 'react-chartjs-2'
import GenreBase from './genreBase.js'


class GenreBar extends GenreBase {
  state = {
    colors: [
      "#7A5674","#745C7C","#6C6283","#636888","#596E8C","#4E748F",
      "#42798F","#377F8E","#2E838B","#298886","#2A8C80","#309079",
      "#3B9371","#489669","#559860","#649A58","#739B50","#839C49",
      "#929C44","#A29B41","#B29A40","#C19842","#D09648","#DE944F"
    ]
  }

  sortFunc = (a, b) => a.val - b.val

  renderAux(values, labels) {
    return (
      <div className="barPlot">
        <Bar data={{
            labels: labels,
            datasets: [{
              label: "My First dataset",
              backgroundColor: this.state.colors,
              data: values,
            }]}}
            options = {{
              maintainAspectRatio: false,
              title: {
                display: true,
                text: "Number of each genre according to artist",
                fontColor: "white"
              },
              legend: { display: false },
              scales: {
                yAxes: [{
                  ticks: { fontColor: "white" }
                }],
                xAxes: [{
                  ticks: { fontColor: "white" }
                }]
              }
            }}
        / >
    </div>
    )
  }
}

export default view(GenreBar)
