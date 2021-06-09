import { nanoid } from 'nanoid';
import fetch from 'node-fetch';

import { query } from '../config/db';
import { toSqlDateTimeFormat } from '../utils';

export interface IActivity {
  id?: string;
  strava_id?: string;
  name?: string;
  start_date?: Date;
  end_date?: Date;
  elapsed_time?: number;
  distance?: number;
  type?: string;
  points?: number;
}

export class Activity {
  name?: string;
  id?: string;
  distance?: number;
  type?: string;

  constructor(activity?: IActivity) {
    if (activity) {
      this.name = activity.name;
      this.id = activity.id;
      this.distance = activity.distance;
      this.type = activity.type;
    }
  }

  create(newActivity: IActivity) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("INSERT INTO activity SET ?", newActivity)
          .then((data) => {
            console.log("created new activity: ", newActivity);
            resolve(newActivity);
          })
          .catch((e) => {
            console.log("Error creating new activity", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new activity", e);
        reject(e);
      }
    });
  }

  getStravaActivities(token: string, user_id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await fetch(
          "https://www.strava.com/api/v3/athlete/activities?per_page=100&page=1",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // redirect: "follow",
          }
        )
          .then((res) => res.json())
          // TODO: type this
          .then(async (data: IActivity[]) => {
            console.log("--strava res--", data);
            const values = data.map((activity) => {
              const id = nanoid();
              const end_date = new Date(activity.start_date!);
              end_date.setSeconds(
                end_date.getSeconds() + activity.elapsed_time!
              );

              return [
                id,
                activity.id,
                activity.name,
                user_id,
                toSqlDateTimeFormat(activity.start_date!),
                toSqlDateTimeFormat(end_date),
                activity.distance,
                activity.type?.toLowerCase(),
              ];
            });

            await query(
              `INSERT IGNORE INTO activity(id, strava_id, name, user_id,
                start_date, end_date, distance, type)
                VALUES ?`,
              [values]
            )
              .then((data) => {
                // console.log("Added Strava activities to Compete db: ", values);
                // console.log("Added values", values.length);
                // console.log(
                // "Affected rows",
                // (data as any).affectedRows ?? "idk"
                // );
                resolve(values);
              })
              .catch((e) => {
                console.log("Error retrieving activities from Strava", e);
                reject(e);
              });
          })
          .catch((e) => {
            console.log("Error retrieving Strava activities", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error creating new activity", e);
        reject(e);
      }
    });
  }

  findById(activityId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM activity WHERE id = ?", activityId)
          // TODO: type data
          .then((data: any) => {
            if (data.length) {
              console.log(`Found Activity with id ${activityId}: `, data[0]);
              resolve(data[0]);
            } else {
              console.log("Activity not found");
              reject({ kind: "not_found" });
            }
          })
          .catch((e) => {
            console.log("Error finding Activity: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error finding Activity:", e);
        reject(e);
      }
    });
  }

  findAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await query("SELECT * FROM activity")
          .then((data) => {
            console.log("Activities:", data);
            console.log("Number of activities:", (data as any).length);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error retrieving Activities: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error retrieving Activities:", e);
        reject(e);
      }
    });
  }

  updateById(activityId: number, updatedActivity: IActivity) {
    const { id, distance, type } = updatedActivity;

    return new Promise(async (resolve, reject) => {
      try {
        await query(
          "UPDATE activity SET id = ?, distance = ?, type = ? WHERE id = ?",
          [id, distance, type, activityId]
        )
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            }
            resolve(updatedActivity);
          })
          .catch((e) => {
            console.log("Error updating Activity: ", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error updating Activity: ", e);
        reject(e);
      }
    });
  }

  deleteById(activityId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await query("DELETE FROM activity WHERE id = ?", activityId)
          .then((res: any) => {
            if (res.affectedRows === 0) {
              reject({ kind: "not_found" });
            } else {
              console.log("Deleted activity with id: ", activityId);
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
        await query("DELETE FROM activity")
          .then((data: any) => {
            console.log(`Deleted ${data.affectedRows} activities`);
            resolve(data);
          })
          .catch((e) => {
            console.log("Error deleting Activities", e);
            reject(e);
          });
      } catch (e) {
        console.log("Error deleting Activities", e);
        reject(e);
      }
    });
  }
}

export default Activity;
