/* HaloWeb v2.1 interactions.
 * Demos are deferred until their sections are visible; traces are semantic,
 * not fabricated telemetry; scenario controls are a plain aria-pressed button
 * group (no fake tabs). Motion stays bounded and reduced-motion aware.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reducedMotion() {
    return reduced.matches || document.documentElement.getAttribute('data-motion') === 'reduced';
  }
  function wait(ms) { return reducedMotion() ? Promise.resolve() : new Promise(function (r) { setTimeout(r, ms); }); }

  function presence() {
    return window.HaloPresence && window.HaloPresence._hero ? window.HaloPresence._hero : null;
  }

  /* ---------- Hero presence + runtime rail ---------- */
  var heroCanvas = document.getElementById('presence-canvas');
  var hero = window.HaloPresence && heroCanvas ? window.HaloPresence.mount(heroCanvas) : null;
  if (window.HaloPresence) window.HaloPresence._hero = hero;
  var traceEl = document.getElementById('runtime-trace');

  var TRACES = {
    ready: 'Ready',
    listening: 'invoke → capture · microphone active',
    understanding: 'speech → text · intent recognized',
    reasoning: 'context assembled · provider: selected',
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
      var key = btn.getAttribute('data-state');
      setRailState(key);
      Array.prototype.forEach.call(railBtns, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });

  /* Capability labels: real buttons; hover/focus produces one bounded pulse. */
  if (hero) {
    Array.prototype.forEach.call(document.querySelectorAll('.cap-label'), function (btn) {
      var dir = parseFloat(btn.getAttribute('data-dir') || '0');
      var amp = Math.min(0.045, Math.abs(dir) * 0.045);
      function lean() {
        btn.classList.add('cap-label--pulse');
        hero.pulse(dir, amp);
      }
      function leanOff() { btn.classList.remove('cap-label--pulse'); }
      btn.addEventListener('mouseenter', lean);
      btn.addEventListener('mouseleave', leanOff);
      btn.addEventListener('focus', lean);
      btn.addEventListener('blur', leanOff);
      btn.addEventListener('click', lean);
    });
  }

  /* ---------- Scenario pipelines + semantic terminal ---------- */
  var SCENARIOS = {
    phone: {
      title: 'runtime route — ask on the phone',
      status: 'CURRENT',
      note: '<b>Ask on the phone.</b> Halo is a complete assistant on Android by itself — invoke, ask, act. No wearable or extra service required.',
      steps: [
        { tag: 'INPUT',    text: 'phone microphone · invoked by you' },
        { tag: 'STT',      text: 'local speech recognition' },
        { tag: 'REASON',   text: 'selected provider · default: local llama.cpp' },
        { tag: 'ROUTE',    text: 'response → phone' },
        { tag: 'RESULT',   text: 'playback on phone' }
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
      status: 'IN DEVELOPMENT',
      note: '<b>Ask through glasses.</b> The glasses contribute microphone and speakers as capabilities; Halo keeps the conversation on the device where it began. HeyCyan is the reference implementation while this track is validated on hardware.',
      steps: [
        { tag: 'INPUT',    text: 'glasses microphone · capability: audio input' },
        { tag: 'STT',      text: 'local speech recognition' },
        { tag: 'REASON',   text: 'selected provider' },
        { tag: 'ROUTE',    text: 'response → interaction origin' },
        { tag: 'OUTPUT',   text: 'glasses speakers · capability: audio output', planned: true },
        { tag: 'STATUS',   text: 'hardware validation in progress', planned: true }
      ],
      term: [
        'INPUT     glasses microphone (capability: audio input)',
        'STT       local speech recognition',
        'REASON    selected provider',
        'ROUTE     response → interaction origin',
        'OUTPUT    glasses speakers          [IN DEVELOPMENT]',
        'STATUS    hardware validation in progress'
      ]
    },
    capture: {
      title: 'runtime route — capture from glasses',
      status: 'IN DEVELOPMENT',
      note: '<b>Capture from glasses.</b> A wearable photo becomes a Notebook object. The receive-into-Inbox step is in development; summarization and memory promotion are planned slices, not current behavior.',
      steps: [
        { tag: 'INPUT',    text: 'glasses camera · photo capture' },
        { tag: 'TRANSFER', text: 'media → phone · verified transfer', planned: true },
        { tag: 'WORKSPACE',text: 'notebook object · Inbox', planned: true },
        { tag: 'STATUS',   text: 'media path acceptance in progress', planned: true }
      ],
      term: [
        'INPUT     glasses camera (capability: still capture)',
        'TRANSFER  media → phone             [IN DEVELOPMENT]',
        'WORKSPACE notebook object · Inbox    [PLANNED]',
        'STATUS    media path acceptance in progress'
      ]
    }
  };

  var pipelineEl = document.getElementById('pipeline');
  var noteEl = document.getElementById('scenario-note');
  var statusChip = document.getElementById('scenario-status');
  var termEl = document.getElementById('term');
  var termTitle = document.getElementById('term-title');
  var scenarioBtns = document.querySelectorAll('.scenario-bar .btn[data-scenario]');
  var scenarioRun = 0;
  var currentScenario = 'phone';

  function renderPipeline(scenario) {
    if (!pipelineEl) return;
    pipelineEl.innerHTML = scenario.steps.map(function (s) {
      var suffix = s.planned ? '<span class="step-chip">PLANNED</span>' : '';
      return '<li><span class="tag">' + s.tag + '</span><span>' + s.text + '</span>' + suffix + '</li>';
    }).join('');
  }

  function applyScenarioStatic(scenario) {
    renderPipeline(scenario);
    if (noteEl) noteEl.innerHTML = scenario.note;
    if (statusChip) {
      statusChip.textContent = scenario.status;
      statusChip.className = 'pill ' + (scenario.status === 'CURRENT' ? 'pill--shipped' : 'pill--planned');
    }
    if (termTitle) termTitle.textContent = scenario.title;
    if (termEl) {
      termEl.textContent = scenario.term.join('\n');
      // Mark planned/in-development lines so the terminal is truth-telling at rest.
      termEl.innerHTML = scenario.term.map(function (line) {
        return line.indexOf('[IN DEVELOPMENT]') > -1 || line.indexOf('[PLANNED]') > -1
          ? '<span class="term-planned">' + line + '</span>'
          : line;
      }).join('\n');
    }
  }

  function runScenario(key) {
    var scenario = SCENARIOS[key];
    if (!scenario) return;
    currentScenario = key;
    var run = ++scenarioRun;
    applyScenarioStatic(scenario);
    if (reducedMotion()) return;
    var items = pipelineEl ? Array.prototype.slice.call(pipelineEl.children) : [];
    items.forEach(function (li) { li.className = ''; });
    if (termEl) termEl.textContent = '';

    (function next(i) {
      if (run !== scenarioRun) return;
      if (i >= items.length) {
        items.forEach(function (li) { li.className = 'done'; });
        applyScenarioStatic(scenario);
        if (hero) hero.pulse(1, 0.03);
        return;
      }
      items[i].className = 'on';
      if (termEl) {
        var done = scenario.term.slice(0, i + 1).join('\n');
        termEl.textContent = done;
      }
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

  /* ---------- Host showcase segmented selector (mobile/tablet) ---------- */
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

  /* ---------- Reveal on scroll (demos deferred until visible) ---------- */
  var scenarioShown = false;
  var notebookShown = false;

  function revealEl(el) {
    el.classList.add('in');
    if (el.hasAttribute('data-demo')) {
      var demo = el.getAttribute('data-demo');
      if (demo === 'scenario' && !scenarioShown) {
        scenarioShown = true;
        runScenario(currentScenario); // one short demonstration on first reveal
      } else if (demo === 'notebook' && !notebookShown) {
        notebookShown = true;
        runNotebook();
      }
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

  /* Geometry fallback: covers environments where IO callbacks don't fire. */
  var revealTick = 0;
  window.addEventListener('scroll', function () {
    if (revealTick) return;
    revealTick = requestAnimationFrame(function () { revealTick = 0; checkReveals(); });
  }, { passive: true });
  window.addEventListener('resize', checkReveals);
  setTimeout(checkReveals, 1200);

  /* ---------- Mini orb: static Ready state in the mockup ---------- */
  var mini = document.getElementById('orb-mini');
  if (mini && window.HaloPresence) {
    var miniPresence = window.HaloPresence.mount(mini);
    miniPresence.setState('ready'); // renders once; no loops in the mockup
  }

  /* ---------- Boot: everything settles statically; demos wait for visibility ---------- */
  setRailState('ready');
  applyScenarioStatic(SCENARIOS[currentScenario]);
  routeContinuity();
})();
