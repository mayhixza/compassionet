const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./middleware/authRoute")

const PORT = process.env.PORT || 4001;

// -------------- App Set -----------------

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true },  { useUnifiedTopology: true });
app.use(cookieParser());
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
// app.use(express.static('public'))
// app.use('/css', express.static(__dirname + 'public/css'))
// app.use('/js', express.static(__dirname + 'public/js'))
// app.use('/img', express.static(__dirname + 'public/img'))
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

// --------------Models-----------------

const User = require('./models/user.js');
const Note = require('./models/note.js');
const { findOne } = require('./models/user.js');


app.get('/', authRoute, (req, res) => {  
    res.redirect('/notes')
});

// --------------Sign-up routes-----------------

app.get('/signup', (req, res) => {

    //check if already logged in
    if(req.cookies['verify']!=null){
        return res.redirect("/");
    };

    res.render('signup.ejs');
});

app.post("/signup", async (req, res) => {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
    })

    // const user = await User.findOne({username: req.body.username})
    const emailExists= await User.findOne({email: req.body.email});
    const userExists = await User.findOne({username: req.body.username})
    if (emailExists) {
        // return res.status(400).send('Email already exists');
        return res.render("signup.ejs", {error: "Email already exists!"});
    }

    if (userExists) {
        // return res.status(400).send('That username is taken');
        return res.render("signup.ejs", {error: "User already exists!"});        
    }

    try{
        await user.save();
        let token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie("verify",token);
        console.log(token)
        return res.redirect("/");
    }catch(err){
        console.log(err)
        return res.render('signup.ejs',{error:"error"});
    }
})

// --------------Log-in routes-----------------

app.get('/login', (req, res) => {

    //check if already logged in
    if(req.cookies['verify']!=null){
        return res.redirect("/");
    };

    res.render('login.ejs');
});

app.post("/login", async (req,res) => {

    const userExists = await User.findOne({username:req.body.username});
    if(!userExists){
        return res.render('login.ejs',{error:"User doesn't exist"});
    }
    // console.log(userExists);

    const user = await User.findOne({username: req.body.username})
    const validPass = await bcrypt.compare(req.body.password, user.password);
    // console.log(validPass);
    if(!validPass){
        return res.render('login.ejs',{error:"Incorrect password"});
    }
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.cookie("verify",token);
    // console.log(token)
    return res.redirect("/");
    
});

// --------------Log-out routes-----------------

app.get("/logout", (req, res) => {
    res.cookie('verify', '', {maxAge: 1});
    res.redirect('/login');
})

// --------------Notes routes-----------------

app.get("/notes", authRoute, async (req, res) => {
    const notes = await Note.find().sort({createdAt: 'desc'})
    const users = await User.find();

    token = req.cookies['verify'];
    var urmomgay = ""

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        urmomgay = user._id;
        console.log(err)
    });

    let user = await User.findById(urmomgay)
    let confirm = user.username;  

    // console.log(confirm)    
    res.render("notes.ejs", { notes: notes, users: users, confirm: confirm});
})

// const getUserID = require('./middleware/getUserID')

app.post("/notes", async (req, res) => {
    
})

// ****create new note*****

app.get("/notes/new", authRoute, async (req,res) => {
    token = req.cookies['verify'];
    var urmomgay = ""

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        urmomgay = user._id;
        console.log(err)
    });
    
    let user = await User.findById(urmomgay)
    let username = user.username;    

    console.log(username)
    res.render("notes/new.ejs", {username: username});
})

app.post("/notes/new", async (req,res) => {
    token = req.cookies['verify'];
    var urmomgay = ""

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        urmomgay = user._id;
        console.log(err)
    });

    let note = new Note({
    title: req.body.title,
    content: req.body.content,
    userid: urmomgay
    // date: Date.now().toString()
    })    
    try {
        note = await note.save();
        // console.log(req.body.title);
        return res.redirect("/notes");
    }catch (err) {
        console.log(err)
        return res.render('notes/new.ejs',{error:"error"});
    }
    
})

// **** my notes *****

app.get("/notes/mynotes", async (req, res) => {
    const notes = await Note.find().sort({createdAt: 'desc'})

    token = req.cookies['verify'];
    var urmomgay = ""

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        urmomgay = user._id;
        console.log(err)
    });

    let user = await User.findById(urmomgay);
    // console.log(user)

    try {
        res.render('notes/mynotes.ejs', {notes: notes, user: user})
    } catch (err) {
        console.log(err)
    }
    
});

// **** edit note *****

app.get("/notes/edit/:id", authRoute, async (req,res) => {
    let note = await Note.findById(req.params.id);
        res.render("notes/edit.ejs", {note: note});
})
    
app.put("/notes/edit/:id", async (req, res, next) => {
    req.note = await Note.findById(req.params.id)
    next()
    // console.log(req.note)
}, editArticle('edit'))

// **** delete note *****

app.delete("/notes/:id", async (req, res) => {
    try {
        let note = await Note.findByIdAndDelete(req.params.id);
        console.log(note)
        res.redirect("/notes/mynotes");
    } catch (err) {
        console.log(err)
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)    
});

function editArticle(path) {
    return async (req, res) => {
            let note = req.note
            note.title = req.body.title
            note.content = req.body.content
            // date: Date.now().toString()
            try {
                note = await note.save();
                console.log(req.body.title);
                return res.redirect("/notes");
            }catch (err) {
                console.log(err)
                return res.render(`notes/${path}.ejs`,{error:"error"});
            }
    }
}