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
  const spinVibes = [
    'de maestro van de marketing-polonaise! 🪩',
    'een skiende SEO-snowcat. ⛷️',
    'shotjes-sommelier eerste klas. 🥃',
    'de glittergoeroe van de Alpen. ✨',
    'de DJ die KPI\'s mixt met refreinen. 🎧',
    'een wandelende campagnemachine in skipak. 🚀',
  ];

  if (spinButton && spinResult) {
    spinButton.addEventListener('click', () => {
      spinButton.disabled = true;
      const randomVibe = spinVibes[Math.floor(Math.random() * spinVibes.length)];
      if (window.motion?.animate) {
        window.motion.animate('[data-spin-button]', { rotate: [0, 360] }, { duration: 0.8, easing: 'ease-out' });
        window.motion.animate('[data-spin-result]', { opacity: [0, 1], y: [-10, 0] }, { duration: 0.6 });
      }
      setTimeout(() => {
        spinResult.textContent = `Vandaag ben jij ${randomVibe}`;
        spinButton.disabled = false;
      }, 400);
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
