const express = require('express');
const controller = require('../controllers/activity.controller');
const auth = require('../middleware/auth.middleware');

const publicRouter = express.Router();
const stopRouter = express.Router({ mergeParams: true });

publicRouter.get('/', controller.searchActivities);
publicRouter.get('/:id', controller.getActivity);

stopRouter.use(auth);
stopRouter.get('/', controller.listStopActivities);
stopRouter.post('/', controller.addStopActivity);
stopRouter.put('/:actId', controller.updateStopActivity);
stopRouter.delete('/:actId', controller.deleteStopActivity);

module.exports = { publicRouter, stopRouter };
