const express = require('express');
const request = require('request');
const config = require('config');
const { check,validationResult } = require('express-validator')
const router = express.Router() ;
const auth = require('../../middleware/auth');
const Profile  = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

router.get('/me', auth ,async(req,res)=>{
    try{
        const profile = await Profile.findOne( { User : req.user.id } ).populate('user', ['name','avatar']);

        if (!profile) {
            return res.status(400).json({msg:'There is no profile for this user'});
        }

        res.json(profile)
    }catch(err){
        console.error(err.message);
        res.send(500).send('Server Error');
    }
});

router.post('/', [ auth , [
    check('status', 'Status is Required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]], 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.arrar()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        facebook,
        instagram,
        linkedin
    } = req.body ;

    //Build Profile object
    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if(company) profileFeilds.company = company ;
    if(website) profileFeilds.website = website ;
    if(location) profileFeilds.location = location ;
    if(bio) profileFeilds.bio = bio ;
    if(status) profileFeilds.status = status ;
    if(githubusername) profileFeilds.githubusername = githubusername  ;
    if(skills) {profileFeilds.skills = skills.split(',').map(skill => skill.trim()) ; }
    
    //Build Social Object 
    profileFeilds.social = {}
    if(youtube) profileFeilds.social.youtube = youtube ;
    if(twitter) profileFeilds.social.twitter = twitter ;
    if(facebook) profileFeilds.social.facebook = facebook  ;
    if(instagram) profileFeilds.social.instagram = instagram ;
    if(linkedin) profileFeilds.social.linkedin = linkedin ;
    
    try {
        let profile = await Profile.findOne( {user: req.params.id} );

        if (profile) {
            //update 
            profile = await Profile.findByIdAndUpdate(
                        { user: req.user.id }, 
                        { $set: profileFeilds },
                        { new: true } 
                        );
            return res.json(profile);
        }

        //create 
        profile = new Profile (profileFeilds);
        await profile.save();
        res.json(profile);

    }catch (err) {
        console.error (err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req,res) => {
    try { 
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//Get profile by UserId
router.get('/user/:user_id', auth, async (req,res) => {
    try { 
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user',['name','avatar']);
        
        if(!profile) return res.status(400).json({msg: 'Profile not found'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
});

//Delete Profile  
router.delete('/', auth, async(req,res) => {
    try{
        await Post.deleteMany({ user: req.uer.id });
        await Profile.findOneAndRemove({ user: req.user.id});
        await User.findOneAndRemove({ _id: req.user.id});
        res.json({ msg : "User Deleted"});
    } catch (err) {
        console.log(err.message);
        res.send("Server Error");
    }
});

//Add profile Experience 
router.put('/experience', [auth , [
    check('title','Title is Required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty()
]] , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }

    const {
        title ,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body ;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile  = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile); 
    }catch(err){
        console.error (err.message);
        res.status(500).send('Server Error');
    }
});

//Delete Experience 
router.delete('/experience/:exp_id', auth , async (req,res)=> {
    try{
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.map(i => i.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

//Add Education 
router.put ('/education', [auth,
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of Study is required').not().isEmpty(),
    check('from','From Date is required').not().isEmpty()
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    const  {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body ;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try{
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Delete Education
router.delete('/education/:edu_id', auth , async (req,res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education.map(i => i.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});


//get Request to github username
router.get('/github/:username', (req,res)=>{
    try{
        const options = {
            uri : `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method : 'GET',
            headers :{'user-agent': 'node.js'}
        };
        request(options, (error, response, body) => {
            if(error) console.error(error);
            if(response.statusCode !== 200 ) {
                return res.status(404).json({ msg: 'No github profile found' });
            }
            res.json(JSON.parse(body));
        })
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;