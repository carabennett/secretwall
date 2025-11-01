// server/index.js
import { Server } from 'boardgame.io/dist/cjs/server.js';
import { SecretWall } from '../shared/game.js';

const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const server = Server({
  games: [SecretWall],
  origins: allowed.length
    ? allowed
    : [
        'http://localhost:5173',
        'https://carabennett.github.io',
        'https://carabennett.github.io/secretwall'
      ],
});

server.run(process.env.PORT || 8000);
