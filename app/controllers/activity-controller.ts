import { Request, Response } from 'express';

import Activity from '../models/activity-model';

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const activity = new Activity({
    id: req.body.id,
    distance: parseFloat(req.body.distance),
    type: req.body.type,
  });

  new Activity()
    .create(activity)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while create the Activity. ",
      });
    });
};

export const getStravaActivities = async (req: Request, res: Response) => {
  if (!req.body.token) {
    res.status(400).send({
      message: "Strava access token required!",
    });
  }

  if (!req.body.user_id) {
    res.status(400).send({
      message: "User id could not be found!",
    });
  }

  new Activity()
    .getStravaActivities(req.body.token, req.body.user_id)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while retrieving Strava activities",
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

  new Activity()
    .findById(parseInt(req.params.id))
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Activity with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding Activity with id ${req.params.id}`,
        });
      }
    });
};

export const findAll = (req: Request, res: Response) => {
  new Activity()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while retrieving Activities.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const activity = new Activity({
    id: req.body.id,
    distance: parseFloat(req.body.distance),
    type: req.body.type,
  });

  new Activity()
    .updateById(parseInt(req.params.id), activity)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Activity with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating Activity with id ${req.params.id}`,
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

  new Activity()
    .deleteById(parseInt(req.params.id))
    .then((data) => {
      res.send({
        message: `Activity with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Activity with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting Activity with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new Activity()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All Activities were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while deleting all Activities.",
      });
    });
};
