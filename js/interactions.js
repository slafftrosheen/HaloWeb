/* HaloWeb v2 interactions.
 * Scenario pipelines, notebook loop, continuity routing, capability pulses,
 * reveal-on-scroll and the in-mockup orb. All demo content is labeled as
 * illustrative; motion stays within the site's restrained language and
 * collapses to instant state changes under reduced motion.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reducedMotion() { return reduced.matches || document.documentElement.getAttribute('data-motion') === 'reduced'; }
  function wait(ms) { return reducedMotion() ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Hero presence + runtime rail ---------- */
  var heroCanvas = document.getElementById('presence-canvas');
  var presence = window.HaloPresence && heroCanvas ? window.HaloPresence.mount(heroCanvas) : null;
  var traceEl = document.getElementById('runtime-trace');

  var stateOrder = ['listening', 'understanding', 'reasoning', 'responding'];

  function setState(key) {
    if (!presence) return;
    presence.setState(key);
    if (traceEl) {
      var st = window.HaloPresence.states;
      // presence.js exposes state keys only; trace text lives here.
      var traces = {
        listening: 'wake → capture · VAD active',
        understanding: 'speech → text · locale · intent',
        reasoning: 'context assembled · provider: local',
        responding: 'answer streaming · output route: origin'
      };
      traceEl.innerHTML = '<span class="step step--active">' + (traces[key] || '') + '</span>';
    }
  }

  var railBtns = document.querySelectorAll('.state-rail .btn[data-state]');
  Array.prototype.forEach.call(railBtns, function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-state');
      setState(key);
      Array.prototype.forEach.call(railBtns, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });

  /* Capability labels lean the presence toward them on hover/focus. */
  if (presence) {
    Array.prototype.forEach.call(document.querySelectorAll('.cap-label'), function (label) {
      var dir = parseFloat(label.getAttribute('data-dir') || '0');
      var amp = Math.min(0.045, Math.abs(dir) * 0.045);
      function lean() {
        label.classList.add('cap-label--pulse');
        presence.pulse(dir, amp);
      }
      function leanOff() { label.classList.remove('cap-label--pulse'); }
      label.addEventListener('mouseenter', lean);
      label.addEventListener('mouseleave', leanOff);
      label.addEventListener('focus', lean);
      label.addEventListener('blur', leanOff);
    });
  }

  /* ---------- Scenario pipelines + terminal ---------- */
  var SCENARIOS = {
    glasses: {
      title: 'runtime trace — ask through glasses (illustrative)',
      note: '<b>Ask through glasses.</b> The wearable captures the question, the local model reasons on the phone, and the answer returns to the glasses. No cloud, no account.',
      steps: [
        { tag: 'INPUT',    text: 'HeyCyan · microphone' },
        { tag: 'STT',      text: 'speech → text · on device' },
        { tag: 'REASON',   text: 'llama.cpp · qwen3 · local' },
        { tag: 'ROUTE',    text: 'origin: glasses' },
        { tag: 'OUTPUT',   text: 'HeyCyan · speakers' },
        { tag: 'RESULT',   text: 'success · verified by playback' }
      ],
      term: [
        '09:41:21  INPUT     HeyCyan / microphone',
        '09:41:21  STT       whisper.cpp · partial "what changed in the spec"',
        '09:41:22  PROVIDER  llama.cpp / qwen3 · context: notebook',
        '09:41:23  ANSWER    streamed 41 tokens · tts ready',
        '09:41:23  OUTPUT    HeyCyan / audio · origin route',
        '09:41:23  RESULT    success'
      ]
    },
    camera: {
      title: 'runtime trace — capture to notebook (illustrative)',
      note: '<b>Capture to Notebook.</b> A photo from any camera becomes a workspace object, gets summarized, and can be promoted to memory with provenance.',
      steps: [
        { tag: 'INPUT',   text: 'camera · photo captured' },
        { tag: 'TRANSFER',text: 'media → phone · checksum verified' },
        { tag: 'VISION',  text: 'on-device vision model' },
        { tag: 'WORKSPACE', text: 'notebook object created · inbox' },
        { tag: 'SUMMARY', text: 'diff vs supplier spec · 3 findings' },
        { tag: 'RESULT',  text: 'saved · memory promotion explicit' }
      ],
      term: [
        '09:41:21  INPUT     HeyCyan / camera · IMG_0941.jpg',
        '09:41:22  TRANSFER  wifi · sha256 verified · 2.1 MB',
        '09:41:23  VISION    local vision model · 3 regions',
        '09:41:24  WORKSPACE note + media object · inbox',
        '09:41:24  SUMMARY   "diffuser gap 2mm wider than spec"',
        '09:41:24  RESULT    saved · provenance: HeyCyan capture'
      ]
    },
    robot: {
      title: 'runtime trace — drive the robot (illustrative)',
      note: '<b>Drive the robot.</b> Intents pass a safety layer before any motor moves: arming required, bounded pulses, stop on release, telemetry freshness enforced.',
      steps: [
        { tag: 'INTENT',  text: 'user command · drive forward 1m' },
        { tag: 'POLICY',  text: 'capability check · drive allowed' },
        { tag: 'SAFETY',  text: 'armed? telemetry fresh? bounds ok' },
        { tag: 'ACT',     text: 'bounded drive pulses · throttled' },
        { tag: 'VERIFY',  text: 'odometry + stop confirmation' },
        { tag: 'RESULT',  text: 'complete · receipt in Activity' }
      ],
      term: [
        '09:41:21  INTENT    drive · forward 1.0m',
        '09:41:21  POLICY    capability: drive · allowed',
        '09:41:22  SAFETY    motors armed · telemetry 120ms · ok',
        '09:41:22  ACT       pulses 1..4 · bounded · throttle 40%',
        '09:41:23  VERIFY    odometry 1.02m · stopped',
        '09:41:23  RESULT    complete · receipt #4021'
      ]
    }
  };

  var pipelineEl = document.getElementById('pipeline');
  var noteEl = document.getElementById('scenario-note');
  var termEl = document.getElementById('term');
  var termTitle = document.getElementById('term-title');
  var scenarioBtns = document.querySelectorAll('.scenario-bar .btn[data-scenario]');
  var scenarioRun = 0;

  function renderPipeline(scenario) {
    if (!pipelineEl) return;
    pipelineEl.innerHTML = scenario.steps.map(function (s) {
      return '<li><span class="tag">' + s.tag + '</span><span>' + s.text + '</span></li>';
    }).join('');
  }

  function runScenario(key) {
    var scenario = SCENARIOS[key];
    if (!scenario) return;
    var run = ++scenarioRun;
    renderPipeline(scenario);
    if (noteEl) noteEl.innerHTML = scenario.note;
    if (termTitle) termTitle.textContent = scenario.title;
    var items = pipelineEl ? Array.prototype.slice.call(pipelineEl.children) : [];
    items.forEach(function (li) { li.className = ''; });
    if (termEl) termEl.textContent = '';

    (function next(i) {
      if (run !== scenarioRun) return;
      if (i >= items.length) {
        items.forEach(function (li) { li.className = 'done'; });
        if (termEl) termEl.textContent = scenario.term.join('\n');
        if (presence) presence.pulse(1, 0.03);
        return;
      }
      items[i].className = 'on';
      if (termEl) termEl.textContent = scenario.term.slice(0, i + 1).join('\n');
      if (presence) presence.pulse(i % 2 === 0 ? 1 : -1, 0.02);
      wait(650).then(function () {
        if (run !== scenarioRun) return;
        items[i].className = 'done';
        next(i + 1);
      });
    })(0);
  }

  Array.prototype.forEach.call(scenarioBtns, function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(scenarioBtns, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      runScenario(btn.getAttribute('data-scenario'));
    });
  });

  /* ---------- Notebook loop (scroll-triggered) ---------- */
  var nbSteps = document.querySelectorAll('#nb-steps li');
  var nbArrive = document.getElementById('nb-arrive');
  var nbRun = 0;

  function runNotebook() {
    var run = ++nbRun;
    var steps = Array.prototype.slice.call(nbSteps);
    steps.forEach(function (li) { li.classList.remove('on'); });
    if (nbArrive) nbArrive.classList.remove('on');
    (function next(i) {
      if (run !== nbRun) return;
      if (i >= steps.length) return;
      steps[i].classList.add('on');
      if (i === 0 && nbArrive) nbArrive.classList.add('on');
      if (i === 2) {
        var halo = document.getElementById('nb-halo');
        if (halo) { halo.style.background = 'var(--wash-a)'; }
      }
      wait(1200).then(function () { next(i + 1); });
    })(0);
  }

  /* ---------- Continuity routing ---------- */
  var caps = { 'glasses-speaker': true, 'glasses-mic': true, 'earbuds': false };

  function routeContinuity() {
    var routeEl = document.getElementById('cont-route');
    var statusEl = document.getElementById('cont-status');
    if (!routeEl) return;
    var earbuds = caps['earbuds'];
    var gMic = caps['glasses-mic'];
    var gSpk = caps['glasses-speaker'];

    var input = gMic ? ['GLASSES', 'glasses microphone · capture'] : (earbuds ? ['EARBUDS', 'earbuds microphone · capture'] : ['PHONE', 'phone microphone · capture']);
    var output = gSpk && gMic ? ['GLASSES', 'glasses speakers · response'] : (earbuds ? ['EARBUDS', 'earbuds speakers · response'] : ['PHONE', 'phone speaker · response']);

    var reason = 'Response route: interaction origin';
    if (gMic && !gSpk) reason = 'Fallback: glasses output unavailable → ' + (earbuds ? 'earbuds' : 'phone speaker');
    if (!gMic) reason = 'Fallback: glasses input unavailable → ' + (earbuds ? 'earbuds' : 'phone') + ' for capture and response';

    var nodes = [
      { tag: 'INPUT', text: input[1], dim: false },
      { tag: 'HALO', text: 'runtime · local reasoning', dim: false },
      { tag: 'MODEL', text: 'llama.cpp · on device', dim: false },
      { tag: 'OUTPUT', text: output[1], dim: false }
    ];

    routeEl.innerHTML = nodes.map(function (n, i) {
      var link = i < nodes.length - 1 ? '<div class="cont-link on" aria-hidden="true"></div>' : '';
      return '<div class="cont-node"><span class="tag">' + n.tag + '</span>' + n.text + '</div>' + link;
    }).join('');

    if (statusEl) statusEl.innerHTML = 'Status: <b>' + reason + '</b>';
  }

  Array.prototype.forEach.call(document.querySelectorAll('.cont-toggle'), function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-caps');
      caps[key] = !caps[key];
      btn.setAttribute('aria-pressed', caps[key] ? 'true' : 'false');
      routeContinuity();
    });
  });

  /* ---------- Reveal on scroll ---------- */
  function revealEl(el) {
    el.classList.add('in');
    if (el.getAttribute && el.getAttribute('data-demo') === 'notebook') runNotebook();
  }

  function checkReveals() {
    var vh = window.innerHeight;
    Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.in)'), function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) revealEl(el);
    });
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
      revealObserver.observe(el);
    });
  }

  /* Geometry fallback: covers environments where IO callbacks don't fire
     (and ancient browsers). Idempotent — classList.add guards re-runs. */
  var revealTick = 0;
  window.addEventListener('scroll', function () {
    if (revealTick) return;
    revealTick = requestAnimationFrame(function () { revealTick = 0; checkReveals(); });
  }, { passive: true });
  window.addEventListener('resize', checkReveals);
  setTimeout(checkReveals, 1200);

  /* ---------- Mini orb in the phone mockup ---------- */
  var mini = document.getElementById('orb-mini');
  if (mini && window.HaloPresence) {
    var miniPresence = window.HaloPresence.mount(mini);
    miniPresence.setState('listening');
  }

  /* ---------- Boot ---------- */
  setState('listening');
  var initial = document.querySelector('.scenario-bar .btn[aria-pressed="true"]');
  runScenario(initial ? initial.getAttribute('data-scenario') : 'glasses');
  routeContinuity();
})();
