const bcrypt = require('bcryptjs');
const sequelize = require('./sequelize');
const express = require('express');
const favicon = require('serve-favicon');
const People = require('./people');
const Ask = require('./ask');
const User = require('./user');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridtransporter = require('nodemailer-sendgrid-transport');
const web = express();
const transporter = nodemailer.createTransport(sendgridtransporter({
    auth:{
        api_key:'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'
    }
}))
const csurf = csrf();
const MongoDBStore = require('connect-mongodb-session')(session);
const URI='mongodb+srv://shake:Lotus6061830133-@cluster0.o562y.mongodb.net/?retryWrites=true&w=majority';
const store = new MongoDBStore({
    uri:URI,
    collection:'session'
})

web.use(
    session({secret: 'my secret',resave: false,saveUninitialized: false,store:store})
);

sequelize.sync()
   .then(()=>{
       web.listen(3000);
   })
   .catch((err)=>{
       console.log(err);
   })

let product=[];
let replyid ='';
Ask.belongsTo(People);
People.hasMany(Ask);
People.belongsTo(User);
User.hasMany(People);
Ask.belongsTo(User);
User.hasMany(Ask);
web.use(express.urlencoded({extended : true}));
web.use(express.static('public'))
web.set('view engine' , 'ejs');

web.use(favicon(__dirname + '/public/5.ico'));
web.use(csurf);
web.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    next();
})
web.use(flash());

web.get('/reset/:token',(req,res,next)=>{
    req.session.token=req.params.token;
    req.session.save(()=>{
        res.redirect('/token');
    });
})
web.get('/token',(req,res,next)=>{
    const token = req.session.token;
    req.session.token=undefined;
    req.session.save();
    User.findOne({where:{resettoken:token}})
        .then((user)=>{
            if(!user){
                return res.status(404).render('404');
            }
            res.render('new-password',{name:'new-password' , id:user.id,errormessage:req.flash('error')});
        })
        .catch((err)=>{
            console.log(err);
        })
})

web.post('/new-password' , (req,res,next)=>{
    const prepassword = req.body.previouspassword;
    const password = req.body.password;
    User.findOne({where:{id:req.body.userid}})
        .then((user)=>{
            bcrypt
                .compare(prepassword,user.password)
                .then((result)=>{
                    if(!result){
                        req.flash('error','previous password is wrong !');
                        return res.render('new-password' ,{name:'new-password', id:user.id,errormessage:req.flash('error')} );
                    }
                    bcrypt
                        .hash(password,12)
                        .then((hashpassword)=>{
                            user.password = hashpassword;
                            user.resettoken = null ;
                            return user.save();
                        })
                        res.redirect('/login');
                })
                .catch((err)=>{
                    console.log(err);
                })
        })
        .catch((err)=>{
            console.log(err);
        })
})
web.get('/reset',(req,res,next)=>{
    res.render('reset',{name:'reset password' , errormessage:req.flash('error')})
})

