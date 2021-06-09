import { Request, Response } from 'express';

import { AdminCompetition } from '../models/admin-competition-model';

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const adminCompetition = new AdminCompetition({
    userId: req.body.user_id,
    competitionId: req.body.competition_id,
  });

  new AdminCompetition()
    .create(adminCompetition)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while create the AdminCompetition. ",
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

  new AdminCompetition()
    .findById(parseInt(req.params.id))
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found AdminCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding AdminCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const findAll = (req: Request, res: Response) => {
  new AdminCompetition()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while retrieving AdminCompetitions.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const adminCompetition = new AdminCompetition({
    id: req.body.id,
    userId: req.body.user_id,
    competitionId: req.body.competition_id,
  });

  new AdminCompetition()
    .updateById(req.params.id, adminCompetition)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found AdminCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating AdminCompetition with id ${req.params.id}`,
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

  new AdminCompetition()
    .deleteById(parseInt(req.params.id))
    .then((data) => {
      res.send({
        message: `AdminCompetition with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found AdminCompetition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting AdminCompetition with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new AdminCompetition()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All AdminCompetitions were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while deleting all AdminCompetitions.",
      });
    });
};
