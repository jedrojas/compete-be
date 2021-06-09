import { query } from '../config/db';

export interface ICompetition {
  id?: string;
  name?: string;
  start_date?: Date | null;
  end_date?: Date | null;
  type?: string;
}

export class Competition {
  id?: string;
  name?: string;
  start_date?: Date | null;
  end_date?: Date | null;
  type?: string;

  constructor(competition?: ICompetition) {
    if (competition) {
      this.id = competition.id;
      this.name = competition.name;
      this.start_date = competition.start_date;
      this.end_date = competition.end_date;
      this.type = competition.type;
    }
  }

  create(newCompetition: ICompetition) {
    return new Promise<ICompetition>(async (resolve, reject) => {
      try {
        await query("INSERT INTO competition SET ?", newCompetition)
          .then((data) => {
            console.log("created new competition: ", newCompetition);
            resolve(newCompetition);
          })
          .catch((e) => {
            console.log("Error creating new competition", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new competition", e);
        reject(e);
      }
    });
  }

  findById(competitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM competition WHERE id = ?", [competitionId])
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(
                `Found Competition with id ${competitionId}: `,
                data[0]
              );
              resolve(data[0]);
            } else {
              console.log("Competition not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding Competition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding Competition:", e);
        reject(e);
      }
    });
  }

  findIndividualParticipants(competitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT *
              FROM user u
              JOIN user_competition uc ON uc.user_id = u.id
              WHERE uc.competition_id = ?
              `,
          [competitionId]
        )
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(
                `Participants in competition ${competitionId}: `,
                data
              );
              resolve(data);
            } else {
              console.log("No participants found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding participants for competition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding participants for competition:", e);
        reject(e);
      }
    });
  }

  findTeamParticipants(competitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT *
              FROM team t
              JOIN team_competition tc ON tc.team_id = t.id
              WHERE tc.competition_id = ?
              `,
          [competitionId]
        )
          // TODO: type data
          .then((data: any) => {
            console.log("--DEBUGGING--", data);
            if (data.length) {
              console.log(`teams in competition ${competitionId}: `, data);
              resolve(data);
            } else {
              console.log("--DEBUGGING error--", data);

              console.log("No participants found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding teams for competition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding teams for competition:", e);
        reject(e);
      }
    });
  }

  findAllByUserId(userId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "SELECT * FROM competition c JOIN user_competition uc ON uc.competition_id = c.id WHERE uc.user_id = ?",
          userId
        ).then((data: any) => {
          if (data.length) {
            console.log(
              `Found competitions for user with id ${userId}: `,
              data
            );
            resolve(data);
          } else {
            console.log("No competitions");
            reject({ kind: "not_found" });
          }
        });
      } catch (e) {
        console.log("Error finding user's competitions:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM competition ORDER BY name")
          .then((data) => {
            console.log("Competitions:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving Competitions: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving Competitions:", e);
        reject(e);
      }
    });
  }

  getAthleteLeaderboard(competitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT first_name,
            SUM (
              distance * (
                CASE
                  WHEN (a.start_date < c.start_date) THEN 0
                  WHEN (a.end_date > c.end_date) THEN 0
                  WHEN (a.type = 'swim') THEN 12
                  WHEN (a.type = 'bike') THEN 1
                  WHEN (a.type = 'run') THEN 3
                  ELSE 1
                END
              )
            ) AS points
            FROM user u
            JOIN activity a
            JOIN user_competition uc ON uc.user_id = u.id
            JOIN competition c ON uc.competition_id = c.id
            WHERE uc.competition_id = ?
            GROUP BY u.id
          `,
          competitionId
        )
          .then((data) => {
            console.log("Athlete Leaderboard: ", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving athlete leaderboard: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving athlete leaderboard: ", e);
        reject(e);
      }
    });
  }

  getTeamLeaderboard(competitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT t.name,
            SUM (  
              distance * (
                CASE 
                  WHEN (a.start_date < c.start_date) THEN 0
                  WHEN (a.end_date > c.end_date) THEN 0
                  WHEN (a.type = 'swim') THEN 12
                  WHEN (a.type = 'bike') THEN 1
                  WHEN (a.type = 'run') THEN 3
                  ELSE 1
                END
              )
            ) AS points
            FROM team t
            JOIN user_team ut ON ut.team_id = t.id
            JOIN activity a
            JOIN user_competition uc ON uc.user_id = ut.user_id
            JOIN competition c ON uc.competition_id = c.id
            WHERE uc.competition_id = ?
            GROUP BY ut.team_id
            ORDER BY points DESC
          `,
          competitionId
        )
          .then((data) => {
            console.log("Team Leaderboard: ", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving team leaderboard: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving team leaderboard: ", e);
        reject(e);
      }
    });
  }

  getActivities(competitionId: string, sortOrder?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `
          SELECT *, (  
            distance * (
              CASE 
                WHEN (a.type = 'swim') THEN 12
                WHEN (a.type = 'bike') THEN 1
                WHEN (a.type = 'run') THEN 3
                ELSE 1
              END
            )
          ) AS points
            FROM activity a
            JOIN user u ON u.id = a.user_id
            JOIN user_competition uc ON u.id = uc.user_id
            JOIN competition c ON c.id = uc.competition_id
            WHERE uc.competition_id = ? AND a.start_date > c.start_date AND a.end_date < c.end_date
        `,
          competitionId
        )
          .then((data) => {
            console.log(`Activities from competition: ${competitionId}`, data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving competition's activities: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving competition's activities: ", e);
        reject(e);
      }
    });
  }

  updateById(competitionId: string, updatedCompetition: ICompetition) {
    const { id, name, type, start_date, end_date } = updatedCompetition;

    const startDate = start_date ?? "NULL";
    const endDate = end_date ?? "NULL";

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE competition SET id = ?, name = ?, type = ?, start_date = ?, end_date = ? WHERE id = ?",
          [id, name, type, startDate, endDate, competitionId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedCompetition);
          })
          .catch((e) => {
            console.log("Error updating Competition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating Competition: ", e);
        reject(e);
      }
    });
  }

  deleteById(competitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("DELETE FROM competition WHERE id = ?", competitionId)
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log("Deleted competition with id: ", competitionId);
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
        await query("DELETE FROM competition")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} competitions`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting Competitions", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting Competitions", e);
        reject(e);
      }
    });
  }
}

export default Competition;
