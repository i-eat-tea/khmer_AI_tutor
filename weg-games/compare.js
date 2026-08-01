// Mini-game: compare two numbers, pick the bigger one (grade 1-2).
(function () {
  window.WEGGames.register({
    id: 'compare',
    title: 'លេខធំតូច',
    tagline: 'មួយណាធំជាង? ចង្អុលលេខធំ!',
    emoji: '⚖️',
    color: '#5FB8FF',
    rounds: 5,
    makeQuestion: function () {
      const G = window.WEGGames;
      let a = G.randInt(1, 9);
      let b = G.randInt(1, 9);
      if (a === b) b = a === 9 ? 8 : a + 1;
      const answer = Math.max(a, b);
      const options = G.shuffle([
        { value: a, display: '<span class="big-num">' + a + '</span>' },
        { value: b, display: '<span class="big-num">' + b + '</span>' }
      ]);
      return {
        prompt: a + ' និង ' + b + ' — មួយណាធំជាង?',
        answer: answer,
        options: options
      };
    }
  });
})();
