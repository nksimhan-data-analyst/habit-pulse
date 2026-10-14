import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'],
    });

    // Right burst
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'],
    });
  } catch {
    // Graceful fallback if window or canvas is restricted
  }
}

export function fireMilestoneConfetti() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#f59e0b', '#e11d48', '#3b82f6', '#10b981', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Fallback
  }
}
