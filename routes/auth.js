const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res)=>{
    // Validate data before we make a user
    // const validation = schema.validate(req.body) validates request body with the schema declared above
    const validation = registerValidation(req.body)
    if(validation.error){
        return res.status(400).send(validation.error.details)
    }

    // Checking if user is already in a db
    const emailExists = await User.findOne({email: req.body.email}) //checks db via the User model
    if(emailExists){
        return res.status(400).send('Email already exists')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send({user: user.id})
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/login', async (req,res)=>{
    const { error } = await loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if the email exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email or password is wrong.')

    // Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email/Password is wrong.')

    const token = jwt.sign({ id: user.id }, process.env.TOKEN )
    res.header('auth-token', token).send(token) // identifier, token
})

module.exports = router