const express = require('express');
const controller = require('../controllers/notes.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router.use(auth);
router.get('/', controller.listNotes);
router.post('/', controller.createNote);
router.put('/:noteId', controller.updateNote);
router.delete('/:noteId', controller.deleteNote);

module.exports = router;
