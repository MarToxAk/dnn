import express from 'express'

const app = express()
app.use(express.json())

// It is important that the full path is specified here
app.post('/api/hello', function(req, res) {
  const { info } = req.body
  console.log(info)
  res
    .status(200)
    .json(info)
    .end()
})

export default app