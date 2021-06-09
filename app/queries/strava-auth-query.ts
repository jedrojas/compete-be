import fetch from 'node-fetch';

export const getAccessAndRefreshToken = (appConfig: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fetch(
        `https://www.strava.com/api/v3/oauth/token?${new URLSearchParams(
          appConfig
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((e) => reject(e));
    } catch (e) {
      reject(e);
    }
  });
};
