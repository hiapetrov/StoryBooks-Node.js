const express = require('express')
const router = express.Router()
const { ensureAuth} = require('../middleware/auth')
const User = require('../models/User')
const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add',{})
})

// @desc    Process add story
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user._id,
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
      console.log(err)  
      res.render('Errors/500')
    }   
}
    
)
//@desc     Show all stories
//@route    GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc',  })
            .lean()

        res.render('stories/index', {stories})
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }
    
})

//@desc     Show Single Story
//@route    GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user')
        .lean(); 

        res.render('stories/story', {story}
        )
    } catch (err) {
       console.log(err)
       res.render('errors/500')
    }
})

//@desc     Show edit story
//@route    GET /stories/edit/:id

router.get('/edit/:id', async (req, res, next) => {
    const story = await Story.findOne({_id:req.params.id}).lean(); 
        try {
            if (!story) {
                return res.render('errors/404')
            } if (story.user.toString() != req.user._id.toString()) {
                return res.redirect('/stories')
                
            } else {
                res.render('stories/edit', {
                  story
                }) ; 
            }
        } catch (err) {
            res.render('errors/500')
            console.log(err)
        }
    
})

//@desc     Save editted story
//@route    POST /stories/edit/:id
router.post('/edit/:id', async (req, res, next) => {
        try {
            await Story.findOneAndUpdate({
                _id:req.params.id
            },{
                body:req.body.body, 
                title:req.body.title, 
                status: req.body.status 
            })
             
            res.redirect('/dashboard')

        } catch (err) {
            res.render('errors/500')
            console.log(err)
        }
      
});


//@desc     Delete story
//@router   DELETE /Stories/edit/:id
router.get('/edit/delete/:id', async (req, res, next) => {
    const story = await Story.findOne({
        _id:req.params.id
    })
    try {
        await Story.findOne({
            _id:req.params.id
        }).deleteOne(story)
         
        res.redirect('/dashboard')

    } catch (err) {
        res.render('errors/500')
        console.log(err)
    }
  
});

module.exports = router
