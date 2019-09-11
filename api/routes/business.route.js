const express = require('express');
const app = express();
const businessRoutes = express.Router();

// Require  model in our routes module

let Member = require('../models/Member');


businessRoutes.route('/addMember').post(function (req, res) {
  console.log("add member", req.body)
  let member = new Member(req.body);
  Member.findOne({nickname: req.body.nickname}, function(err, result){
    if(err) console.log(err,'error');
    if (result ){
      console.log('addmember else: ', result)

      console.log('already exists in db, nick taken ');
      res.status(400).json(err);

    } else {
      member.save()
        .then(member => {
          res.status(200).json({'member': 'member added successfully', member});
        })
        .catch(err => {
          res.status(400).json(err);
        });

      console.log('do we ever get this far 2', err);
    }

  });

});

businessRoutes.route('/getMembers').get(function (req, res) {
  console.log("get member")
  Member.find(function (err, members){
    if(err){
      console.log(err);
    }
    else {
      console.log(members);
      res.json(members);
    }
  });
});

// Defined get data(index or listing) route
businessRoutes.route('/').get(function (req, res) {
  console.log("get all")
  Member.find(function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      console.log(businesses);
      res.json(businesses);
    }
  });
});


businessRoutes.route('/deleteMember/:id').get(function (req, res) {
  console.log('remove member')
  Member.deleteOne({nickname: req.params.id}, function(err, member){
    if(err) res.json(err);
    else res.json('Successfully removed a nick');
  });
});

// Defined delete | remove | destroy route
businessRoutes.route('/delete/:id').get(function (req, res) {
  Member.findByIdAndRemove({_id: req.params.id}, function(err, business){
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = businessRoutes;
