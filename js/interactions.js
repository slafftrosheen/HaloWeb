/* HaloWeb v2.2 interactions.
 * Scenarios animate only after explicit user selection; the notebook demo runs
 * once on first reveal. Status maturity is an enum (current/in-development/
 * planned/experimental). Traces are semantic, never fabricated telemetry.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reducedMotion() {
    return reduced.matches || document.documentElement.getAttribute('data-motion') === 'reduced';
  }
  function wait(ms) { return reducedMotion() ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Hero presence + runtime rail ---------- */
  var heroCanvas = document.getElementById('presence-canvas');
  var hero = window.HaloPresence && heroCanvas ? window.HaloPresence.mount(heroCanvas) : null;
  if (window.HaloPresence) window.HaloPresence._hero = hero;
  var traceEl = document.getElementById('runtime-trace');

  var TRACES = {
    ready: 'Ready',
    listening: 'invoke → capture · microphone active',
    thinking: 'context assembled · selected provider',
    responding: 'answer streaming · output → origin'
  };

  function setRailState(key) {
    if (hero) hero.setState(key);
    if (traceEl) {
      traceEl.innerHTML = '<span class="step step--active">' + (TRACES[key] || '') + '</span>';
    }
  }

  var railBtns = document.querySelectorAll('.state-rail .btn[data-state]');
  Array.prototype.forEach.call(railBtns, function (btn) {
    btn.addEventListener('click', function () {
      setRailState(btn.getAttribute('data-state'));
      Array.prototype.forEach.call(railBtns, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });

  /* Capability labels: one activation → one bounded pulse (coalesced). */
  var lastPulse = 0;
  function activateCapability(btn) {
    var now = performance.now();
    if (now - lastPulse < 250) return;
    lastPulse = now;
    var dir = parseFloat(btn.getAttribute('data-dir') || '0');
    btn.classList.add('cap-label--pulse');
    if (hero) hero.pulse(dir, Math.min(0.045, Math.abs(dir) * 0.045));
    setTimeout(function () { btn.classList.remove('cap-label--pulse'); }, 620);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.cap-label'), function (btn) {
    btn.addEventListener('mouseenter', function () { activateCapability(btn); });
    btn.addEventListener('focus', function () { activateCapability(btn); });
    btn.addEventListener('click', function () { activateCapability(btn); });
  });

  /* ---------- Scenario pipelines + semantic terminal ---------- */
  /* Stage maturity enum: current | in-development | planned | experimental */
  var SCENARIOS = {
    phone: {
      title: 'runtime route — ask on the phone',
      status: 'current',
      note: '<b>Ask on the phone.</b> Halo is a complete assistant on Android by itself — invoke it, ask, act. No wearable or extra service required.',
      steps: [
        { tag: 'INPUT',    text: 'phone microphone · invoked by you', status: 'current' },
        { tag: 'STT',      text: 'local speech recognition', status: 'current' },
        { tag: 'REASON',   text: 'selected provider · default: local llama.cpp', status: 'current' },
        { tag: 'ROUTE',    text: 'response → phone', status: 'current' },
        { tag: 'RESULT',   text: 'playback on phone', status: 'current' }
      ],
      term: [
        'INPUT     phone microphone',
        'STT       local speech recognition',
        'REASON    selected provider (default: local llama.cpp)',
        'ROUTE     response → interaction origin',
        'RESULT    playback acknowledged'
      ]
    },
    glasses: {
      title: 'runtime route — ask through glasses',
      status: 'in-development',
      note: '<b>Ask through glasses.</b> The glasses contribute microphone and speakers as capabilities; Halo keeps the conversation on the device where it began. HeyCyan is the reference implementation while this track completes hardware validation.',
      steps: [
        { tag: 'INPUT',    text: 'glasses microphone · capability: audio input', status: 'current' },
        { tag: 'STT',      text: 'local speech recognition', status: 'current' },
        { tag: 'REASON',   text: 'selected provider', status: 'current' },
        { tag: 'ROUTE',    text: 'response → interaction origin', status: 'current' },
        { tag: 'OUTPUT',   text: 'glasses speakers · origin route', status: 'in-development' },
        { tag: 'VALIDATION', text: 'physical acceptance pending', status: 'in-development' }
      ],
      term: [
        'INPUT     glasses microphone (capability: audio input)',
        'STT       local speech recognition',
        'REASON    selected provider',
        'ROUTE     response → interaction origin',
        'OUTPUT    glasses speakers          [IN DEVELOPMENT]',
        'VALIDATION  physical acceptance pending'
      ]
    },
    capture: {
      title: 'runtime route — capture from glasses',
      status: 'in-development',
      note: '<b>Capture from glasses.</b> A wearable photo becomes a Notebook object. Capture sources exist today; verified transfer, Inbox ingest and any memory promotion are later stages on this track.',
      steps: [
        { tag: 'CAPTURE',  text: 'glasses camera · photo capture', status: 'current' },
        { tag: 'TRANSFER', text: 'media → phone · verified transfer', status: 'in-development' },
        { tag: 'INGEST',   text: 'notebook object · Inbox', status: 'in-development' },
        { tag: 'MEMORY',   text: 'promotion with provenance', status: 'planned' }
      ],
      term: [
        'CAPTURE   glasses camera (capability: still capture)',
        'TRANSFER  media → phone             [IN DEVELOPMENT]',
        'INGEST    notebook object · Inbox   [IN DEVELOPMENT]',
        'MEMORY    promotion with provenance [PLANNED]'
      ]
    }
  };

  var STATUS_CLASS = {
    'current': 'status--current',
    'in-development': 'status--development',
    'planned': 'status--planned',
    'experimental': 'status--experimental'
  };
  var STATUS_LABEL = {
    'current': 'Current',
    'in-development': 'In development',
    'planned': 'Planned',
    'experimental': 'Experimental'
  };
  function chip(status) {
    return '<span class="status ' + (STATUS_CLASS[status] || 'status--planned') + '">' +
      (STATUS_LABEL[status] || status) + '</span>';
  }

  var pipelineEl = document.getElementById('pipeline');
  var noteEl = document.getElementById('scenario-note');
  var termEl = document.getElementById('term');
  var termTitle = document.getElementById('term-title');
  var scenarioBtns = document.querySelectorAll('.scenario-bar .btn[data-scenario]');
  var scenarioRun = 0;
  var currentScenario = 'phone';
  var scenarioAnimated = false;

  function scenarioHeader(scenario) {
    if (noteEl) noteEl.innerHTML = scenario.note;
    if (termTitle) termTitle.textContent = scenario.title;
  }

  function renderPipelineStatic(scenario) {
    if (!pipelineEl) return;
    pipelineEl.innerHTML = scenario.steps.map(function (s) {
      var stageChip = s.status !== 'current' ? chip(s.status) : '';
      return '<li class="done"><span class="tag">' + s.tag + '</span><span>' + s.text + '</span>' + stageChip + '</li>';
    }).join('');
  }

  function renderTerminalStatic(scenario) {
    if (!termEl) return;
    termEl.innerHTML = scenario.term.map(function (line) {
      return line.indexOf('[IN DEVELOPMENT]') > -1 || line.indexOf('[PLANNED]') > -1
        ? '<span class="term-planned">' + line + '</span>'
        : line;
    }).join('\n');
  }

  function applyScenarioStatic(scenario) {
    scenarioHeader(scenario);
    renderPipelineStatic(scenario);
    renderTerminalStatic(scenario);
  }

  /* Runs only on explicit user selection. */
  function runScenario(key) {
    var scenario = SCENARIOS[key];
    if (!scenario) return;
    currentScenario = key;
    var run = ++scenarioRun;
    scenarioHeader(scenario);
    renderTerminalStatic(scenario);
    if (reducedMotion() || !pipelineEl) return;
    var items = Array.prototype.slice.call(pipelineEl.children);
    pipelineEl.innerHTML = scenario.steps.map(function (s) {
      var stageChip = s.status !== 'current' ? chip(s.status) : '';
      return '<li><span class="tag">' + s.tag + '</span><span>' + s.text + '</span>' + stageChip + '</li>';
    }).join('');
    items = Array.prototype.slice.call(pipelineEl.children);
    if (termEl) termEl.textContent = '';

    (function next(i) {
      if (run !== scenarioRun) return;
      if (i >= items.length) {
        applyScenarioStatic(scenario);
        if (hero) hero.pulse(1, 0.03);
        return;
      }
      items[i].className = 'on';
      if (termEl) termEl.textContent = scenario.term.slice(0, i + 1).join('\n');
      if (hero) hero.pulse(i % 2 === 0 ? 1 : -1, 0.02);
      wait(620).then(function () {
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
      scenarioAnimated = true;
      runScenario(btn.getAttribute('data-scenario'));
    });
  });

  /* ---------- Notebook loop: current path animates once; planned stays static ---------- */
  var nbSteps = document.querySelectorAll('#nb-steps li');
  var nbArrive = document.getElementById('nb-arrive');
  var nbRun = 0;

  function runNotebook() {
    var run = ++nbRun;
    var steps = Array.prototype.slice.call(nbSteps).filter(function (li) {
      return li.getAttribute('data-current') === 'true';
    });
    steps.forEach(function (li) { li.classList.remove('on'); });
    if (nbArrive) nbArrive.classList.remove('on');
    (function next(i) {
      if (run !== nbRun) return;
      if (i >= steps.length) return;
      steps[i].classList.add('on');
      if (i === 0 && nbArrive) nbArrive.classList.add('on');
      wait(1100).then(function () { next(i + 1); });
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

    var input = gMic ? ['glasses microphone · capture'] : (earbuds ? ['earbuds microphone · capture'] : ['phone microphone · capture']);
    var output = (gSpk && gMic) ? ['glasses speakers · response'] : (earbuds ? ['earbuds speakers · response'] : ['phone speaker · response']);

    var reason;
    if (gMic && gSpk) reason = 'Response route: interaction origin';
    else if (gMic && !gSpk) reason = 'Fallback: glasses output unavailable → ' + (earbuds ? 'earbuds' : 'phone speaker');
    else reason = 'Fallback: glasses input unavailable → ' + (earbuds ? 'earbuds' : 'phone') + ' for capture and response';

    var nodes = [
      { tag: 'INPUT', text: input[0] },
      { tag: 'HALO', text: 'runtime · selected provider' },
      { tag: 'OUTPUT', text: output[0] }
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

  /* ---------- Host showcase segmented selector ---------- */
  var hostScreens = document.querySelectorAll('.host-screen[data-screen]');
  var hostBtns = document.querySelectorAll('.host-switch .btn[data-screen-target]');
  function showHostScreen(name) {
    Array.prototype.forEach.call(hostScreens, function (el) {
      el.hidden = el.getAttribute('data-screen') !== name;
    });
  }
  Array.prototype.forEach.call(hostBtns, function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(hostBtns, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      showHostScreen(btn.getAttribute('data-screen-target'));
    });
  });

  /* ---------- Reveal on scroll (notebook demo once; scenarios only on click) ---------- */
  var notebookShown = false;

  function revealEl(el) {
    el.classList.add('in');
    if (el.getAttribute('data-demo') === 'notebook' && !notebookShown) {
      notebookShown = true;
      runNotebook();
    }
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

  /* Geometry fallback for environments where IO callbacks don't fire. */
  var revealTick = 0;
  window.addEventListener('scroll', function () {
    if (revealTick) return;
    revealTick = requestAnimationFrame(function () { revealTick = 0; checkReveals(); });
  }, { passive: true });
  window.addEventListener('resize', checkReveals);
  setTimeout(checkReveals, 1200);

  /* ---------- Mini orb: static Ready in the mockup ---------- */
  var mini = document.getElementById('orb-mini');
  if (mini && window.HaloPresence) {
    window.HaloPresence.mount(mini).setState('ready');
  }

  /* ---------- Boot: static, settled ---------- */
  setRailState('ready');
  applyScenarioStatic(SCENARIOS[currentScenario]);
  routeContinuity();
})();
