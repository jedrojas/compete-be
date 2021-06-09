import { Router } from 'express';

import * as userController from '../controllers/user-controller';

const userRouter = Router();

userRouter.post("/user", userController.create);

userRouter.get("/user/:id", userController.findById);

userRouter.get("/user/", userController.findAll);

userRouter.get("/user/auth/:code", userController.authorize);

userRouter.put("/user/:id", userController.updateById);

userRouter.delete("/user/:id", userController.deleteById);

userRouter.delete("/user", userController.deleteAll);

userRouter.get("/user/:id/activities", userController.getActivities);

userRouter.get(
  "/user/:uId/competition/:cId/activities",
  userController.getUserActivitiesByCompetition
);

userRouter.get(
  "/user/:uId/competition/:cId/points",
  userController.getUserPointsByCompetition
);

userRouter.get("/user/:uId/competitions", userController.getUserCompetitions);

userRouter.get(
  "/user/:uId/joinable-competitions",
  userController.findUserJoinableCompetitions
);

export default userRouter;
