import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import fetch from 'node-fetch';
const app = express();

app.use(cors());
app.use(morgan('coins'));

// routes
app.get('/coins', (req, res) => {
  const url = 'https://api.coinranking.com/v2/coins';
  (async () => {
    try {
      await fetch(`${url}`, {
        headers: {
          'x-access-token': `${process.env.COIN_RANKING_API_KEY}`,
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

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Listening on Port, ${port}`);
});
