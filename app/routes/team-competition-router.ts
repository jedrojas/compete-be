import { Router } from 'express';

import * as teamCompetitionController from '../controllers/team-competition-controller';

const teamCompetitionRouter = Router();

teamCompetitionRouter.post(
  "/team-competition",
  teamCompetitionController.create
);

// userCompetitionRouter.get(
//   "/user-competition/:cid",
//   userCompetitionController.getUserCompetitionData
// );

teamCompetitionRouter.get(
  "/team-competition/",
  teamCompetitionController.findAll
);

teamCompetitionRouter.put(
  "/team-competition/:id",
  teamCompetitionController.updateById
);

teamCompetitionRouter.delete(
  "/team-competition/:id",
  teamCompetitionController.deleteById
);

teamCompetitionRouter.delete(
  "/team-competition",
  teamCompetitionController.deleteAll
);

export default teamCompetitionRouter;