web.post('/reset',(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({where:{email:req.body.email}})
            .then((user)=>{
                if(!user){
                    req.flash('error','No this email');
                    return res.redirect('/reset');
                }
                user.resettoken=token;
                //user.resettokenexpiration=Date.now()+2880000;
                return user.save();
            })
            .then((result)=>{
                res.redirect('/login');
                return transporter.sendMail({
                    to:req.body.email,
                    from:'lotus6061830133@g.ncu.edu.tw',
                    subject:'reset',
                    html:`
                        <h4>password reset</h4>
                        <h4><a href='http://localhost:3000/reset/${token}'>You need to click this link to reset password</a></h4>
                    `
                })
            })
            .catch((err)=>{
                console.log(err);
            })
    })
})
web.get('/login',(req,res,next)=>{
    res.render('login' , {name:'login' , errormessage:req.flash('error')});
})
web.post('/login',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({where:{email:email}})
        .then((user)=>{
            if(!user)
            {
                req.flash('error','Email or password is wrong !');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password,user.password)
                .then((result)=>{
                    if(result){
                        req.session.login=true;
                        req.session.user=user;
                        req.session.userid=user.id;
                        return req.session.save(()=>{
                            res.redirect('/home');
                        });
                    }
                    req.flash('error','Email or password is wrong !');
                    return res.redirect('/login');
                })
                .catch((err)=>{
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch((err)=>{
            console.log(err)
        })
})

web.get('/logout',(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/home');
    })
})
web.get('/signup',(req,res,next)=>{
    res.render('signup' ,{name:'signup' , signuperror:req.flash('signerror') });
})
web.post('/signup',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.ConfirmPassword;
    if(password!=confirmpassword)
    {
        req.flash('signerror','Confirm password is wrong ! Please try again.');
        return res.redirect('/signup');
    }
    User.findOne({where:{email:email}})
        .then((userDoc)=>{
            if(userDoc)
            {
                req.flash('signerror','The email has been used . ');
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password,12)
                .then((hashpassword)=>{
                    return User.create({
                        email:email,
                        password:hashpassword
                    })
                })
                .then((result)=>{
                    res.redirect('/login');
                    return transporter.sendMail({
                        to:email,
                        from:'lotus6061830133@g.ncu.edu.tw',
                        subject:'Success',
                        html:'<h4>Signup Successfully</h4>'
                    })
                })
                .catch((err)=>{
                    console.log(err);
                })
            })
        .catch((err)=>{
            console.log(err);
        })
})

