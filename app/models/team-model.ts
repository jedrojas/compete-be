import { query } from '../config/db';

export interface ITeam {
  id?: string;
  name?: string;
}

export class Team {
  id?: string;
  name?: string;

  constructor(team?: ITeam) {
    if (team) {
      this.id = team.id;
      this.name = team.name;
    }
  }

  create(newTeam: ITeam) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("INSERT INTO team SET ?", newTeam)
          .then((data) => {
            console.log("created new team: ", newTeam);
            resolve(newTeam);
          })
          .catch((e) => {
            console.log("Error creating new team", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new team", e);
        reject(e);
      }
    });
  }

  findById(teamId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM team WHERE id = ?", teamId)
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(`Found Team with id ${teamId}: `, data[0]);
              resolve(data[0]);
            } else {
              console.log("Team not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding Team: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding Team:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM team")
          .then((data) => {
            console.log("Teams:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving Teams: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving Teams:", e);
        reject(e);
      }
    });
  }

  updateById(teamId: string, updatedTeam: ITeam) {
    const { id, name } = updatedTeam;

    return new Promise(async (resolve, reject) => {
      try {
        await query("UPDATE team SET id = ?, name = ? WHERE id = ?", [
          id,
          name,
          teamId,
        ])
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedTeam);
          })
          .catch((e) => {
            console.log("Error updating Team: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating Team: ", e);
        reject(e);
      }
    });
  }

  deleteById(teamId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("DELETE FROM team WHERE id = ?", teamId)
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log("Deleted team with id: ", teamId);
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
        await query("DELETE FROM team")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} teams`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting Teams", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting Teams", e);
        reject(e);
      }
    });
  }
}

export default Team;
