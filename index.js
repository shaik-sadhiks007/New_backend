const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express(); // here i have initialized the express package

// middleware

app.set('view engine', 'ejs') // by using this i was set the ejs as template engine

app.use(express.json()); // it will retrive data from hexa code which sent by frontend
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res, next) => {
    console.log("use is trigered")
    // console.log('req',req)

    // console.log(req.url,'url') 
    // console.log(req.method,'method') 
    // console.log(req.body,'body')
    next()
    // res.send('use end is trigered') 

})


app.get('/user/:profile', (req, res) => {
    res.send(`profile is ${req.params.profile}`)
})



app.get('/', (req, res) => {
    res.send('get is trigered')
})

app.post('/', (req, res) => {

    console.log(req.body, 'body');
    res.status(200) // no data is modified
    const data = 'sadhik and adasfasfsss'

    // res.write('hello world');
    // res.end(' and good')
    //res.send(data) // exp js

    // node js

    res.write('sfasdf')
    res.end()


    // exp js 

    res.send(req.body)

})


app.put('/', (req, res) => {
    res.send('put is trigered')
})


app.delete('/profile', (req, res) => {
    res.send('delete is trigered')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register',  async (req, res) => {
    console.log(req.body)

    const { username, email, password } = req.body // obj destructuring


    const hashPassword = await bcrypt.hash(password,10)

    const newUser = new User({username, email, password : hashPassword });

    await newUser.save(); // it is saying that i will await for sometime until the collection created

    console.log(newUser);

    res.send(`hi ${username} , thanks for registering with ${email}`)
})

// app.get('/login', (req, res) => {
//     res.render('login')
// })

app.post('/login',  async (req, res) => {

    console.log(req.body)

    const { email, password } = req.body // obj destructuring

    const useravailable = await User.findOne({email});

    console.log(useravailable,'Useravailable')

    if(!useravailable){
        return res.status(400).send("Invalid email or user not found")
    }

    const isMatching = await bcrypt.compare(password,useravailable.password)

    if(!isMatching){
        return res.status(400).send('Password is incorrect')
    }

    const SECRET_KEY = 'sadhik123'
    const token = jwt.sign({
        id : useravailable._id, email : useravailable.email, username : useravailable.username
    }, SECRET_KEY, {expiresIn : '1m'})



    res.status(200).send({
        message : 'Login successful',
        token : token
    })

})

// mvc pattern

app.use((req, res) => {
    res.render('404')
})

const port = 3000;

// string literals

const mongodbUrl = "mongodb+srv://shaiksadhiks007:sadhikMangodb@cluster0.dmyvccv.mongodb.net/NewBackend?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongodbUrl)
    .then(() => console.log('Connected to Mongodb Atlas'))
    .catch(err => console.log('error is triggered'))

app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})
