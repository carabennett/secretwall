// shared/game.js
export const SecretWall = {
  name: 'secretwall',
  setup: () => ({
    submissions: {},
    votes: {}
  }),

  // Let all players act at once so each can submit independently
  turn: { 
    activePlayers: { all: SubmitSecret } ,
    // order: TurnOrder.ONCE,

    stages: {
      secretSubmission: {
        moves: { SubmitSecret, minMoves: 1, maxMoves: 1  }
      },
      voteSubmission: {
        moves: { SubmitVote, minMoves: 1, maxMoves: 1  }
      },
    }
   },

  moves: {
    SubmitSecret
  },

  phases: {
    // votingPhase: {
    //   moves: {SubmitSecret},
    // }, 

    submissionPhase: {
      moves: { SubmitSecret },
      start: true,
      // endIf: ({G}) => (G.submissions.length == 2),
      // next: votingPhase,
      // onBegin: ({ G, ctx }) => { ... },
      // onEnd: ({ G, ctx }) => { ... },
    },
  },
};


function SubmitSecret({ G, playerID }, text) {
  if (!playerID) return;
  if (G.submissions[playerID]) return;
  G.submissions[playerID] = String(text).slice(0, 280);
}

function SubmitVote({ G, playerID }, text, voteTarget) {
  if (!playerID) return;
  if (G.votes[text]) {
    G.votes[text][playerID] = voteTarget;
  } else {
    G.votes[text] = {playerID: voteTarget};
  }
}