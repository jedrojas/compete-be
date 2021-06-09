import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import UserTeam from '../models/user-team-model';
import { verifyToken } from './auth-utils';

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const accessToken = req.headers.authorization?.slice(7) ?? "";

  verifyToken(accessToken).then((decoded) => {
    const teamId = nanoid();

    const userTeam = new UserTeam({
      id: teamId,
      userId: decoded.sub,
      teamId: req.body.tid,
    });

    new UserTeam()
      .create(userTeam)
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send({
          message:
            e.sqlMessage ?? "Some error occurred while create the UserTeam. ",
        });
      });
  });
};

export const findById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send({
      message: "id must be an integer",
    });
    return;
  }

  new UserTeam()
    .findById(parseInt(req.params.id))
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserTeam with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding UserTeam with id ${req.params.id}`,
        });
      }
    });
};

export const findAll = (req: Request, res: Response) => {
  new UserTeam()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while retrieving UserTeams.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const userTeam = new UserTeam({
    id: req.body.id,
    userId: req.body.user_id,
    teamId: req.body.team_id,
  });

  new UserTeam()
    .updateById(parseInt(req.params.id), userTeam)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserTeam with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating UserTeam with id ${req.params.id}`,
        });
      }
    });
};

export const deleteById = (req: Request, res: Response) => {
  const id = req.params.id;

  new UserTeam()
    .deleteById(req.params.id)
    .then((data) => {
      res.send({
        message: `UserTeam with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserTeam with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting UserTeam with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new UserTeam()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All UserTeams were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while deleting all UserTeams.",
      });
    });
};
