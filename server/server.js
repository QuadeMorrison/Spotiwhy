const express = require('express')
const path = require('path')
const generatePassword = require('password-generator')

const app = express()

app.use(express.static(path.join(__dirname, '/../client/build')))

app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'))
})

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Password generator listening on ${port}`)
