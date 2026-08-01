// Shared helpers + registry for WEG mini-games.
// Each game lives in its own file (weg-games/<id>.js) and registers itself
// via WEGGames.register(). Add a new game by dropping in a new file, adding
// a <script> tag for it in weg-tutor-kid.html, and it shows up automatically.
(function () {
  const G = {};
  window.WEGGames = G;

  G.list = [];
  G.register = function (def) {
    G[def.id] = def;
    G.list.push(def);
  };

  G.randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  G.pick = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  G.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  };

  // Builds 3 shuffled multiple-choice options {value, display} around the
  // correct answer, within [min, max].
  G.makeOptions = function (answer, min, max) {
    const opts = [{ value: answer, display: String(answer) }];
    const seen = new Set([answer]);
    let tries = 0;
    while (opts.length < 3 && tries < 60) {
      tries++;
      const delta = G.randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1);
      const v = answer + delta;
      if (v >= min && v <= max && !seen.has(v)) {
        seen.add(v);
        opts.push({ value: v, display: String(v) });
      }
    }
    while (opts.length < 3) {
      const v = G.randInt(min, max);
      if (!seen.has(v)) {
        seen.add(v);
        opts.push({ value: v, display: String(v) });
      }
    }
    return G.shuffle(opts);
  };
})();
