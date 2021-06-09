import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import TeamCompetition from '../models/team-competition-model';

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const teamCompetitionId = nanoid();

  const teamCompetition = new TeamCompetition({
    id: teamCompetitionId,
    teamId: req.body.team_id,
    competitionId: req.body.competition_id,
  });

  new TeamCompetition()
    .create(teamCompetition)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while create the TeamCompetition. ",
      });
    });
};

export const findById = (req: Request, res: Response) => {
  const id = req.params.id;

  new TeamCompetition()
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found TeamCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding TeamCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const findAll = (req: Request, res: Response) => {
  new TeamCompetition()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while retrieving TeamCompetitions.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const teamCompetition = new TeamCompetition({
    id: req.body.id,
    teamId: req.body.team_id,
    competitionId: req.body.competition_id,
  });

  new TeamCompetition()
    .updateById(req.params.id, teamCompetition)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found TeamCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating TeamCompetition with id ${req.params.id}`,
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

  new TeamCompetition()
    .deleteById(parseInt(req.params.id))
    .then((data) => {
      res.send({
        message: `TeamCompetition with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found TeamCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting TeamCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new TeamCompetition()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All TeamCompetitions were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while deleting all TeamCompetitions.",
      });
    });
};
