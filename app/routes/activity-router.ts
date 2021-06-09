import { Router } from 'express';

import * as activityController from '../controllers/activity-controller';

const activityRouter = Router();

activityRouter.post("/activity", activityController.create);

activityRouter.post("/activity/strava", activityController.getStravaActivities);

activityRouter.get("/activity/:id", activityController.findById);

activityRouter.get("/activity/", activityController.findAll);

activityRouter.put("/activity/:id", activityController.updateById);

activityRouter.delete("/activity/:id", activityController.deleteById);

activityRouter.delete("/activity", activityController.deleteAll);

export default activityRouter;
