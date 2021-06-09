import { nanoid } from 'nanoid';

import { query } from '../config/db';

export interface IAdminCompetition {
  id?: string;
  userId?: string;
  competitionId?: string;
}

export class AdminCompetition {
  id?: string;
  userId?: string;
  competitionId?: string;

  constructor(adminCompetition?: IAdminCompetition) {
    if (adminCompetition) {
      this.id = adminCompetition.id;
      this.userId = adminCompetition.userId;
      this.competitionId = adminCompetition.competitionId;
    }
  }

  create(newAdminCompetition: IAdminCompetition) {
    const { userId, competitionId } = newAdminCompetition;
    const id = nanoid();

    return new Promise<IAdminCompetition>(async (resolve, reject) => {
      try {
        await query(
          "INSERT INTO admin_competition SET id = ?, user_id = ?, competition_id = ?",
          [id, userId, competitionId]
        )
          .then((data) => {
            console.log("created new adminCompetition: ", newAdminCompetition);
            resolve(newAdminCompetition);
          })
          .catch((e) => {
            console.log("Error creating new adminCompetition", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new adminCompetition", e);
        reject(e);
      }
    });
  }

  findById(adminCompetitionId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "SELECT * FROM admin_competition WHERE id = ?",
          adminCompetitionId
        )
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(
                `Found AdminCompetition with id ${adminCompetitionId}: `,
                data[0]
              );
              resolve(data[0]);
            } else {
              console.log("AdminCompetition not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding AdminCompetition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding AdminCompetition:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM admin_competition")
          .then((data) => {
            console.log("AdminCompetitions:", data);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving AdminCompetitions: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving AdminCompetitions:", e);
        reject(e);
      }
    });
  }

  updateById(
    adminCompetitionId: string,
    updatedAdminCompetition: IAdminCompetition
  ) {
    const { id, userId, competitionId } = updatedAdminCompetition;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE admin_competition SET id = ?, userId = ?, competitionId = ? WHERE id = ?",
          [id, userId, competitionId, adminCompetitionId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedAdminCompetition);
          })
          .catch((e) => {
            console.log("Error updating AdminCompetition: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating AdminCompetition: ", e);
        reject(e);
      }
    });
  }

  deleteById(adminCompetitionId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "DELETE FROM admin_competition WHERE id = ?",
          adminCompetitionId
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log(
                "Deleted adminCompetition with id: ",
                adminCompetitionId
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
        await query("DELETE FROM admin_competition")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} AdminCompetitions`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting AdminCompetitions", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting AdminCompetitions", e);
        reject(e);
      }
    });
  }
}

export default AdminCompetition;
