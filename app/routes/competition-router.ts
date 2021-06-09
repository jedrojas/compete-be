import { Router } from 'express';

import * as competitionController from '../controllers/competition-controller';

const competitionRouter = Router();

competitionRouter.post("/competition", competitionController.create);

competitionRouter.get("/competition/:id", competitionController.findById);

competitionRouter.get(
  "/competition/:cid/participants/:ltype",
  competitionController.findParticipants
);

// TODO: FIX this route
competitionRouter.get(
  "/competition/temp/:id",
  competitionController.findAllByUserId
);

competitionRouter.post(
  "/competition/:id/leaderboard/:type",
  competitionController.getLeaderboard
);

competitionRouter.get(
  "/competition/:id/activities",
  competitionController.getActivities
);

competitionRouter.get("/competition/", competitionController.findAll);

competitionRouter.put("/competition/:id", competitionController.updateById);

competitionRouter.delete("/competition/:id", competitionController.deleteById);

competitionRouter.delete("/competition", competitionController.deleteAll);

export default competitionRouter;
