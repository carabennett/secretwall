// server/index.js
import { Server } from 'boardgame.io/server';
import { TicTacToe } from '../shared/game.js';

const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const server = Server({
  games: [TicTacToe],
  origins: allowed.length
    ? allowed
    : [
        'http://localhost:5173',
        'https://<username>.github.io',
        'https://<username>.github.io/<repo-name>'
      ],
});

server.run(process.env.PORT || 8000);
