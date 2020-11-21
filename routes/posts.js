const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        id: req.user.id,
        posts: {
            title: 'Posts you shouldn\'t be able to see if you\'re not logged in.',
            description: 'Post description.'
        }
    })
})

module.exports = router