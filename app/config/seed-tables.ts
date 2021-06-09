import { connection } from './db';

// dates for competitions
const date1 = new Date(1577854800000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
const date2 = new Date(1641013200000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

// dates for activities
const date3 = new Date(1600000000000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
const date4 = new Date(1600001000000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

// dates to test filter by date
const date5 = new Date(1577854700000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
const date6 = new Date(1577854780000)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

// const createUser0 = `INSERT INTO user SET id = 'google-oauth2|113533957380961964462', first_name = 'Jed', last_name = 'Rojas';`;
const createUser1 = `INSERT INTO user SET id = '1', first_name = 'Jerry', last_name = 'Rojas';`;
const createUser2 = `INSERT INTO user SET id = '2', first_name = 'Rissa', last_name = 'Rojas';`;

const createCompetition0 = `INSERT INTO competition SET id = '0', name = 'AG5000', type = 'team', start_date = ?, end_date = ?;`;
const createCompetition1 = `INSERT INTO competition SET id = '1', name = 'Miami 9000', type = 'team', start_date = ?, end_date = ?;`;
const createCompetition2 = `INSERT INTO competition SET id = '2', name = 'Daleee', type = 'team', start_date = ?, end_date = ?;`;

// const createUserCompetition0 = `INSERT INTO user_competition SET id = '0', user_id = 'google-oauth2|113533957380961964462', competition_id = '0';`;
// const createUserCompetition1 = `INSERT INTO user_competition SET id = '1', user_id = 'google-oauth2|113533957380961964462', competition_id = '1';`;
// const createUserCompetition2 = `INSERT INTO user_competition SET id = '2', user_id = 'google-oauth2|113533957380961964462', competition_id = '2';`;

const createUserCompetition3 = `INSERT INTO user_competition SET id = '3', user_id = '1', competition_id = '0';`;
const createUserCompetition4 = `INSERT INTO user_competition SET id = '4', user_id = '2', competition_id = '0';`;

const createTeam0 = `INSERT INTO team SET id = '0', name = 'Tune Squad';`;
const createTeam1 = `INSERT INTO team SET id = '1', name = 'Monstars';`;

// const createUserTeam0 = `INSERT INTO user_team SET id = '0', user_id = 'google-oauth2|113533957380961964462', team_id = '0'`;
const createUserTeam1 = `INSERT INTO user_team SET id = '1', user_id = '1', team_id = '1'`;
const createUserTeam2 = `INSERT INTO user_team SET id = '2', user_id = '2', team_id = '1'`;

// const createActivity0 = `INSERT INTO activity SET id = '0', name = 'morning run', user_id = 'google-oauth2|113533957380961964462', distance = 3.1, type = 'run', start_date = ?, end_date = ?;`;
// const createActivity1 = `INSERT INTO activity SET id = '1', name = 'afternoon bike', user_id = 'google-oauth2|113533957380961964462',  distance = 7, type = 'bike', start_date = ?, end_date = ?;`;
// const createActivity2 = `INSERT INTO activity SET id = '2', name = 'evening swim', user_id = 'google-oauth2|113533957380961964462',  distance = .5, type = 'swim', start_date = ?, end_date = ?;`;

const createActivity3 = `INSERT INTO activity SET id = '3', name = 'morning run', user_id = '1', distance = 3.1, type = 'run', start_date = ?, end_date = ?;`;
const createActivity4 = `INSERT INTO activity SET id = '4', name = 'morning run', user_id = '1', distance = 3.1, type = 'run', start_date = ?, end_date = ?;`;

const createActivity5 = `INSERT INTO activity SET id = '5', name = 'morning swim', user_id = '2', distance = 3, type = 'swim', start_date = ?, end_date = ?;`;

const createActivity6 = `INSERT INTO activity SET id = '6', name = 'afternoon swim', user_id = '2', distance = 1, type = 'swim', start_date = ?, end_date = ?;`;

export interface IActivity {
  id?: number;
  distance?: number;
  type?: string;
}

// connection.query(createUser0, (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating user 0: ", err);
//   } else {
//     console.log("Successfully created user 0");
//   }
// });

connection.query(createUser1, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating user 1: ", err);
  } else {
    console.log("Successfully created user 1");
  }
});

connection.query(createUser2, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating user 2: ", err);
  } else {
    console.log("Successfully created user 2");
  }
});

connection.query(createCompetition0, [date1, date2], (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating competition 0: ", err);
  } else {
    console.log("Successfully created competition 0");
  }
});

connection.query(createCompetition1, [date1, date2], (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating competition 1: ", err);
  } else {
    console.log("Successfully created competition 1");
  }
});

connection.query(createCompetition2, [date1, date2], (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating competition 2: ", err);
  } else {
    console.log("Successfully created competition 2");
  }
});

// connection.query(createUserCompetition0, (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating user competition 0: ", err);
//   } else {
//     console.log("Successfully created user competition 0");
//   }
// });

// connection.query(createUserCompetition1, (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating user competition 1: ", err);
//   } else {
//     console.log("Successfully created user competition 1");
//   }
// });

// connection.query(createUserCompetition2, (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating user competition 2: ", err);
//   } else {
//     console.log("Successfully created user competition 2");
//   }
// });

connection.query(createUserCompetition3, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating user competition 3: ", err);
  } else {
    console.log("Successfully created user competition 3");
  }
});
connection.query(createUserCompetition4, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating user competition 4: ", err);
  } else {
    console.log("Successfully created user competition 4");
  }
});

connection.query(createTeam0, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating team 0: ", err);
  } else {
    console.log("Successfully created team 0");
  }
});

connection.query(createTeam1, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating team 1: ", err);
  } else {
    console.log("Successfully created team 1");
  }
});

// connection.query(createUserTeam0, (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating user team 0: ", err);
//   } else {
//     console.log("Successfully created team 0");
//   }
// });

connection.query(createUserTeam1, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating user team 1: ", err);
  } else {
    console.log("Successfully created team 1");
  }
});

connection.query(createUserTeam2, (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating user team 2: ", err);
  } else {
    console.log("Successfully created team 2");
  }
});

// connection.query(createActivity0, [date3, date4], (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating activity 0: ", err);
//   } else {
//     console.log("Successfully created activity 0");
//   }
// });

// connection.query(createActivity1, [date3, date4], (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating activity 1: ", err);
//   } else {
//     console.log("Successfully created activity 1");
//   }
// });

// connection.query(createActivity2, [date3, date4], (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating activity 2: ", err);
//   } else {
//     console.log("Successfully created activity 2");
//   }
// });

// connection.query(createActivity3, [date3, date4], (err, res) => {
//   if (err) {
//     if (err.code !== "ER_DUP_ENTRY")
//       console.log("Error creating activity 3: ", err);
//   } else {
//     console.log("Successfully created activity 3");
//   }
// });

connection.query(createActivity4, [date3, date4], (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating activity 4: ", err);
  } else {
    console.log("Successfully created activity 4");
  }
});

connection.query(createActivity5, [date3, date4], (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating activity 5: ", err);
  } else {
    console.log("Successfully created activity 5");
  }
});

connection.query(createActivity6, [date5, date6], (err, res) => {
  if (err) {
    if (err.code !== "ER_DUP_ENTRY")
      console.log("Error creating activity 6: ", err);
  } else {
    console.log("Successfully created activity 6");
  }
});

connection.end();
