// client/src/App.jsx
import { Client as BGClient } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { TicTacToe } from '../../shared/game';

const serverURL = 'https://<your-render-service>.onrender.com';

function Board({ G, ctx, moves }) {
  return (
    <div style={{ width: 240, display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: 4 }}>
      {G.cells.map((c, i) => (
        <button key={i} onClick={() => moves.clickCell(i)} style={{ height: 80, fontSize: 24 }}>
          {c ?? ''}
        </button>
      ))}
      <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
        {ctx.gameover
          ? ctx.gameover.winner ? `Winner: ${ctx.gameover.winner}` : 'Draw'
          : `Player: ${ctx.currentPlayer}`}
      </div>
    </div>
  );
}

const TicTacToeClient = BGClient({
  game: TicTacToe,
  board: Board,
  multiplayer: SocketIO({ server: serverURL }),
  debug: false
});

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Tic-Tac-Toe</h1>
      <p>Open this page on two devices or browsers and both will control the same room.</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <h3>Player 0</h3>
          <TicTacToeClient matchID="public-room-1" playerID="0" />
        </div>
        <div>
          <h3>Player 1</h3>
          <TicTacToeClient matchID="public-room-1" playerID="1" />
        </div>
      </div>
    </div>
  );
}
