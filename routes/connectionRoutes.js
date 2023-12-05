const express = require('express');
const router = express.Router();
const controller = require('../controllers/connectionControllers');
const {isLoggedIn, isHost, isNotHost} = require('../middlewares/auth');
const { validateId, validateResult, validateRSVP, validateConnection } = require('../middlewares/validator');

console.log('in connections router')
//get all stories and send to user
router.get('/', controller.index);



router.get('/new', isLoggedIn, controller.new);

router.get('/:id', validateId,  controller.show);

router.post('/',isLoggedIn, validateConnection, validateResult, controller.create);

// get stories/:id/edit: send html for editing a story
router.get('/:id/edit',validateId, isLoggedIn, isHost, controller.edit);

//put /stories/id: update a story by id
router.put('/:id',validateId, isLoggedIn, isHost, validateConnection, validateResult, controller.update);

router.delete('/:id',validateId, isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', validateId, isLoggedIn,isNotHost, validateRSVP, validateResult, controller.editrsvp);

router.delete('/:id/rsvp', validateId, isLoggedIn, isNotHost, controller.deletersvp);

module.exports = router;

