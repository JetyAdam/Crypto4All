import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(morgan("coins"));

// routes
app.get("/coins", (req, res) => {
  const url = "https://api.coinranking.com/v2/coins";
  (async () => {
    try {
      await fetch(`${url}`, {
        headers: {
          "x-access-token": `${process.env.COIN_RANKING_API_KEY}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          res.json(json);
        });
    } catch (err) {
      console.error(err);
    }
  })();
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on Port, ${port}`);
});
