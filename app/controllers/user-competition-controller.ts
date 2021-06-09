import { Request, Response } from 'express';

import UserCompetition from '../models/user-competition-model';
import { verifyToken } from './auth-utils';

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const userCompetition = new UserCompetition({
    userId: req.body.user_id,
    competitionId: req.body.competition_id,
  });

  new UserCompetition()
    .create(userCompetition)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while create the UserCompetition. ",
      });
    });
};

export const findById = (req: Request, res: Response) => {
  const id = req.params.id;

  new UserCompetition()
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding UserCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const getUserCompetitionData = (req: Request, res: Response) => {
  console.log("--pls pls--");
  const cid = req.params.cid;

  const accessToken = req.headers.authorization?.slice(7) ?? "";

  verifyToken(accessToken)
    .then((decoded) => {
      const userId = decoded.sub;

      new UserCompetition()
        .getUserCompetitionData(userId, cid)
        .then((data: any[]) => {
          const activities = !data[0].errorMessage ? data[0] : [];
          const points = activities?.reduce(
            (totalPoints: any, activity: { points: any }) =>
              totalPoints + activity.points,
            0
          );
          const isUserAdmin = data[1];
          const isUserParticipant = data[2];
          const currTeamId = data[3]?.team_id ?? null;
          const userTeamId = data[3]?.id ?? null;

          const compData = {
            activities,
            points,
            isUserAdmin,
            isUserParticipant,
            currTeamId,
            userTeamId,
          };

          res.send(compData);
        })
        .catch((e) => {
          res.status(500).send({
            errorMessage:
              e.sqlMessage ??
              `Some error occurred while getting data for user ${userId} in competition ${cid}`,
          });
        });
    })
    .catch((err) => console.log("--error--", err));
};

export const findAll = (req: Request, res: Response) => {
  new UserCompetition()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while retrieving UserCompetitions.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const userCompetition = new UserCompetition({
    id: req.body.id,
    userId: req.body.user_id,
    competitionId: req.body.competition_id,
  });

  new UserCompetition()
    .updateById(req.params.id, userCompetition)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating UserCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const deleteById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send({
      message: "id must be an integer",
    });
    return;
  }

  new UserCompetition()
    .deleteById(parseInt(req.params.id))
    .then((data) => {
      res.send({
        message: `UserCompetition with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting UserCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new UserCompetition()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All UserCompetitions were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while deleting all UserCompetitions.",
      });
    });
};
