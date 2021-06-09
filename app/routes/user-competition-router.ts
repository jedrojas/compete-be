import { Router } from 'express';

import * as userCompetitionController from '../controllers/user-competition-controller';

const userCompetitionRouter = Router();

userCompetitionRouter.post(
  "/user-competition",
  userCompetitionController.create
);

userCompetitionRouter.get(
  "/user-competition/:cid",
  userCompetitionController.getUserCompetitionData
);

userCompetitionRouter.get(
  "/user-competition/",
  userCompetitionController.findAll
);

userCompetitionRouter.put(
  "/user-competition/:id",
  userCompetitionController.updateById
);

userCompetitionRouter.delete(
  "/user-competition/:id",
  userCompetitionController.deleteById
);

userCompetitionRouter.delete(
  "/user-competition",
  userCompetitionController.deleteAll
);

export default userCompetitionRouter;
