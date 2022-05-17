const express = require('express')
const fileUpload = require('express-fileupload')
const csv = require('csv-parser')
const fs = require('fs')
const MG = require('mongoose')
const bp = require('body-parser')
// const DBURL = 'mongodb://127.0.0.1:27017/wisemansays'
const Schema = require('./schema')
// MG.connect(DBURL)
const atlasUrl = 'mongodb+srv://dumbify:paperHotDog4Free@cluster0.u1ik8.mongodb.net/wisemansays?retryWrites=true&w=majority'
MG.connect(atlasUrl, {useUnifiedTopology: true, useNewUrlParser: true })

require('dotenv').config()

const app = express()
const port = 4000

app.use(bp.urlencoded({extended: true}))
app.use(bp.json())
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
}))


// app.get('/msapi/get/:id', (req, res) => {
app.get('/msapi/get', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  
  Schema.count().exec((err, count) => {
    const rand = Math.floor(Math.random() * count)
    Schema.find().skip(rand).exec((err, result) => {
      const data = result && result.length ? result[0][`advice`] : 'Words'
      return res.status(200).send({status: 200, message: 'success', data: data})
    })
  })
})

app.post('/msapi/add', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  const q = []
  if (req.files && req.files.populateFile) {
    const fileObj = req.files.populateFile
    const file = __dirname + '/temp/' + fileObj.name

    fs.createReadStream(file).pipe(csv()).on('data', (data) => {
      const arr = []
      if (Object.keys(data).length > 1) {
        for(let k in data) {
          arr.push(data[k])
          delete data[k]
        }
        data.advice = arr.join(',')
      }
      q.push(data)
    }).on('end', () => {
      Schema.create(q, (error, result) => {
        return res.status(error ? 400 : 200).send({status: error ? 'Failed' : 'Seccess.', message: error ? 'DB error.' : 'Successful.', payload: result})
      })
    })
  } else {
    req.body && req.body.list && (q = req.body.list)
    Schema.create(q, (error, result) => {
      return res.status(error ? 400 : 200).send({status: error ? 'Failed' : 'Seccess.', message: error ? 'DB error.' : 'Successful.', payload: result})
    })
  }
})

app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))
