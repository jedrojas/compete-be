import { connection } from './db';

const createUserTable = `CREATE TABLE IF NOT EXISTS \`user\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

const createCompetitionTable = `CREATE TABLE IF NOT EXISTS \`competition\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  name varchar(255) NOT NULL,
  start_date DATETIME,
  end_date DATETIME,
  type varchar(255) NOT NULL,
  icon varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

const createUserCompetitionTable = `CREATE TABLE IF NOT EXISTS \`user_competition\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  user_id varchar(255) NOT NULL,
  competition_id varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (competition_id) REFERENCES competition(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

// Tracks which users have admin status for each competition
const createAdminCompetitionTable = `CREATE TABLE IF NOT EXISTS \`admin_competition\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  user_id varchar(255) NOT NULL,
  competition_id varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (competition_id) REFERENCES competition(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

const createActivityTable = `CREATE TABLE IF NOT EXISTS \`activity\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  strava_id bigint UNIQUE,
  name varchar(255) NOT NULL,
  user_id varchar(255) NOT NULL,
  distance decimal(6, 1) NOT NULL,
  start_date DATETIME,
  end_date DATETIME,
  type varchar(30) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

const createTeamTable = `CREATE TABLE IF NOT EXISTS \`team\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  name varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

const createUserTeamTable = `CREATE TABLE IF NOT EXISTS \`user_team\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  user_id varchar(255) NOT NULL,
  team_id varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (team_id) REFERENCES team(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

const createTeamCompetitionTable = `CREATE TABLE IF NOT EXISTS \`team_competition\` (
  id varchar(255) NOT NULL PRIMARY KEY,
  team_id varchar(255) NOT NULL,
  competition_id varchar(255) NOT NULL,
  FOREIGN KEY (team_id) REFERENCES team(id),
  FOREIGN KEY (competition_id) REFERENCES competition(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci;`;

connection.query(createUserTable, (err, res) => {
  if (err) {
    console.log("Error creating user table: ", err);
  } else {
    console.log("Successfully created user table");
  }
});
connection.query(createCompetitionTable, (err, res) => {
  if (err) {
    console.log("Error creating competition table: ", err);
  } else {
    console.log("Successfully created competition table");
  }
});
connection.query(createUserCompetitionTable, (err, res) => {
  if (err) {
    console.log("Error creating user_competition table: ", err);
  } else {
    console.log("Successfully created user_competition table");
  }
});
connection.query(createAdminCompetitionTable, (err, res) => {
  if (err) {
    console.log("Error creating admin_competition table: ", err);
  } else {
    console.log("Successfully created admin_competition table");
  }
});
connection.query(createActivityTable, (err, res) => {
  if (err) {
    console.log("Error creating activity table: ", err);
  } else {
    console.log("Successfully created activity table");
  }
});
connection.query(createTeamTable, (err, res) => {
  if (err) {
    console.log("Error creating team table: ", err);
  } else {
    console.log("Successfully created team table");
  }
});
connection.query(createUserTeamTable, (err, res) => {
  if (err) {
    console.log("Error creating user_team table: ", err);
  } else {
    console.log("Successfully created user_team table");
  }
});
connection.query(createTeamCompetitionTable, (err, res) => {
  if (err) {
    console.log("Error creating team_competition table: ", err);
  } else {
    console.log("Successfully created team_competition table");
  }
});

connection.end();
