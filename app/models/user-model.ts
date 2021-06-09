import { query } from '../config/db';

export interface IUser {
  id?: string;
  first_name?: string;
  last_name?: string;
}

export class User {
  id?: string;
  first_name?: string;
  last_name?: string;

  constructor(user?: IUser) {
    if (user) {
      this.id = user.id;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
    }
  }

  create(newUser: IUser) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("INSERT INTO user SET ?", newUser)
          .then((data) => {
            console.log("created new user: ", newUser, data);
            resolve(newUser);
          })
          .catch((e) => {
            console.log("Error creating new user", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new user", e);
        reject(e);
      }
    });
  }

  findById(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT first_name, last_name
            FROM user u
            WHERE u.id = ?`,
          userId
        )
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              resolve({
                first_name: data[0].first_name ?? "",
                last_name: data[0].last_name ?? "",
              });
            } else {
              console.log("User not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding User: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding User:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM user")
          .then((data) => {
            console.log("Users:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving Users: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving Users:", e);
        reject(e);
      }
    });
  }

  updateById(userId: number, updatedUser: IUser) {
    const { id, first_name, last_name } = updatedUser;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE user SET id = ?, first_name = ?, last_name = ? WHERE id = ?",
          [id, first_name, last_name, userId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedUser);
          })
          .catch((e) => {
            console.log("Error updating User: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating User: ", e);
        reject(e);
      }
    });
  }

  deleteById(userId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("DELETE FROM user WHERE id = ?", userId)
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log("Deleted user with id: ", userId);
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
        await query("DELETE FROM user")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} users`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting Users", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting Users", e);
        reject(e);
      }
    });
  }

  getActivities(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT name, distance, end_date, type, distance
            FROM activity p
            WHERE user_id = ?
            ORDER BY end_date DESC`,
          userId
        )
          .then((data: any) => {
            // if (data.length) {
            console.log(`User ${userId}'s activities: `, data);
            resolve(data);
            // } else {
            // console.log("User not found");
            // reject({ kind: "not_found" });
            // }
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

  getUserActivitiesByCompetition(userId: string, competitionId: string) {
    return new Promise(async (resolve, reject) => {
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
              console.log(`User ${userId}'s activities: `, data);
              resolve(data);
            } else {
              console.log("User not found");
              reject({ kind: "not_found" });
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

  // TODO: only call this when start/end dates are added
  getUserPointsByCompetition(userId: string, competitionId: string) {
    return new Promise(async (resolve, reject) => {
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
              console.log(`User ${userId}'s activities: `, data);
              resolve(data);
            } else {
              console.log(
                `Error getting points for ${userId} in competition ${competitionId}`
              );
              reject({ kind: "not_found" });
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

  getUserCompetitions(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT c.id, name, start_date, end_date, type,
              EXISTS(
                SELECT * FROM admin_competition ac 
                WHERE ac.user_id = ?
              ) as isUserAdmin
            FROM competition c
            JOIN user_competition uc ON uc.competition_id = c.id
            WHERE uc.user_id = ?
          `,
          [userId, userId]
        )
          // TODO: type this
          .then((data: any) => {
            console.log(`User ${userId}'s activities: `, data);
            resolve(data);
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

  getUserJoinableCompetitions(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          `SELECT c.id, name, start_date, end_date, type, c.id IN (
            SELECT competition_id FROM user_competition WHERE user_id = ?
            UNION
            SELECT competition_id FROM admin_competition WHERE user_id = ?
          ) AS is_joined
            FROM competition c
          `,
          [userId, userId]
        )
          .then((data: any) => {
            if (data.length) {
              console.log(`User ${userId}'s activities: `, data);
              resolve(data);
            } else {
              console.log("User not found");
              reject({ kind: "not_found" });
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
}

export default User;
