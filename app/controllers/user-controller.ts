import { Request, Response } from 'express';

import appConfig from '../config/app-config';
import User from '../models/user-model';
import { getAccessAndRefreshToken } from '../queries/strava-auth-query';
import { verifyToken } from './auth-utils';

export const authorize = async (req: Request, res: Response) => {
  appConfig.code = req.params.code;
  appConfig.grant_type = "authorization_code";

  getAccessAndRefreshToken(appConfig)
    .then((data) => console.log("Access token successfully retrieved: ", data))
    .catch((e) => console.log("Error occurred during authorization: ", e));
};

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const user = new User({
    id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  });

  new User()
    .create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message: e.sqlMessage ?? "Some error occurred while create the User. ",
      });
    });
};

export const findById = (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.slice(7) ?? "";

  verifyToken(accessToken).then((decoded) => {
    new User()
      .findById(req.params.id)
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        if (e.kind === "not_found") {
          res.status(404).send({
            no_entry: `Not found User with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message:
              e.sqlMessage ??
              `Some error occurred while finding User with id ${req.params.id}`,
          });
        }
      });
  });
};

export const findAll = (req: Request, res: Response) => {
  new User()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message: e.sqlMessage ?? "Some error occurred while retrieving Users.",
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const user = new User({
    id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  });

  new User()
    .updateById(parseInt(req.params.id), user)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating User with id ${req.params.id}`,
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

  new User()
    .deleteById(parseInt(req.params.id))
    .then((data) => {
      res.send({
        message: `User with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting User with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new User()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All Users were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while deleting all Users.",
      });
    });
};

export const getActivities = (req: Request, res: Response) => {
  const id = req.params.id;

  new User()
    .getActivities(id)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          `Some error occurred while finding User with id ${req.params.id}`,
      });
    });
};

export const getUserActivitiesByCompetition = (req: Request, res: Response) => {
  const uId = req.params.uId;
  const cId = req.params.cId;

  new User()
    .getUserActivitiesByCompetition(uId, cId)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          `Some error occurred while finding User with id ${req.params.uId}`,
      });
    });
};

export const getUserPointsByCompetition = (req: Request, res: Response) => {
  const uId = req.params.uId;
  const cId = req.params.cId;

  if (!uId) {
    res.status(500).send({
      message: "user id is missing!",
    });
    return;
  }

  new User()
    .getUserPointsByCompetition(uId, cId)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        errorMessage:
          e.sqlMessage ??
          `Some error occurred while finding User points with id ${req.params.uId}`,
      });
    });
};

export const getUserCompetitions = (req: Request, res: Response) => {
  const uId = req.params.uId;

  new User()
    .getUserCompetitions(uId)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        errorMessage:
          e.sqlMessage ??
          `Some error occurred while finding competitions of user with id ${uId}`,
      });
    });
};

export const findUserJoinableCompetitions = (req: Request, res: Response) => {
  const uId = req.params.uId;

  new User()
    .getUserJoinableCompetitions(uId)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          `Some error occurred while finding competitions of user with id ${uId}`,
      });
    });
};
