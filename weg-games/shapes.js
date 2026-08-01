// Mini-game: shape recognition (grade 1).
(function () {
  const SHAPES = [
    { id: 'circle', emoji: '⭕', name: 'រង្វង់' },
    { id: 'square', emoji: '🟦', name: 'ការ៉េ' },
    { id: 'triangle', emoji: '🔺', name: 'ត្រីកោណ' },
    { id: 'star', emoji: '⭐', name: 'ផ្កាយ' },
    { id: 'heart', emoji: '❤️', name: 'បេះដូង' },
    { id: 'diamond', emoji: '💠', name: 'ពេជ្រ' }
  ];

  window.WEGGames.register({
    id: 'shapes',
    title: 'រាងធរណីមាត្រ',
    tagline: 'ចង្អុលរូបរាងដែលគេសួរ!',
    emoji: '🔺',
    color: '#5FA55F',
    rounds: 5,
    makeQuestion: function () {
      const G = window.WEGGames;
      const target = G.pick(SHAPES);
      const others = G.shuffle(SHAPES.filter(function (s) { return s.id !== target.id; })).slice(0, 2);
      const options = G.shuffle([target].concat(others)).map(function (s) {
        return { value: s.id, display: '<span class="shape-emoji">' + s.emoji + '</span>' };
      });
      return {
        prompt: 'ចង្អុល ' + target.name + '!',
        answer: target.id,
        options: options
      };
    }
  });
})();
