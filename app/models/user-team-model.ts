import { query } from '../config/db';

export interface IUserTeam {
  id?: string;
  userId?: string;
  teamId?: string;
}

export class UserTeam {
  id?: string;
  userId?: string;
  teamId?: string;

  constructor(userTeam?: IUserTeam) {
    if (userTeam) {
      this.id = userTeam.id;
      this.userId = userTeam.userId;
      this.teamId = userTeam.teamId;
    }
  }

  create(newUserTeam: IUserTeam) {
    const { id, userId, teamId } = newUserTeam;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "INSERT INTO user_team SET id = ?, user_id = ?, team_id = ?",
          [id, userId, teamId]
        )
          .then((data) => {
            console.log("created new user_team: ", newUserTeam);
            resolve(newUserTeam);
          })
          .catch((e) => {
            console.log("Error creating new userTeam", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new userTeam", e);
        reject(e);
      }
    });
  }

  findById(userTeamId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM user_team WHERE id = ?", userTeamId)
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(`Found UserTeam with id ${userTeamId}: `, data[0]);
              resolve(data[0]);
            } else {
              console.log("UserTeam not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding UserTeam: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding UserTeam:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM user_team")
          .then((data) => {
            console.log("UserTeams:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving UserTeams: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving UserTeams:", e);
        reject(e);
      }
    });
  }

  updateById(userTeamId: number, updatedUserTeam: IUserTeam) {
    const { id, userId, teamId } = updatedUserTeam;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE user_team SET id = ?, user_id = ?, team_id = ? WHERE id = ?",
          [id, userId, teamId, userTeamId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedUserTeam);
          })
          .catch((e) => {
            console.log("Error updating UserTeam: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating UserTeam: ", e);
        reject(e);
      }
    });
  }

  deleteById(userTeamId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("DELETE FROM user_team WHERE id = ?", userTeamId)
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log("Deleted userTeam with id: ", userTeamId);
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
        await query("DELETE FROM user_team")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} userTeams`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting UserTeams", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting UserTeams", e);
        reject(e);
      }
    });
  }
}

export default UserTeam;
