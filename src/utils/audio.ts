// Web Audio synthesizer for subtle tactile click feedback

let audioCtx: AudioContext | null = null;

export function playKeySound(type: 'digit' | 'operator' | 'action' | 'equals' | 'clear') {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const now = audioCtx.currentTime;
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    let freq = 600;
    let duration = 0.035;

    switch (type) {
      case 'digit':
        freq = 520;
        duration = 0.025;
        break;
      case 'operator':
        freq = 740;
        duration = 0.03;
        break;
      case 'action':
        freq = 440;
        duration = 0.03;
        break;
      case 'equals':
        freq = 880;
        duration = 0.05;
        break;
      case 'clear':
        freq = 380;
        duration = 0.04;
        break;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + duration);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // AudioContext blocked or not supported; fail silently
  }
}
