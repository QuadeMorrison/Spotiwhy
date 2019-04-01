export default class FormatData {
  constructor(data) {
    this.data = data;
  }

  formatDate = () => {
    return this.data.added_on.substring(0, 10)
  }

  formatPopularity = () => {
    return this.data.popularity / 100
  }

  formatLoudness = () => {
    return this.data.loudness / 10
  }
}

