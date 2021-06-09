import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import AdminCompetition from '../models/admin-competition-model';
import Competition from '../models/competition-model';
import { verifyToken } from './auth-utils';

export const create = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const accessToken = req.headers.authorization?.slice(7) ?? "";

  verifyToken(accessToken)
    .then((decoded) => {
      const userId = decoded.sub;

      const competitionId = nanoid();

      const competition = new Competition({
        id: competitionId,
        type: req.body.type,
        name: req.body.name,
        start_date: req.body.start_date ? new Date(req.body.start_date) : null,
        end_date: req.body.end_date ? new Date(req.body.end_date) : null,
      });

      new Competition()
        .create(competition)
        .then((data) => {
          res.send(data);
          console.log("--successfully created competition--", data);
        })
        // add competition creator as admin
        .then(() => {
          new AdminCompetition()
            .create({
              userId,
              competitionId,
            })
            .then((data) =>
              console.log("--successfully added user to admin list--", data)
            );
        })
        .catch((e) => {
          res.status(500).send({
            message:
              e.sqlMessage ??
              "Some error occurred while creating the Competition. ",
          });
        });
    })
    .catch((err) => console.log("--error--", err));
};

export const findById = (req: Request, res: Response) => {
  const id = req.params.id;

  new Competition()
    .findById(id)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Competition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding Competition with id ${req.params.id}`,
        });
      }
    });
};

export const findParticipants = (req: Request, res: Response) => {
  const cid = req.params.cid;
  const listType = req.params.ltype ?? "individual";

  if (!cid) {
    res.status(500).send({
      message: "parameter type must be included.",
    });
    return;
  }

  const getParticipants = (compId: string) => {
    switch (listType) {
      case "individual":
        return new Competition().findIndividualParticipants(compId);
      case "team":
        return new Competition().findTeamParticipants(compId);
      default:
        return new Competition().findIndividualParticipants(compId);
    }
  };

  getParticipants(req.params.cid)
    .then((data: any) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Could not find participants for competition ${req.params.cid}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding participants for competition ${req.params.cid}`,
        });
      }
    });
};

export const findAllByUserId = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(500).send({
      message: "id must be an integer",
    });
    return;
  }

  new Competition()
    .findAllByUserId(parseInt(req.params.id))
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Competition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            e.sqlMessage ??
            `Some error occurred while finding Competition with id ${req.params.id}`,
        });
      }
    });
};

export const findAll = (req: Request, res: Response) => {
  new Competition()
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ?? "Some error occurred while retrieving Competitions.",
      });
    });
};

export const getLeaderboard = (req: Request, res: Response) => {
  const competitionId = req.params.id;
  const { type } = req.params;
  if (!type) {
    res.status(500).send({
      message: "parameter type must be included.",
    });
    return;
  }

  const queryLeaderboard = (competitionId: string) => {
    switch (type) {
      case "athlete":
        return new Competition().getAthleteLeaderboard(competitionId);
      case "team":
        return new Competition().getTeamLeaderboard(competitionId);
      default:
        return new Competition().getAthleteLeaderboard(competitionId);
    }
  };

  queryLeaderboard(competitionId)
    .then((data) => res.send(data))
    .catch((e) =>
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while retrieving the leaderboard",
      })
    );
};

export const getActivities = (req: Request, res: Response) => {
  const competitionId = req.params.id;

  const { sortOrder } = req.body;
  new Competition(sortOrder)
    .getActivities(competitionId, sortOrder)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(500).send({
        message: `Error retrieving competition's activities with id ${req.params.id}`,
      });
    });
};

export const updateById = (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
  }

  const cid = req.params.id;

  // TODO - Jed: Check if isAdmin
  const accessToken = req.headers.authorization?.slice(7) ?? "";

  verifyToken(accessToken).then((decoded) => {
    const competition = new Competition({
      id: cid,
      type: req.body.type,
      name: req.body.name,
      start_date: req.body.start_date ? new Date(req.body.start_date) : null,
      end_date: req.body.end_date ? new Date(req.body.end_date) : null,
    });

    new Competition()
      .updateById(cid, competition)
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        if (e.kind === "not_found") {
          res.status(404).send({
            message: `Not found Competition with id ${cid}.`,
          });
        } else {
          res.status(500).send({
            message: `Error updating Competition with id ${cid}`,
          });
        }
      });
  });
};

export const deleteById = (req: Request, res: Response) => {
  new Competition()
    .deleteById(req.params.id)
    .then((data) => {
      res.send({
        message: `Competition with id ${req.params.id} was deleted successfully!`,
      });
    })
    .catch((e) => {
      if (e.kind === "not_found") {
        res.status(404).send({
          message: `Not found Competition with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error deleting Competition with id ${req.params.id}`,
        });
      }
    });
};

export const deleteAll = (req: Request, res: Response) => {
  new Competition()
    .deleteAll()
    .then((data) => {
      res.send({ message: "All Competitions were deleted successfully!" });
    })
    .catch((e) => {
      res.status(500).send({
        message:
          e.sqlMessage ??
          "Some error occurred while deleting all Competitions.",
      });
    });
};
