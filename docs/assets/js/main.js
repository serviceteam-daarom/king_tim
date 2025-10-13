const ready = (callback) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

ready(() => {
  // Activate lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Update footer year(s)
  const years = document.querySelectorAll('#year');
  const currentYear = new Date().getFullYear();
  years.forEach((el) => {
    el.textContent = currentYear;
  });

  // Motion intro animations
  if (window.motion && window.motion.animate) {
    window.motion.animate('header nav a, header nav button', { opacity: [0, 1], y: [-12, 0] }, { duration: 0.6, delay: window.motion.stagger(0.05) });
    window.motion.animate('header h1, header p, header .font-display', { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.2 });
    window.motion.animate('[data-snowball-arena], [data-buzzer], [data-spin-button]', { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.6, delay: window.motion.stagger(0.1) });
  }

  // Mobile panel logic
  const mobileButton = document.querySelector('[data-mobile-menu]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  const closePanel = document.querySelector('[data-close-panel]');
  const panelLinks = document.querySelectorAll('[data-panel-link]');

  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', () => {
      mobilePanel.classList.remove('hidden');
      if (window.motion?.animate) {
        window.motion.animate('[data-mobile-panel] > div', { opacity: [0, 1], y: [20, 0] }, { duration: 0.35 });
      }
      document.body.classList.add('overflow-hidden');
    });
  }

  const hidePanel = () => {
    mobilePanel?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  closePanel?.addEventListener('click', hidePanel);
  panelLinks.forEach((link) => link.addEventListener('click', hidePanel));

  // Spin the Tim wheel
  const spinButton = document.querySelector('[data-spin-button]');
  const spinResult = document.querySelector('[data-spin-result]');
  const spinWheel = document.querySelector('[data-spin-wheel]');
  const spinVibes = [
    'de maestro van de marketing-polonaise! 🪩',
    'een skiende SEO-snowcat. ⛷️',
    'shotjes-sommelier eerste klas. 🥃',
    'de glittergoeroe van de Alpen. ✨',
    'de DJ die KPI\'s mixt met refreinen. 🎧',
    'een wandelende campagnemachine in skipak. 🚀',
  ];

  let currentWheelRotation = 0;

  if (spinButton && spinResult && spinWheel) {
    spinButton.addEventListener('click', () => {
      if (spinButton.disabled) return;
      spinButton.disabled = true;
      const randomVibe = spinVibes[Math.floor(Math.random() * spinVibes.length)];
      const startRotation = currentWheelRotation;
      const extraSpins = 3 + Math.floor(Math.random() * 3); // 3-5 extra spins
      const randomOffset = Math.random() * 360;
      const targetRotation = startRotation + extraSpins * 360 + randomOffset;
      const spinDuration = 3.5;

      spinResult.textContent = '';
      spinResult.style.opacity = '0';

      spinWheel.style.transition = '';
      spinWheel.style.transform = `rotate(${startRotation}deg)`;

      const revealResult = () => {
        currentWheelRotation = targetRotation % 360;
        spinWheel.style.transform = `rotate(${currentWheelRotation}deg)`;
        spinResult.textContent = `Vandaag ben jij ${randomVibe}`;

        const finishReveal = () => {
          spinResult.style.opacity = '1';
          spinButton.disabled = false;
        };

        if (window.motion?.animate) {
          const textAnimation = window.motion.animate(
            spinResult,
            { opacity: [0, 1], y: [-10, 0] },
            { duration: 0.6, easing: 'ease-out' }
          );
          const textFinished = textAnimation?.finished ?? Promise.resolve();
          textFinished
            .catch(() => {})
            .finally(finishReveal);
        } else {
          finishReveal();
        }
      };

      if (window.motion?.animate) {
        window.motion.animate('[data-spin-button]', { rotate: [0, 360] }, { duration: 0.8, easing: 'ease-out' });
        const wheelAnimation = window.motion.animate(
          spinWheel,
          { rotate: [startRotation, targetRotation] },
          {
            duration: spinDuration,
            easing: 'cubic-bezier(0.12, 0.01, 0.08, 0.99)',
            fill: 'forwards',
          }
        );
        const wheelFinished = wheelAnimation?.finished ?? Promise.resolve();
        wheelFinished
          .catch(() => {})
          .finally(revealResult);
      } else {
        spinWheel.style.transition = `transform ${spinDuration}s cubic-bezier(0.12, 0.01, 0.08, 0.99)`;
        // Force layout to apply any previous transition before setting new transform
        void spinWheel.offsetWidth;
        spinWheel.style.transform = `rotate(${targetRotation}deg)`;
        setTimeout(() => {
          spinWheel.style.transition = '';
          revealResult();
        }, spinDuration * 1000);
      }
    });
  }

  // Après-Ski counters
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = Number(el.dataset.target || 0);
            const increment = Math.max(1, Math.round(target / 60));
            let current = 0;
            const update = () => {
              current += increment;
              if (current >= target) {
                current = target;
                el.textContent = target;
              } else {
                el.textContent = current;
                requestAnimationFrame(update);
              }
            };
            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  // Après-Ski buzzer
  const buzzerButton = document.querySelector('[data-buzzer]');
  const buzzerStatus = document.querySelector('[data-buzzer-status]');
  if (buzzerButton && buzzerStatus) {
    buzzerButton.addEventListener('click', () => {
      const phrases = [
        'TIM IS GESIGHTSEEËD! Zet de confetti aan! 🎉',
        'We hebben een volle polonaise! 🚨',
        'Glühwein-reserves aangevuld. 🍷',
        'Nieuwe lead gescoord, nu dansen! 💃',
      ];
      buzzerStatus.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      if (window.motion?.animate) {
        window.motion.animate('[data-buzzer]', { scale: [1, 1.1, 1] }, { duration: 0.4 });
        window.motion.animate('[data-buzzer-status]', { opacity: [0, 1], y: [-6, 0] }, { duration: 0.4 });
      }
    });
  }

  // Playlist generator
  const addTrackButton = document.querySelector('[data-add-track]');
  const playlist = document.querySelector('[data-playlist]');
  if (addTrackButton && playlist) {
    const tracks = [
      { title: 'SEO Snowstorm', duration: '2:58' },
      { title: 'Lead Magnet Lullaby', duration: '3:45' },
      { title: 'Polonaise Pixel Party', duration: '4:02' },
      { title: 'Retargeting Rave', duration: '3:11' },
      { title: 'Conversion Confetti', duration: '2:39' },
    ];
    addTrackButton.addEventListener('click', () => {
      const track = tracks[Math.floor(Math.random() * tracks.length)];
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-3 rounded-2xl bg-slate-950/70 px-4 py-3';
      li.innerHTML = `<span class="flex items-center gap-2"><i data-lucide="music" class="h-4 w-4"></i>${track.title}</span><span class="text-white/60">${track.duration}</span>`;
      playlist.appendChild(li);
      if (window.lucide) {
        window.lucide.createIcons();
      }
      if (window.motion?.animate) {
        window.motion.animate(li, { opacity: [0, 1], y: [12, 0] }, { duration: 0.4 });
      }
    });
  }

  // Snowball showdown game
  const snowballArena = document.querySelector('[data-snowball-arena]');
  const snowballTarget = document.querySelector('[data-snowball-target]');
  const snowballScoreEl = document.querySelector('[data-snowball-score]');
  const snowballStart = document.querySelector('[data-start-snowball]');
  const snowballReset = document.querySelector('[data-reset-snowball]');

  let snowballScore = 0;
  let snowballInterval = null;

  const hideTarget = () => {
    if (snowballTarget) {
      snowballTarget.classList.add('hidden');
    }
  };

  const spawnTarget = () => {
    if (!snowballArena || !snowballTarget) return;
    const bounds = snowballArena.getBoundingClientRect();
    const x = Math.random() * 60 + 20; // percentage
    const y = Math.random() * 40 + 20;
    snowballTarget.style.left = `${x}%`;
    snowballTarget.style.top = `${y}%`;
    snowballTarget.classList.remove('hidden');
    if (window.motion?.animate) {
      window.motion.animate(snowballTarget, { scale: [0.7, 1] }, { duration: 0.25, easing: 'ease-out' });
    }
    setTimeout(hideTarget, 900);
  };

  snowballTarget?.addEventListener('click', () => {
    snowballScore += 1;
    if (snowballScoreEl) snowballScoreEl.textContent = snowballScore;
    hideTarget();
    if (window.motion?.animate) {
      window.motion.animate('[data-snowball-score]', { scale: [1, 1.2, 1] }, { duration: 0.3 });
    }
  });

  snowballStart?.addEventListener('click', () => {
    snowballScore = 0;
    if (snowballScoreEl) snowballScoreEl.textContent = snowballScore;
    if (snowballInterval) clearInterval(snowballInterval);
    spawnTarget();
    snowballInterval = setInterval(spawnTarget, 1200);
  });

  snowballReset?.addEventListener('click', () => {
    snowballScore = 0;
    if (snowballScoreEl) snowballScoreEl.textContent = snowballScore;
    if (snowballInterval) clearInterval(snowballInterval);
    hideTarget();
  });

  // Rhythm mini-game
  const rhythmPointer = document.querySelector('[data-rhythm-pointer]');
  const rhythmButton = document.querySelector('[data-rhythm-button]');
  const rhythmScoreEl = document.querySelector('[data-rhythm-score]');

  let rhythmProgress = 0;
  let rhythmDirection = 1;
  let rhythmScore = 0;

  const movePointer = () => {
    if (!rhythmPointer) return;
    rhythmProgress += rhythmDirection * 0.8;
    if (rhythmProgress <= 0) {
      rhythmProgress = 0;
      rhythmDirection = 1;
    } else if (rhythmProgress >= 100) {
      rhythmProgress = 100;
      rhythmDirection = -1;
    }
    rhythmPointer.style.left = `${rhythmProgress}%`;
    requestAnimationFrame(movePointer);
  };

  if (rhythmPointer) {
    requestAnimationFrame(movePointer);
  }

  rhythmButton?.addEventListener('click', () => {
    const perfectZoneStart = 42;
    const perfectZoneEnd = 58;
    if (rhythmProgress >= perfectZoneStart && rhythmProgress <= perfectZoneEnd) {
      rhythmScore += 1;
      rhythmButton.textContent = 'Perfecte hit!';
      if (window.motion?.animate) {
        window.motion.animate(rhythmButton, { scale: [1, 1.1, 1] }, { duration: 0.3 });
        window.motion.animate(rhythmPointer, { rotate: [0, 360] }, { duration: 0.6 });
      }
    } else {
      rhythmButton.textContent = 'Oei, te vroeg/laat!';
      rhythmScore = Math.max(0, rhythmScore - 1);
    }
    setTimeout(() => {
      rhythmButton.textContent = 'TIM DROP!';
    }, 700);
    if (rhythmScoreEl) {
      rhythmScoreEl.textContent = rhythmScore;
    }
  });

  // Selfie booth filters
  const filterButtons = document.querySelectorAll('[data-filter]');
  const selfieOverlay = document.querySelector('[data-selfie-overlay]');
  const selfieImage = document.querySelector('[data-selfie-image]');

  const filterStyles = {
    glow: 'box-shadow: 0 0 40px rgba(255, 114, 198, 0.8); background: radial-gradient(circle, rgba(255,114,198,0.35) 0%, transparent 70%);',
    frost: 'backdrop-filter: blur(6px); background: linear-gradient(135deg, rgba(31,182,255,0.4), rgba(124,58,237,0.4));',
    party: 'background-image: repeating-conic-gradient(rgba(255,145,77,0.4) 0deg 15deg, rgba(31,182,255,0.4) 15deg 30deg); mix-blend-mode: screen;',
    none: '',
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'none';
      if (selfieOverlay) {
        selfieOverlay.setAttribute('style', filterStyles[filter] || '');
      }
      if (selfieImage && filter === 'glow') {
        selfieImage.style.filter = 'saturate(1.4)';
      } else if (selfieImage && filter === 'frost') {
        selfieImage.style.filter = 'contrast(1.2) hue-rotate(-20deg)';
      } else if (selfieImage && filter === 'party') {
        selfieImage.style.filter = 'hue-rotate(45deg) saturate(1.5)';
      } else if (selfieImage) {
        selfieImage.style.filter = 'none';
      }
      filterButtons.forEach((button) => button.classList.remove('bg-white/20', 'text-slate-950'));
      btn.classList.add('bg-white/20', 'text-slate-950');
      if (window.motion?.animate) {
        window.motion.animate(selfieImage, { scale: [1, 1.05, 1] }, { duration: 0.4 });
      }
    });
  });

  // Après-ski soundboard
  const soundboardButtons = document.querySelectorAll('[data-soundboard-button]');
  if (soundboardButtons.length > 0) {
    const statusEl = document.querySelector('[data-soundboard-status]');
    const volumeControl = document.querySelector('[data-soundboard-volume]');
    const volumeLabel = document.querySelector('[data-soundboard-volume-label]');
    const visualizerBars = document.querySelectorAll('[data-soundboard-bar]');

    const defaultStatus = statusEl?.textContent || '';
    let audioCtx = null;
    let masterGain = null;
    const activeSources = new Set();
    let visualizerInterval = null;
    let visualizerTimeout = null;
    let statusTimeout = null;

    const ensureContext = () => {
      if (!audioCtx) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        audioCtx = new Context();
        masterGain = audioCtx.createGain();
        const initialGain = volumeControl ? Number(volumeControl.value || 75) / 100 : 0.75;
        masterGain.gain.value = initialGain;
        masterGain.connect(audioCtx.destination);
      }
      return audioCtx;
    };

    const resumeContext = async () => {
      const ctx = ensureContext();
      if (!ctx) return null;
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (error) {
          // ignore resume errors
        }
      }
      return ctx;
    };

    const watchSource = (source) => {
      if (!source) return;
      activeSources.add(source);
      const cleanup = () => {
        activeSources.delete(source);
      };
      if (typeof source.addEventListener === 'function') {
        source.addEventListener('ended', cleanup, { once: true });
      } else {
        source.onended = cleanup;
      }
    };

    const stopActiveSources = () => {
      const sources = Array.from(activeSources);
      activeSources.clear();
      sources.forEach((source) => {
        if (typeof source.stop === 'function') {
          try {
            source.stop();
          } catch (error) {
            // ignore if already stopped
          }
        }
      });
    };

    const startVisualizer = (duration) => {
      if (visualizerInterval) clearInterval(visualizerInterval);
      if (visualizerTimeout) clearTimeout(visualizerTimeout);
      if (visualizerBars.length === 0) return;

      visualizerInterval = window.setInterval(() => {
        visualizerBars.forEach((bar, index) => {
          const height = 20 + Math.random() * 70;
          const opacity = 0.45 + Math.random() * 0.45;
          bar.style.height = `${height}%`;
          bar.style.opacity = opacity.toFixed(2);
          bar.style.transition = 'height 0.14s ease, opacity 0.2s ease';
        });
      }, 140);

      visualizerTimeout = window.setTimeout(() => {
        stopVisualizer();
      }, duration * 1000);
    };

    const stopVisualizer = () => {
      if (visualizerInterval) {
        clearInterval(visualizerInterval);
        visualizerInterval = null;
      }
      if (visualizerTimeout) {
        clearTimeout(visualizerTimeout);
        visualizerTimeout = null;
      }
      visualizerBars.forEach((bar, index) => {
        const base = 10 + index * 3;
        bar.style.height = `${base}%`;
        bar.style.opacity = '0.35';
        bar.style.transition = 'height 0.4s ease, opacity 0.4s ease';
      });
    };

    const setStatus = (message) => {
      if (!statusEl) return;
      if (statusTimeout) {
        clearTimeout(statusTimeout);
        statusTimeout = null;
      }
      statusEl.textContent = message;
      if (window.motion?.animate) {
        window.motion.animate(statusEl, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.35 });
      }
    };

    const createNoiseBuffer = (ctx, duration, color = 'white') => {
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i += 1) {
        let value = Math.random() * 2 - 1;
        if (color === 'crowd') {
          value = (value + (Math.random() * 2 - 1)) / 2;
        } else if (color === 'sneeuw') {
          value *= Math.random();
        }
        data[i] = value;
      }
      return buffer;
    };

    const scheduleOscillator = (ctx, step, startTime) => {
      const duration = step.duration ?? 0.4;
      const attack = Math.min(step.attack ?? 0.02, duration);
      const release = step.release ?? 0.18;
      const volume = step.volume ?? 0.7;

      const oscillator = ctx.createOscillator();
      oscillator.type = step.wave || 'sine';
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + attack);
      const sustainStart = Math.max(startTime + attack, startTime + duration - release);
      gain.gain.setValueAtTime(volume, sustainStart);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      oscillator.frequency.setValueAtTime(step.freq || 440, startTime);
      if (typeof step.slideTo === 'number') {
        oscillator.frequency.linearRampToValueAtTime(step.slideTo, startTime + duration);
      }
      if (typeof step.detune === 'number') {
        oscillator.detune.setValueAtTime(step.detune, startTime);
      }

      if (step.vibrato) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(step.vibrato.speed ?? 6, startTime);
        lfoGain.gain.setValueAtTime(step.vibrato.depth ?? 12, startTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        lfo.start(startTime);
        lfo.stop(startTime + duration + release);
        watchSource(lfo);
      }

      oscillator.connect(gain);
      gain.connect(masterGain);

      watchSource(oscillator);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration + release);

      return duration + release;
    };

    const scheduleNoise = (ctx, step, startTime) => {
      const duration = step.duration ?? 0.6;
      const attack = Math.min(step.attack ?? 0.02, duration);
      const release = step.release ?? 0.2;
      const volume = step.volume ?? 0.45;

      const source = ctx.createBufferSource();
      source.buffer = createNoiseBuffer(ctx, duration + release, step.color);

      const filter = ctx.createBiquadFilter();
      filter.type = step.filter?.type || 'bandpass';
      filter.frequency.setValueAtTime(step.filter?.frequency ?? 900, startTime);
      filter.Q.setValueAtTime(step.filter?.q ?? 0.8, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + attack);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      watchSource(source);
      source.start(startTime);
      source.stop(startTime + duration + release);

      return duration + release;
    };

    const sequences = {
      proost: {
        message: 'Proost! Tim schuift een tray shotjes de bar op.',
        steps: [
          { wave: 'triangle', freq: 392, duration: 0.18, volume: 0.72 },
          { wave: 'square', freq: 466, duration: 0.18, volume: 0.78 },
          { wave: 'sawtooth', freq: 523, duration: 0.32, slideTo: 659, volume: 0.82, vibrato: { depth: 14, speed: 7 } },
          { kind: 'noise', duration: 0.6, at: 0.05, volume: 0.32, color: 'crowd', filter: { type: 'lowpass', frequency: 1400, q: 0.5 } },
        ],
      },
      polonaise: {
        message: 'De polonaise slingert de hut rond! Pak elkaars schouders!',
        steps: [
          { kind: 'noise', duration: 1.1, volume: 0.28, color: 'crowd', filter: { type: 'bandpass', frequency: 650, q: 0.6 } },
          { wave: 'square', freq: 330, duration: 0.32, volume: 0.66 },
          { wave: 'square', freq: 370, duration: 0.32, volume: 0.66 },
          { wave: 'square', freq: 415, duration: 0.48, volume: 0.68, slideTo: 330 },
          { wave: 'square', freq: 370, duration: 0.32, volume: 0.64 },
        ],
      },
      airhorn: {
        message: 'Dubbele Alpenclaxon! Iedereen naar het podium! 🚨',
        steps: [
          { wave: 'sawtooth', freq: 210, duration: 0.65, volume: 0.88, slideTo: 260 },
          { wave: 'sawtooth', freq: 220, duration: 0.58, at: 0.28, volume: 0.82, slideTo: 310 },
          { kind: 'noise', duration: 0.7, at: 0.18, volume: 0.3, color: 'sneeuw', filter: { type: 'highpass', frequency: 1200, q: 0.7 } },
        ],
      },
      drop: {
        message: 'DJ Tim gooit de drop! Hou je skibril vast!',
        steps: [
          { wave: 'sine', freq: 140, duration: 0.4, volume: 0.6 },
          { wave: 'sine', freq: 220, duration: 0.35, volume: 0.65 },
          { wave: 'triangle', freq: 320, duration: 0.32, slideTo: 520, volume: 0.7 },
          { kind: 'noise', duration: 0.8, at: 0.4, volume: 0.45, color: 'sneeuw', filter: { type: 'bandpass', frequency: 1800, q: 0.9 } },
          { wave: 'square', freq: 90, duration: 0.5, at: 0.72, volume: 0.9 },
        ],
      },
      sneeuwkanon: {
        message: 'Sneeuwkanon aan! Glitterstorm incoming! ❄️',
        steps: [
          { kind: 'noise', duration: 1.2, volume: 0.42, color: 'sneeuw', filter: { type: 'bandpass', frequency: 900, q: 1.2 } },
          { wave: 'triangle', freq: 480, duration: 0.3, at: 0.2, volume: 0.6, vibrato: { depth: 18, speed: 9 } },
          { wave: 'sawtooth', freq: 600, duration: 0.4, at: 0.5, volume: 0.7, slideTo: 720 },
        ],
      },
      shotjes: {
        message: 'Shotjesronde! Glas omhoog en zingen maar! 🥂',
        steps: [
          { wave: 'triangle', freq: 880, duration: 0.15, volume: 0.65 },
          { wave: 'triangle', freq: 932, duration: 0.15, volume: 0.65 },
          { wave: 'triangle', freq: 988, duration: 0.18, volume: 0.72 },
          { wave: 'triangle', freq: 1046, duration: 0.22, volume: 0.76 },
          { kind: 'noise', duration: 0.5, at: 0.05, volume: 0.26, color: 'crowd', filter: { type: 'lowpass', frequency: 1600, q: 0.6 } },
        ],
      },
    };

    const playSequence = (sequence) => {
      const ctx = ensureContext();
      if (!ctx || !masterGain) return 0;
      const baseTime = ctx.currentTime + 0.02;
      let timeline = 0;
      let totalDuration = 0;

      sequence.steps.forEach((step) => {
        const offset = step.at ?? timeline;
        const start = baseTime + offset;
        let segment = 0;
        if (step.kind === 'noise') {
          segment = scheduleNoise(ctx, step, start);
        } else {
          segment = scheduleOscillator(ctx, step, start);
        }
        totalDuration = Math.max(totalDuration, offset + segment);
        if (step.at === undefined) {
          timeline += step.duration ?? 0;
        } else {
          timeline = Math.max(timeline, step.at + (step.duration ?? 0));
        }
      });

      return totalDuration;
    };

    soundboardButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const soundKey = button.dataset.soundboardSound;
        const sequence = sequences[soundKey];
        if (!sequence) return;

        await resumeContext();
        if (!audioCtx || !masterGain) return;

        stopActiveSources();
        stopVisualizer();

        button.disabled = true;
        button.classList.add('opacity-60', 'cursor-not-allowed');

        const duration = playSequence(sequence);
        if (duration > 0) {
          startVisualizer(duration);
        }
        setStatus(sequence.message || defaultStatus);

        window.setTimeout(() => {
          button.disabled = false;
          button.classList.remove('opacity-60', 'cursor-not-allowed');
        }, Math.max(500, duration * 1000));

        if (defaultStatus && sequence.message !== defaultStatus) {
          statusTimeout = window.setTimeout(() => {
            if (statusEl && statusEl.textContent === sequence.message) {
              setStatus(defaultStatus);
            }
            statusTimeout = null;
          }, Math.max(1800, duration * 1000 + 300));
        }
      });
    });

    if (volumeControl) {
      const updateVolume = (value) => {
        if (!ensureContext() || !masterGain) return;
        const normalized = Math.max(0, Math.min(1, value / 100));
        masterGain.gain.setTargetAtTime(normalized, audioCtx.currentTime, 0.02);
        if (volumeLabel) {
          volumeLabel.textContent = `${Math.round(normalized * 100)}%`;
        }
      };

      updateVolume(Number(volumeControl.value || 75));

      volumeControl.addEventListener('input', (event) => {
        const value = Number(event.target.value || 0);
        updateVolume(value);
      });
    }
  }

  // Leaderboard sync
  const syncLeaderboard = document.querySelector('[data-sync-leaderboard]');
  const playerScoreEl = document.querySelector('[data-player-score]');
  if (syncLeaderboard && playerScoreEl) {
    syncLeaderboard.addEventListener('click', () => {
      const totalScore = snowballScore * 10 + Math.max(0, rhythmScore) * 25;
      playerScoreEl.textContent = totalScore;
      if (window.motion?.animate) {
        window.motion.animate('[data-player-entry]', { scale: [1, 1.1, 1] }, { duration: 0.4 });
      }
      syncLeaderboard.textContent = 'Scores gesynct!';
      setTimeout(() => {
        syncLeaderboard.textContent = 'Sync met jouw scores';
      }, 1500);
    });
  }
});
