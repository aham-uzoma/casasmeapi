require('dotenv').config()

const express = require("express")

const app = express()

const path = require('path')

const errorHandler = require('./middleware/errorHandler')

const cookieparser = require('cookie-parser')

const credentials = require('./middleware/credentials');

const { logger } = require('./middleware/logger')

const cors = require('cors')

const connectDB = require('./config/dbConn')

const mongoose = require('mongoose')

const { logEvents } = require('./middleware/logger')

const verifyJWT = require('./middleware/verifyJWT')

const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions))

//app.use(cors({ origin: 'https://casasme.com.ng' }))'http://localhost:3000' ,
// app.use(cors({ 
//   origin:'https://casasme.com.ng',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
//   credentials: true,
//   optionSuccessStatus:200
// }))

app.use(express.json())

 //app.use(express.static('files'))
// app.use('/public', express.static(path.join(__dirname, '/public')))
// app.use('/public/files/',express.static(__dirname + '/public/files/'));
app.use('/static', express.static(path.join(__dirname, './files')))
// app.use('/static', express.static('files'))
app.use(cookieparser())

app.use('/', require('./routes/root'))// mounts the specified middleware functions at the path which is being specified

app.use('/auth', require('./routes/authRoutes'))


app.use('/refresh', require('./routes/refreshTokenRoutes'))

app.use('/logOut', require('./routes/logOutRoutes'))

app.use('/users', require('./routes/userRoutes'))

app.use('/usersPic', require('./routes/userRoutes')) 

app.use(verifyJWT)

app.use('/usersWithID', require('./routes/userRoutes'))

app.use('/moneyIn', require('./routes/moneyInRoutes'))

app.use('/moneyOut', require('./routes/moneyOutRoutes'))

app.use('/newItemsRow', require('./routes/moneyInRoutes'))

app.use('/moneyInDaily', require('./routes/moneyInRoutes'))

app.use('/moneyOutDaily', require('./routes/moneyOutRoutes'))

app.use('/monthlyMoneyIn', require('./routes/moneyInRoutes'))

app.use('/monthlyMoneyOut', require('./routes/moneyOutRoutes'))

app.use('/yearlyMoneyIn', require('./routes/moneyInRoutes'))

app.use('/yearlyMoneyOut', require('./routes/moneyOutRoutes'))

app.use('/allMonthlyBalanceDue', require('./routes/moneyInRoutes'))

app.use('/newItems', require('./routes/newItemsRoutes'))

app.use('/inventory', require('./routes/newItemsRoutes'))

app.use('/newInvoice', require('./routes/newInvoiceRoutes'))

app.use('/customerInvoiceInfo', require('./routes/customerInfoInvoiceRoutes'))

app.use('/itemInvoiceInfo', require('./routes/ItemsInvoiceRoutes'))

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 page not found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.logs')

})

