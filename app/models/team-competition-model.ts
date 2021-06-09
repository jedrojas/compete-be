import { query } from '../config/db';

export interface ITeamCompetition {
  id?: string;
  teamId?: string;
  competitionId?: string;
}

export class TeamCompetition {
  id?: string;
  teamId?: string;
  competitionId?: string;

  constructor(teamCompetition?: ITeamCompetition) {
    if (teamCompetition) {
      this.id = teamCompetition.id;
      this.teamId = teamCompetition.teamId;
      this.competitionId = teamCompetition.competitionId;
    }
  }

  create(newTeamCompetition: ITeamCompetition) {
    const { id, teamId, competitionId } = newTeamCompetition;

    return new Promise<ITeamCompetition>(async (resolve, reject) => {
      try {
        await query(
          "INSERT INTO team_competition SET id = ?, team_id = ?, competition_id = ?",
          [id, teamId, competitionId]
        )
          .then((data) => {
            console.log("created new teamCompetition: ", newTeamCompetition);
            resolve(newTeamCompetition);
          })
          .catch((e) => {
            console.log("Error creating new teamCompetition", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new teamCompetition", e);
        reject(e);
      }
    });
  }

  findById(teamCompetitionId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "SELECT * FROM team_competition WHERE id = ?",
          teamCompetitionId
        )
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(
                `Found TeamCompetition with id ${teamCompetitionId}: `,
                data[0]
              );
              resolve(data[0]);
            } else {
              console.log("TeamCompetition not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding TeamCompetition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding TeamCompetition:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM team_competition")
          .then((data) => {
            console.log("TeamCompetitions:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving TeamCompetitions: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving TeamCompetitions:", e);
        reject(e);
      }
    });
  }

  updateById(
    teamCompetitionId: string,
    updatedTeamCompetition: ITeamCompetition
  ) {
    const { id, teamId, competitionId } = updatedTeamCompetition;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE team_competition SET id = ?, teamId = ?, competitionId = ? WHERE id = ?",
          [id, teamId, competitionId, teamCompetitionId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedTeamCompetition);
          })
          .catch((e) => {
            console.log("Error updating TeamCompetition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating TeamCompetition: ", e);
        reject(e);
      }
    });
  }

  deleteById(teamCompetitionId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "DELETE FROM team_competition WHERE id = ?",
          teamCompetitionId
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log(
                "Deleted teamCompetition with id: ",
                teamCompetitionId
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
        await query("DELETE FROM team_competition")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} teamCompetitions`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting TeamCompetitions", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting TeamCompetitions", e);
        reject(e);
      }
    });
  }
}

export default TeamCompetition;
