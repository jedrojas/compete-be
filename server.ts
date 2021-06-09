import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import activityRouter from './app/routes/activity-router';
import competitionRouter from './app/routes/competition-router';
import teamRouter from './app/routes/team-router';
import userCompetitionRouter from './app/routes/user-competition-router';
import userRouter from './app/routes/user-router';
import userTeamRouter from './app/routes/user-team-router';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to COMPETE!!" });
});

app.use("/", activityRouter);

app.use("/", competitionRouter);

app.use("/", teamRouter);

app.use("/", userCompetitionRouter);

app.use("/", userRouter);

app.use("/", userTeamRouter);

app.listen(3000, () => console.log("Server is running on port 3000!"));
