const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456" 
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }

]
//Creating a token for getting req.body POST
morgan.token('body', req => {
  return JSON.stringify(req.body)
})


//Custom  format function
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['body'](req)
  ].join(' ')
}))





const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return String(maxId + 1)
}

app.get('/', (req, res) => {
    res.send('<h1> Persons </h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons) 

}) 

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  console.log(person)
  if (person) {
      response.json(person)
  } else {
      response.status(404).end()
  }

})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.sendStatus(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (!body.name || !body.number)  {
    return res.status(400).json({
      error: 'The name or number is missing'
    })
  } else if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'The name already existing in the phonebook'
    })
  }
  const person = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  }
  persons = persons.concat(person)
  res.json(person)
 
})





app.listen(3000, () => {
    console.log(`Server running on port 3000`)
})