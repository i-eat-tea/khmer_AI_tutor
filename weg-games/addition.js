// Mini-game: basic addition (grade 1-2).
(function () {
  window.WEGGames.register({
    id: 'addition',
    title: 'បូកលេខ',
    tagline: 'បន្ថែមលេខពីរជាមួយគ្នា!',
    emoji: '➕',
    color: '#3CA55C',
    rounds: 5,
    makeQuestion: function () {
      const G = window.WEGGames;
      const a = G.randInt(1, 9);
      const b = G.randInt(1, 9);
      const answer = a + b;
      return {
        prompt: a + ' + ' + b + ' = ?',
        answer: answer,
        options: G.makeOptions(answer, 1, 18)
      };
    }
  });
})();
