/* HaloWeb interactions — explicit, bounded motion only. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function prefersReduced() { return reduced.matches; }

  var STATE_TRACES = {
    ready: 'runtime settled · waiting for explicit input',
    listening: 'input active · source is visible',
    thinking: 'context assembled · selected provider is reasoning',
    acting: 'authorized capability · execution truth tracked',
    speaking: 'response routed · interaction origin preferred'
  };

  var SCENARIOS = {
    phone: {
      title: 'Ask on the phone',
      copy: 'Explicit input enters the Android host, uses the selected provider, and returns to the same surface.',
      trace: [
        'INPUT    phone',
        'SPEECH   local recognition',
        'REASON   selected provider',
        'OUTPUT   phone'
      ],
      nodes: [
        { tag:'INPUT', text:'Phone microphone or composer', glyph:'phone', status:'current' },
        { tag:'UNDERSTAND', text:'Speech / text normalized by the host', glyph:'listen', status:'current' },
        { tag:'REASON', text:'Selected provider · default path is local', glyph:'model', status:'current' },
        { tag:'OUTPUT', text:'Response stays on the phone surface', glyph:'speak', status:'current' }
      ]
    },
    glasses: {
      title: 'Continue through glasses',
      copy: 'The wearable contributes input and output capabilities while the phone remains the host. Physical output acceptance is still in development.',
      trace: [
        'INPUT    glasses microphone',
        'REASON   selected provider',
        'ROUTE    interaction origin',
        'OUTPUT   glasses speaker [IN DEVELOPMENT]'
      ],
      nodes: [
        { tag:'INPUT', text:'Glasses microphone capability', glyph:'glasses', status:'current' },
        { tag:'REASON', text:'Phone-hosted Halo runtime', glyph:'halo', status:'current' },
        { tag:'ROUTE', text:'Prefer the originating surface', glyph:'action', status:'current' },
        { tag:'OUTPUT', text:'Glasses audio path · hardware acceptance', glyph:'speak', status:'development' }
      ]
    },
    capture: {
      title: 'Capture into the workspace',
      copy: 'A connected camera can become a Halo capability. Transfer and Notebook ingestion remain explicit maturity boundaries rather than a fake finished demo.',
      trace: [
        'INPUT    connected camera',
        'TRANSFER media → host [IN DEVELOPMENT]',
        'WORKSPACE Notebook ingest [IN DEVELOPMENT]',
        'MEMORY   explicit promotion [PLANNED]'
      ],
      nodes: [
        { tag:'CAPTURE', text:'Connected camera produces media', glyph:'glasses', status:'current' },
        { tag:'TRANSFER', text:'Media transfer into the Android host', glyph:'device', status:'development' },
        { tag:'WORKSPACE', text:'Notebook object / Inbox flow', glyph:'note', status:'development' },
        { tag:'MEMORY', text:'Promotion with provenance', glyph:'model', status:'planned' }
      ]
    }
  };

  var scenarioRun = 0;

  function statusLabel(status) {
    if (status === 'current') return 'Current';
    if (status === 'development') return 'In development';
    if (status === 'experimental') return 'Experimental';
    return 'Planned';
  }

  function renderScenario(key, animate) {
    var scenario = SCENARIOS[key] || SCENARIOS.phone;
    var title = document.getElementById('scenario-title');
    var copy = document.getElementById('scenario-copy');
    var flow = document.getElementById('route-flow');
    var trace = document.getElementById('semantic-trace');
    if (!flow) return;

    if (title) title.textContent = scenario.title;
    if (copy) copy.textContent = scenario.copy;
    if (trace) trace.textContent = scenario.trace.join('\n');

    flow.innerHTML = scenario.nodes.map(function (node) {
      return '<div class="route-node">' +
        '<span class="tag mono">' + node.tag + '</span>' +
        '<span><i class="halo-glyph" data-glyph="' + node.glyph + '"></i> ' + node.text + '</span>' +
        '<small class="node-status status status--' + node.status + '">' + statusLabel(node.status) + '</small>' +
      '</div>';
    }).join('');

    if (window.HaloVisual) window.HaloVisual.renderGlyphs(flow);

    var nodes = Array.prototype.slice.call(flow.querySelectorAll('.route-node'));
    if (!animate || prefersReduced()) {
      nodes.forEach(function (node) { node.classList.add('is-done'); });
      return;
    }

    var run = ++scenarioRun;
    nodes.forEach(function (node) { node.classList.remove('is-active','is-done'); });
    function step(i) {
      if (run !== scenarioRun || i >= nodes.length) return;
      nodes[i].classList.add('is-active');
      window.setTimeout(function () {
        if (run !== scenarioRun) return;
        nodes[i].classList.remove('is-active');
        nodes[i].classList.add('is-done');
        step(i + 1);
      }, 430);
    }
    step(0);
  }

  function initHeroSignal() {
    var heroFace = window.HaloVisual && window.HaloVisual.faceById('hero-signal');
    var trace = document.getElementById('signal-trace');
    var buttons = document.querySelectorAll('.state-rail [data-state]');

    var capabilityChips = document.querySelectorAll('.capability-chip[data-signal]');
    function setState(state, sourceChip) {
      if (heroFace) heroFace.setState(state);
      if (trace) trace.textContent = STATE_TRACES[state] || '';
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-state') === state ? 'true' : 'false');
      });
      Array.prototype.forEach.call(capabilityChips, function (chip) {
        chip.setAttribute('aria-pressed', chip === sourceChip ? 'true' : 'false');
      });
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () { setState(btn.getAttribute('data-state'), null); });
    });

    Array.prototype.forEach.call(capabilityChips, function (chip) {
      chip.addEventListener('click', function () {
        var state = chip.getAttribute('data-signal') || 'ready';
        setState(state, chip);
        if (trace) {
          var name = chip.querySelector('b');
          trace.textContent = (name ? name.textContent.toLowerCase() : 'capability') + ' joined · ' + (STATE_TRACES[state] || '');
        }
      });
    });
  }

  function initScreenSwitcher() {
    var controls = document.querySelectorAll('[data-screen-target]');
    var screens = document.querySelectorAll('.app-screen[data-screen]');
    var order = ['home','notebook','devices'];
    var current = 'home';

    function show(name) {
      var direction = order.indexOf(name) >= order.indexOf(current) ? 1 : -1;
      Array.prototype.forEach.call(screens, function (screen) {
        var active = screen.getAttribute('data-screen') === name;
        screen.hidden = !active;
        if (active && !prefersReduced()) {
          screen.style.setProperty('--screen-shift', (direction * 14) + 'px');
          screen.classList.remove('screen-in');
          void screen.offsetWidth;
          screen.classList.add('screen-in');
        }
      });
      Array.prototype.forEach.call(controls, function (control) {
        var active = control.getAttribute('data-screen-target') === name;
        control.setAttribute('aria-pressed', active ? 'true' : 'false');
        control.setAttribute('aria-controls', 'mock-' + control.getAttribute('data-screen-target'));
      });
      current = name;
    }

    Array.prototype.forEach.call(controls, function (control) {
      control.addEventListener('click', function () { show(control.getAttribute('data-screen-target')); });
    });
  }

  function initScenarios() {
    var controls = document.querySelectorAll('[data-scenario]');
    Array.prototype.forEach.call(controls, function (control) {
      control.addEventListener('click', function () {
        Array.prototype.forEach.call(controls, function (other) {
          other.setAttribute('aria-pressed', other === control ? 'true' : 'false');
        });
        renderScenario(control.getAttribute('data-scenario'), true);
      });
    });
    renderScenario('phone', false);
  }

  function initWorkingSet() {
    var items = document.querySelectorAll('.context-item');
    var count = document.querySelector('.working-set-head em');
    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('click', function () {
        item.classList.toggle('selected');
        item.setAttribute('aria-pressed', item.classList.contains('selected') ? 'true' : 'false');
        var small = item.querySelector('small');
        if (small) small.textContent = item.classList.contains('selected') ? 'selected' : 'available';
        if (count) count.textContent = document.querySelectorAll('.context-item.selected').length;
      });
    });
  }

  function initContinuity() {
    var caps = { 'glasses-mic': true, 'glasses-speaker': true, 'earbuds': false };
    var controls = document.querySelectorAll('[data-cap]');
    var route = document.getElementById('continuity-route');
    var status = document.getElementById('continuity-status');

    function node(glyph, text) {
      return '<span class="cont-route-node"><i class="halo-glyph" data-glyph="' + glyph + '"></i>' + text + '</span>';
    }
    function arrow() { return '<span class="cont-route-arrow" aria-hidden="true">→</span>'; }

    function render() {
      if (!route) return;
      var inputGlyph = caps['glasses-mic'] ? 'glasses' : (caps.earbuds ? 'listen' : 'phone');
      var inputText = caps['glasses-mic'] ? 'Glasses input' : (caps.earbuds ? 'Earbuds input' : 'Phone input');
      var outputGlyph = (caps['glasses-mic'] && caps['glasses-speaker']) ? 'glasses' : (caps.earbuds ? 'speak' : 'phone');
      var outputText = (caps['glasses-mic'] && caps['glasses-speaker']) ? 'Glasses output' : (caps.earbuds ? 'Earbuds output' : 'Phone output');

      route.innerHTML = node(inputGlyph,inputText) + arrow() + node('halo','Halo runtime') + arrow() + node(outputGlyph,outputText);
      if (window.HaloVisual) window.HaloVisual.renderGlyphs(route);

      if (status) {
        if (caps['glasses-mic'] && caps['glasses-speaker']) {
          status.textContent = 'Origin route available · response remains on glasses.';
        } else if (caps['glasses-mic']) {
          status.textContent = 'Origin output unavailable · explicit fallback → ' + (caps.earbuds ? 'earbuds.' : 'phone.');
        } else {
          status.textContent = 'Glasses input unavailable · capture moves to ' + (caps.earbuds ? 'earbuds.' : 'phone.');
        }
      }
    }

    Array.prototype.forEach.call(controls, function (control) {
      control.addEventListener('click', function () {
        var key = control.getAttribute('data-cap');
        caps[key] = !caps[key];
        control.setAttribute('aria-pressed', caps[key] ? 'true' : 'false');
        render();
      });
    });
    render();
  }

  function initRuntimeBoard() {
    var core = document.querySelector('.signal-face--runtime');
    var endpoints = document.querySelectorAll('.runtime-endpoint');
    Array.prototype.forEach.call(endpoints, function (endpoint) {
      endpoint.addEventListener('mouseenter', function () {
        if (core && core.__haloSignalFace) core.__haloSignalFace.burst();
      });
      endpoint.addEventListener('focusin', function () {
        if (core && core.__haloSignalFace) core.__haloSignalFace.burst();
      });
    });
  }


  function initProductTilt() {
    var frame = document.querySelector('[data-tilt]');
    if (!frame || prefersReduced() || !window.matchMedia('(pointer:fine)').matches) return;
    var raf = 0;

    function reset() {
      if (raf) cancelAnimationFrame(raf);
      frame.classList.remove('is-tilting');
      frame.style.transform = '';
    }

    frame.addEventListener('pointermove', function (event) {
      var rect = frame.getBoundingClientRect();
      var px = (event.clientX - rect.left) / rect.width - 0.5;
      var py = (event.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        frame.classList.add('is-tilting');
        frame.style.transform =
          'rotateX(' + (-py * 3.2).toFixed(2) + 'deg) rotateY(' +
          (px * 4.2).toFixed(2) + 'deg) translateY(-2px)';
      });
    });

    frame.addEventListener('pointerleave', reset);
    frame.addEventListener('blur', reset, true);
  }

  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (item) { item.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
    Array.prototype.forEach.call(items, function (item) { observer.observe(item); });
  }

  initHeroSignal();
  initScreenSwitcher();
  initScenarios();
  initWorkingSet();
  initContinuity();
  initRuntimeBoard();
  initProductTilt();
  initReveals();
})();
