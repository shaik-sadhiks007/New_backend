const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Todo = require('./models/Todo.js');

const app = express(); // here i have initialized the express package

// middleware

app.use(cors())

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

// app.get('/register', (req, res) => {
//     res.render('register')
// })

app.post('/register', async (req, res) => {
    try {
        console.log(req.body)

        const { email, password } = req.body // obj destructuring

        if (password.length < 6) {
            res.status(400).send("password length is greater than 6")
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ email, password: hashPassword });

        await newUser.save(); // it is saying that i will await for sometime until the collection created

        console.log(newUser);

        res.send(`hi, thanks for registering with ${email}`)
    } catch (error) {

        if (error.code == 11000) {
            res.status(500).send("Email adrress already exists")
        }
        console.log(error, "error")
        res.status(500).send('Error while registering')
    }

})

// app.get('/login', (req, res) => {
//     res.render('login')
// })

app.post('/login', async (req, res) => {

    console.log(req.body)

    const { email, password } = req.body // obj destructuring

    const useravailable = await User.findOne({ email });

    console.log(useravailable, 'Useravailable')

    if (!useravailable) {
        return res.status(400).send("Invalid email or user not found")
    }

    const isMatching = await bcrypt.compare(password, useravailable.password)

    if (!isMatching) {
        return res.status(400).send('Password is incorrect')
    }

    const SECRET_KEY = 'sadhik123'
    const token = jwt.sign({
        id: useravailable._id, email: useravailable.email, username: useravailable.username
    }, SECRET_KEY, { expiresIn: '1m' })

    res.status(200).send({
        message: 'Login successful',
        token: token
    })

})


app.post('/todos', async (req, res) => {

    try {
        const { title, description } = req.body;

        const newTodo = new Todo({ title, description })

        await newTodo.save();

        // 200 ----- ok

        // 201 ---- created

        res.status(201).send(newTodo);
    } catch(error) {
        console.log(error,'error');
        res.status(500).send("some error occured in the todo creation")
    }

})

app.get('/todos/:id', async (req, res) => {
    try {
       
        const todos = await Todo.findById(req.params.id);
        res.status(200).send(todos);
    } catch(error) {
        console.log(error,'error');
        res.status(500).send("some error occured in the todo creation")
    }

})


app.get('/todos', async (req, res) => {
    try {
       
        const todos = await Todo.find();
        res.status(200).send(todos);
    } catch(error) {
        console.log(error,'error');
        res.status(500).send("some error occured in the todo creation")
    }

})


app.delete('/todos/:id', async (req, res) => {
    try {
       
        const todos = await Todo.findByIdAndDelete(req.params.id);
        res.status(200).send("todo is deleted successfully");
    } catch(error) {
        console.log(error,'error');
        res.status(500).send("some error occured in the todo creation")
    }

})

app.delete('/todos', async (req, res) => {
    try {
       
        const todos = await Todo.deleteMany()
        res.status(200).send("todo is deleted successfully");
    } catch(error) {
        console.log(error,'error');
        res.status(500).send("some error occured in the todo creation")
    }

})


app.put('/todos/:id', async (req, res) => {
    try {
        const {title,description} = req.body;
       
        const todos = await Todo.findByIdAndUpdate(req.params.id,{title,description},{new:true});
        res.status(200).send("todo updated successfully");
    } catch(error) {
        console.log(error,'error');
        res.status(500).send("some error occured in the todo creation")
    }

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
