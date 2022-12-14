const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile']}))


router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), 
    (req, res) => {
        res.redirect('/dashboard')
    })

// @desc    Logout User
// @GET     /auth/logout
router.get('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
      })
    })


module.exports = router