web.get('/itung',(req,res) =>{
    People.findAll()
        .then((result) =>{
            res.render('itung' , {name: "itung" , title: result , login:req.session.login , id:req.session.userid});
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/itung',(req,res)=>{
    People.create({
        userId:req.body.userid,
        name:req.body.name,
        talk:req.body.talk
    })
        .then((result) =>{
            res.redirect('/itung');
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/reply',(req,res)=>{
    Ask.create({
        personId:req.body.id,
        reply:req.body.talk,
        userId:req.session.userid
    })
        .then(() =>{
            if(req.body.name=='李一桐')
            {
                res.redirect('/itung');
            }
            else
            {
                res.redirect('/lusi');
            }
        })
        .catch((err) =>{
            console.log(err);
        })
    })

web.get('/reply/:id',(req,res)=>{
    replyid = req.params.id;
    res.redirect('/'+replyid)
})

web.get('/:id' , (req,res)=>{
    let name1="";
    People.findByPk(replyid)
        .then((back)=>{
            const name = back.name;
            if(name=='李一桐')
            {
                name1 = 'itung';
            }
            else
            {
                name1 = 'lusi';
            }
        })
    Ask.findAll()
        .then((result) =>{
            res.render('reply' ,{name:"reply" , title:result , number:replyid , name1:name1 , id:req.session.userid});
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/update',(req,res)=>{
    const id = req.body.id;
    const reply = req.body.reply;
    const personId = req.body.personId;
    let name1="";
    People.findByPk(personId)
        .then((back)=>{
            const name = back.name;
            if(name=='李一桐')
            {
                name1 = 'itung';
            }
            else
            {
                name1 = 'lusi';
            }
        })
    Ask.findByPk(id)
        .then((result) =>{
           result.reply=reply;
           return result.save();
        })
        .then(()=>{
            Ask.findAll()
                .then((result)=>{
                    res.render('reply',{name:"reply",title:result , number:personId,name1:name1 , id:req.session.userid});
                })    
                .catch((err)=>{
                    console.log(err);
                })  
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/delete/itung',(req,res)=>{
    const id = req.body.id;
    const userid = req.body.userId;
    if(userid==req.session.userid)
    {
        People.destroy({where:{id:id}})
        .then(() =>{
            res.redirect('/itung');
        })
        .catch((err) =>{
            console.log(err);
        })
    }
    else
    {
        res.redirect('/itung');
    }
})
web.post('/delete/lusi',(req,res)=>{
    const id = req.body.id;
    const userid = req.body.userId;
    if(userid==req.session.userid)
    {
        People.destroy({where:{id:id}})
            .then(() =>{
                res.redirect('/lusi');
            })
            .catch((err) =>{
                console.log(err);
            })
    }
    else
    {
        res.redirect('/lusi');
    }
})
web.get('/lusi',(req,res) =>{
    People.findAll()
        .then((result) =>{
            res.render('lusi' , {name: "lusi" , title: result , login:req.session.login , id:req.session.userid});
        })
        .catch((err) =>{
            console.log(err);
        })
})

web.post('/lusi',(req,res)=>{
    People.create({
        userId:req.body.userid,
        name:req.body.name,
        talk:req.body.talk
    })
        .then((result) =>{
            res.redirect('/lusi');
        })
        .catch((err) =>{
            console.log(err);
        })
})

web.get('/home',(req,res) =>{
    res.render('home' , {name: "home", title:product , login:req.session.login});
})

web.post('/home',(req,res,next) =>{
    product.push(req.body);
    console.log(req.body.name);
    if((req.body.name=='李一桐'))
    {
        res.redirect('/itung');
    }
    else if((req.body.name=='趙露思'))
    {
        res.redirect('/lusi');
    }
    else
    {
        next();
    }
})

web.use((req,res) =>{
    res.status(404).render('404');
})

//mongodb
/* 
const favicon = require('serve-favicon');
const express = require('express');
const dburi = 'mongodb+srv://shake:Lotus6061830133-@cluster0.o562y.mongodb.net/talks?retryWrites=true&w=majority'
const mongoose = require('mongoose');
const Talk = require('./models/talk');
const Reply = require('./models/reply');
const web = express();
web.use(express.static('public'))
let product=[];

mongoose.connect(dburi, {useNewUrlParser: true , useUnifiedTopology: true})
   .then((result) => web.listen(3000))
   .catch((err) => console.log(err));

web.use(express.urlencoded({extended : true}));

web.set('view engine' , 'ejs');
web.use(favicon(__dirname + '/public/5.ico'));

web.get('/itung',(req,res) =>{
    Talk.find()
        .then((result) =>{
            res.render('itung' , {name: "itung" , title: result});
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/itung',(req,res)=>{
    const talk = new Talk(req.body);
    talk.save()
        .then((result) =>{
            res.redirect('/itung');
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/delete/itung',(req,res)=>{
    const id = req.body.id;
    Talk.deleteOne({"_id":id})
        .then(() =>{
            res.redirect('/itung');
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.post('/delete/lusi',(req,res)=>{
    const id = req.body.id;
    Talk.deleteOne({"_id":id})
        .then(() =>{
            res.redirect('/lusi');
        })
        .catch((err) =>{
            console.log(err);
        })
})
web.get('/lusi',(req,res) =>{
    Talk.find()
        .then((result) =>{
            res.render('lusi' , {name: "lusi" , title: result});
        })
        .catch((err) =>{
            console.log(err);
        })
})

web.post('/lusi',(req,res)=>{
    const talk = new Talk(req.body);
    talk.save()
        .then((result) =>{
            res.redirect('/lusi');
        })
        .catch((err) =>{
            console.log(err);
        })
})

web.get('/home',(req,res) =>{
    res.render('home' , {name: "home", title:product});
})

web.post('/home',(req,res,next) =>{
    product.push(req.body);
    if((req.body.name=='李一桐'))
    {
        res.redirect('/itung');
    }
    else if((req.body.name=='趙露思'))
    {
        res.redirect('/lusi');
    }
    else
    {
        next();
    }
})
web.post('/reply',(req,res)=>{
    const reply = new Reply({
        talkid:req.body.id,
        reply:req.body.talk
    })
    reply.save()
        .then(() =>{
            console.log(req.body.name);
            if(req.body.name=='李一桐')
            {
                res.redirect('/itung');
            }
            else
            {
                res.redirect('/lusi');
            }
        })
        .catch((err) =>{
            console.log(err);
        })
    })
web.get('/reply/:id',(req,res)=>{
    const id = req.params.id;
    Reply.find()
        .then((result) =>{
            res.render('reply' ,{title:result , number:id});
        })
        .catch((err) =>{
            console.log(err);
        })
    })
web.use((req,res) =>{
    res.status(404).render('404');
})
*/
