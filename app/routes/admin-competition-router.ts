import { Router } from 'express';

import * as adminCompetitionController from '../controllers/admin-competition-controller';

const adminCompetitionRouter = Router();

adminCompetitionRouter.post(
  "/admin-competition",
  adminCompetitionController.create
);

adminCompetitionRouter.get(
  "/admin-competition/:id",
  adminCompetitionController.findById
);

adminCompetitionRouter.get(
  "/admin-competition/",
  adminCompetitionController.findAll
);

adminCompetitionRouter.put(
  "/admin-competition/:id",
  adminCompetitionController.updateById
);

adminCompetitionRouter.delete(
  "/admin-competition/:id",
  adminCompetitionController.deleteById
);

adminCompetitionRouter.delete(
  "/admin-competition",
  adminCompetitionController.deleteAll
);

export default adminCompetitionRouter;
