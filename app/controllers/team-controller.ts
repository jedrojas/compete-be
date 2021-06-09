import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import TeamCompetition from '../models/team-competition-model';
import Team from '../models/team-model';
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

    const team = new Team({
      id: teamId,
      name: req.body.name,
    });

    new Team()
      .create(team)
      .then((data) => {
        const teamCompetitionId = nanoid();

        new TeamCompetition().create({
          id: teamCompetitionId,
          teamId: teamId,
          competitionId: req.body.cid,
        });
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send({
          message:
            e.sqlMessage ?? "Some error occurred while create the Team. ",
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

  new Team()
    .findById(parseInt(req.params.id))
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding Team with id ${req.params.id}`,
        });
      }
    });
};

export const findAll = (req: Request, res: Response) => {
  new Team()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message: e.sqlMessage ?? "Some error occurred while retrieving Teams.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const team = new Team({
    id: req.body.id,
    name: req.body.name,
  });

  new Team()
    .updateById(req.params.id, team)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating Team with id ${req.params.id}`,
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

  new Team()
    .deleteById(parseInt(req.params.id))
    .then((data) => {
      res.send({
        message: `Team with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting Team with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new Team()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All Teams were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while deleting all Teams.",
      });
    });
};
