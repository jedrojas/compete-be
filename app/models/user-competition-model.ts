import { nanoid } from 'nanoid';

import { query } from '../config/db';

export interface IUserCompetition {
  id?: string;
  userId?: string;
  competitionId?: string;
}

export class UserCompetition {
  id?: string;
  userId?: string;
  competitionId?: string;

  constructor(userCompetition?: IUserCompetition) {
    if (userCompetition) {
      this.id = userCompetition.id;
      this.userId = userCompetition.userId;
      this.competitionId = userCompetition.competitionId;
    }
  }

  create(newUserCompetition: IUserCompetition) {
    const { userId, competitionId } = newUserCompetition;
    const id = nanoid();

    return new Promise<IUserCompetition>(async (resolve, reject) => {
      try {
        await query(
          "INSERT INTO user_competition SET id = ?, user_id = ?, competition_id = ?",
          [id, userId, competitionId]
        )
          .then((data) => {
            console.log("created new userCompetition: ", newUserCompetition);
            resolve(newUserCompetition);
          })
          .catch((e) => {
            console.log("Error creating new userCompetition", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new userCompetition", e);
        reject(e);
      }
    });
  }

  findById(userCompetitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "SELECT * FROM user_competition WHERE id = ?",
          userCompetitionId
        )
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(
                `Found UserCompetition with id ${userCompetitionId}: `,
                data[0]
              );
              resolve(data[0]);
            } else {
              console.log("UserCompetition not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding UserCompetition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding UserCompetition:", e);
        reject(e);
      }
    });
  }

  getUserCompetitionData(userId: string, competitionId: string) {
    const getUserCompetitionActivities = new Promise(
      async (resolve, reject) => {
        try {
          await query(
            `SELECT a.id, distance, a.end_date, a.type, a.name,
            distance * (
              CASE
                WHEN (a.type = 'swim') THEN 1200
                WHEN (a.type = 'bike') THEN 100
                WHEN (a.type = 'run') THEN 300
                ELSE 1
              END
            ) AS points
            FROM activity a
            JOIN user_competition uc ON uc.user_id = a.user_id
            JOIN competition c ON uc.competition_id = c.id
            WHERE a.user_id = ? AND c.id = ?
              AND a.start_date > c.start_date
              AND a.end_date < c.end_date
            ORDER BY end_date`,

            [userId, competitionId]
          )
            .then((data: any) => {
              if (data.length) {
                console.log(
                  `User ${userId}'s activities in competition ${competitionId}: `,
                  data
                );
                resolve(data);
              } else {
                console.log(
                  `Error getting points for ${userId} in competition ${competitionId}`
                );
                resolve({
                  errorMessage: "Start date or end date not set",
                });
              }
            })
            .catch((e) => {
              console.log("error: ", e);
              reject(e);
            });
        } catch (e) {
          console.log("error: ", e);
          reject(e);
        }
      }
    );

    const getIsUserAdmin = new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT count(1) as isUserAdmin
            FROM admin_competition ac
            WHERE ac.user_id = ? AND ac.competition_id = ?`,
          [userId, competitionId]
        )
          .then((data: any) => {
            console.log(
              `User ${userId}'s admin permissions in competition ${competitionId}: `,
              data
            );
            resolve(!!data[0].isUserAdmin);
          })
          .catch((e) => {
            console.log("error: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("error: ", e);
        reject(e);
      }
    });

    const getIsUserParticipant = new Promise(async (resolve, reject) => {
      console.log("--getting user participant--");
      try {
        await query(
          `SELECT count(1) as isUserParticipant
                  FROM user_competition uc
                  WHERE uc.user_id = ? AND uc.competition_id = ?`,
          [userId, competitionId]
        )
          .then((data: any) => {
            console.log(
              `User ${userId}'s participant permissions in competition ${competitionId}: `,
              data
            );
            resolve(!!data[0].isUserParticipant);
          })
          .catch((e) => {
            console.log("error: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("error: ", e);
        reject(e);
      }
    });

    const getUserHasTeam = new Promise(async (resolve, reject) => {
      console.log("--getting user has team--");
      try {
        // await query(
        //   `SELECT count(1) as userHasTeam
        //           FROM user_team ut
        //           JOIN team_competition tc ON tc.team_id = ut.team_id
        //           WHERE ut.user_id = ? AND tc.competition_id = ?`,
        //   [userId, competitionId]
        // )
        await query(
          `SELECT ut.team_id, ut.id
                  FROM user_team ut
                  JOIN team_competition tc ON tc.team_id = ut.team_id
                  WHERE ut.user_id = ? AND tc.competition_id = ?`,
          [userId, competitionId]
        )
          .then((data: any) => {
            console.log(
              `User ${userId}'s has a team in competition ${competitionId}: `,
              data[0]
            );
            resolve(data[0]);
            // resolve(!!data[0].userHasTeam);
          })
          .catch((e) => {
            console.log("error: ", e);
            resolve({ team_id: null, id: null });
          });
      } catch (e) {
        console.log("error: ", e);
        reject(e);
      }
    });

    return Promise.all([
      getUserCompetitionActivities,
      getIsUserAdmin,
      getIsUserParticipant,
      getUserHasTeam,
    ]);
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM user_competition")
          .then((data) => {
            console.log("UserCompetitions:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving UserCompetitions: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving UserCompetitions:", e);
        reject(e);
      }
    });
  }

  updateById(
    userCompetitionId: string,
    updatedUserCompetition: IUserCompetition
  ) {
    const { id, userId, competitionId } = updatedUserCompetition;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE user_competition SET id = ?, userId = ?, competitionId = ? WHERE id = ?",
          [id, userId, competitionId, userCompetitionId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedUserCompetition);
          })
          .catch((e) => {
            console.log("Error updating UserCompetition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating UserCompetition: ", e);
        reject(e);
      }
    });
  }

  deleteById(userCompetitionId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "DELETE FROM user_competition WHERE id = ?",
          userCompetitionId
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log(
                "Deleted userCompetition with id: ",
                userCompetitionId
              );
              resolve(res);
            }
          })
          .catch((e) => {
            console.log("error: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("error: ", e);
        reject(e);
      }
    });
  }

  deleteAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("DELETE FROM user_competition")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} userCompetitions`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting UserCompetitions", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting UserCompetitions", e);
        reject(e);
      }
    });
  }
}

export default UserCompetition;
