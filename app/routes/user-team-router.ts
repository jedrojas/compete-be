import { Router } from 'express';

import * as userTeamController from '../controllers/user-team-controller';

const userTeamRouter = Router();

userTeamRouter.post("/user-team", userTeamController.create);

userTeamRouter.get("/user-team/:id", userTeamController.findById);

userTeamRouter.get("/user-team/", userTeamController.findAll);

userTeamRouter.put("/user-team/:id", userTeamController.updateById);

userTeamRouter.delete("/user-team/:id", userTeamController.deleteById);

userTeamRouter.delete("/user-team", userTeamController.deleteAll);

export default userTeamRouter;
