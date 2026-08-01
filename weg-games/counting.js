// Mini-game: counting apples (grade 1).
(function () {
  window.WEGGames.register({
    id: 'counting',
    title: 'រាប់ផ្លែប៉ោម',
    tagline: 'រាប់ផ្លែប៉ោម រួចជ្រើសលេខ!',
    emoji: '🍎',
    color: '#D9A53C',
    rounds: 5,
    makeQuestion: function () {
      const G = window.WEGGames;
      const n = G.randInt(3, 10);
      return {
        prompt: 'រាប់ផ្លែប៉ោម!',
        displayEmoji: '🍎'.repeat(n),
        answer: n,
        options: G.makeOptions(n, 1, 12)
      };
    }
  });
})();
