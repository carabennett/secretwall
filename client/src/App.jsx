// client/src/App.jsx
import React from 'react';
import { Client as BGClient } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { SocketIO } from 'boardgame.io/multiplayer';
import { SecretWall } from '../../shared/game';

const serverURL = 'http://localhost:8000'; // unused with Local()

function Board({ G, ctx, moves, playerID /*, isActive*/ }) {
  const numPlayers = Number(ctx.numPlayers) || 2;
  const players = Array.from({ length: numPlayers }, (_, i) => String(i));

  const hasSubmitted = Boolean(G.submissions?.[playerID]);
  const submittedPlayers = new Set(Object.keys(G.submissions || {}));
  const allSubmitted = submittedPlayers.size === numPlayers;

  const [text, setText] = React.useState('');

  // local voting selections: { [secretText]: playerID }
  const [choices, setChoices] = React.useState({});

  const handleSubmitSecret = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || hasSubmitted) return;
    moves.SubmitSecret(t);
    setText('');
  };

  const handlePick = (secretText, targetPid) => {
    setChoices((prev) => ({ ...prev, [secretText]: targetPid }));
  };

  const handleVote = (secretText) => {
    const target = choices[secretText];
    if (!target) return;
    // one vote per secret per player enforced by your move/store
    moves.SubmitVote(secretText, target);
  };

  // helpers for disabling voted items
  const myVoteFor = (secretText) => G.votes?.[secretText]?.[playerID];
  const hasVotedFor = (secretText) => Boolean(myVoteFor(secretText));

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      {!allSubmitted ? (
        <>
          <h2>Secret submission</h2>
          <form onSubmit={handleSubmitSecret} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Type your secret (one time)…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={hasSubmitted}
              style={{ flex: 1, padding: 8 }}
            />
            <button type="submit" disabled={hasSubmitted || !text.trim()} style={{ padding: '8px 12px' }}>
              Submit
            </button>
          </form>

          <div style={{ marginTop: 16, fontSize: 14 }}>
            <strong>Your status:</strong> {hasSubmitted ? 'Submitted ✅' : 'Waiting ⏳'}
          </div>

          <hr style={{ margin: '16px 0' }} />

          <h3>Players</h3>
          <ul>
            {players.map((pid) => (
              <li key={pid}>
                Player {pid}: {submittedPlayers.has(pid) ? 'Submitted ✅' : 'Waiting ⏳'}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Voting phase</h2>
          <p>Vote once for each secret. Options are the player IDs.</p>

          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(G.submissions || {}).map(([authorPid, secretText]) => {
              const voted = hasVotedFor(secretText);
              const selected = choices[secretText] ?? '';
              return (
                <div key={authorPid} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Secret:</strong> {secretText}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    {players.map((optPid) => (
                      <label key={optPid} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="radio"
                          name={`vote-${secretText}`}
                          value={optPid}
                          disabled={voted}
                          checked={selected === optPid}
                          onChange={() => handlePick(secretText, optPid)}
                        />
                        {optPid}
                      </label>
                    ))}

                    <button
                      onClick={() => handleVote(secretText)}
                      disabled={voted || !selected}
                      style={{ marginLeft: 8, padding: '6px 10px' }}
                    >
                      {voted ? `You voted: ${myVoteFor(secretText)}` : 'Cast vote'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <hr style={{ margin: '16px 0' }} />
          <h3>Who submitted</h3>
          <ul>
            {players.map((pid) => (
              <li key={pid}>
                Player {pid}: {submittedPlayers.has(pid) ? 'Submitted ✅' : '—'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function AppInner({ matchID, playerID }) {
  const GameClient = React.useMemo(
    () =>
      BGClient({
        game: SecretWall,
        board: (props) => <Board {...props} />,
        // multiplayer: Local(), 
        multiplayer: SocketIO({ server: serverURL }),
        debug: false,
      }),
    []
  );

  return <GameClient matchID={matchID} playerID={playerID} />;
}

export default function App() {
  const matchID = 'room-1';
  return (
    <div style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div>
        <h1>Player 0</h1>
        <AppInner matchID={matchID} playerID="0" />
      </div>
      <div>
        <h1>Player 1</h1>
        <AppInner matchID={matchID} playerID="1" />
      </div>
    </div>
  );
}
