const router = require('express').Router()
const User = require('../models/user.model')
const {body , validationResult} = require('express-validator')
 
router.get('/login', (req, res, next)=>{
    res.render('login')
})

router.get('/register', (req, res, next)=>{
res.render('register')
})


router.post('/register',

    body('email').trim().isEmail().normalizeEmail().toLowerCase(),
    body('password').trim().isLength(2).withMessage('password must be 2 character'),
    body('password2').custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('passwords do not match')
        }
        return true; 
    })

    ,async(req, res, next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            errors.array().forEach(error=>{
                req.flash('error', error.msg)
            })
            res.render('register', {
                email: req.body.email,
                messages: req.flash()})
            return;
        }
        const {email} = req.body;
        const doesExist = await User.findOne({email});
        if (doesExist){
            console.log('user already exists')
            req.flash('error', 'User already exists');
            res.redirect('/auth/register')
            return;
        }
    const user = new User(req.body);
    await user.save();
    res.redirect('/auth/login')
    res.send(user);
    }
    catch(error){
        next(error)

    }
   
})
router.post('/login', (req, res, next)=>{
    res.send('Login Post')
})



router.get('/logout', async(req,res, next)=>{
    res.send('logout route')
})



module.exports = router