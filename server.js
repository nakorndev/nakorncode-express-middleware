const _ = require('lodash')
const express = require('express')

const users = require('./data/users.json')
const adminOnly = require('./middleware/adminOnly.js')

const app = express()

app.use(express.json())
app.use('/admin', adminOnly)

// req.query
app.get('/users', (req, res) => {
  // ?page=2&per_page=10 // { page: 2, per_page: 10 }
  const page = Number(req.query.page) || 1
  const perPage = Number(req.query.per_page) || 30
  const offset = (page - 1) * perPage
  return res.send({
    page,
    perPage,
    total: users.length,
    data: _.slice(users, offset, offset + perPage)
    // (1 - 1) * 30 = 0
    // (2 - 1) * 30 = 30
    // (3 - 1) * 30 = 60
  })
})

// req.params
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const user = _.find(users, { id })
  if (!user) {
    res.status(404)
    return res.send({ message: 'user not found' })
  }
  return res.send({ data: user })
})

app.post('/users', (req, res) => {
  const { name, age, gender, salary } = req.body
  const id = users.length + 1
  // if (gender == 'male' || gender == 'female')
  if (!['male', 'female'].includes(gender)) {
    const err = new Error('gender must be male or female')
    err.status = 400
    throw err
  }
  const user = { id, name, age, gender, salary }
  users.push(user)
  return res.status(201).send({ message: 'success', data: user })
})

// middleware

// app.get('routes' --> (req, res) => {})
// app.get('routes' --> (req, res, next) => {} --> (req, res) => {})

// 1 app.get('/routes', (req, res, next) => {}, (req, res) => {})
// 2.1 app.use((req, res, next) => {})
// 2.2 app.use('/routes', (req, res, next) => {})

app.get('/admin', (req, res) => {
  return res.send('welcome admin')
})

app.get('/admin/users', (req, res) => {
  return res.send(users)
})

// const fs = require('fs')

// app.get('/test/error', (req, res, next) => {
//   // throw new Error('hello')
//   // next(new Error('hello'))
//   fs.readFile('./data/user.json', (err, data) => {
//     if (err) {
//       next(err)
//     } else {
//       res.send(data.toString())
//     }
//   })
// })

// next(any)
app.use((err, req, res, next) => {
  // 200 -> ok
  // 300 -> redirect
  // 400 -> client error
  // 500 -> server error
  console.error(err)
  return res
    .status(err.status || 500)
    .send({ message: err.message || 'something went wrong' })
})

app.listen(3000, () => console.log('Web server listen at 3000'))
