const express = require('express'),
      app     = require('../api'),
      router  = express.Router(),
      agent   = require('../models/agentsModel'),
      config  = require('../config.js'),
      Cookie  = require('cookie'),
      jwt     = require('jsonwebtoken');

router.use(function timelog (req, res, next){
    let now

    now = Date.now()
    console.log('[ROUTING] /identity -- Time: ', now.toLocaleString())
    next()
})

router.get("/", function(req,res){
    const token = jwt.sign(user, app.get('superSecret'), {

        });
    res.json({
        token: token
    });
});

router.post("/", function(req, res) {
    agent.findOne({
        firstname: req.body.name
    }, function(err, agent) {

        if (err) throw err;

        if (!agent) {
            res.status(401).json({ success: false, message: 'Authentication failed. Agent not found.' });
        } else if (agent) {

      // check if password matches
            if (agent.password != req.body.password) {
                res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

            // if user is found and password is right
            // create a token
                const token = jwt.sign(agent, app.get('superSecret'), {
                expiresIn : 60*60*24 // expires in 24 hours
                });

        // return the information including token as JSON
                res.cookie("token", token, {maxAge: 60*60*24}).json({
                    status: "OK"
                })
            }
        }
    })
})

router.delete("/", function(req, res) {
    res.cookie("token", "/", {maxAge: 0}).send("disconnected");
})
module.exports = router
