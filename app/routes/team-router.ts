import { Router } from 'express';

import * as teamController from '../controllers/team-controller';

const teamRouter = Router();

teamRouter.post("/team", teamController.create);

teamRouter.get("/team/:id", teamController.findById);

teamRouter.get("/team/", teamController.findAll);

teamRouter.put("/team/:id", teamController.updateById);

teamRouter.delete("/team/:id", teamController.deleteById);

teamRouter.delete("/team", teamController.deleteAll);

export default teamRouter;
