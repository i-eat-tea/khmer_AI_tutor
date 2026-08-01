// Mini-game: basic subtraction (grade 1-2).
(function () {
  window.WEGGames.register({
    id: 'subtraction',
    title: 'ដកលេខ',
    tagline: 'ដកលេខឲ្យបានត្រឹមត្រូវ!',
    emoji: '➖',
    color: '#4ECDC4',
    rounds: 5,
    makeQuestion: function () {
      const G = window.WEGGames;
      const a = G.randInt(3, 10);
      const b = G.randInt(1, a - 1);
      const answer = a - b;
      return {
        prompt: a + ' − ' + b + ' = ?',
        answer: answer,
        options: G.makeOptions(answer, 0, 10)
      };
    }
  });
})();
