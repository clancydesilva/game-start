// 8-Bit Web Audio Synthesizer for Arcade Sound Effects

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a simple 8-bit tone
  private playTone(freq: number, type: OscillatorType, duration: number, startDelay = 0, gainLevel = 0.1) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startDelay);
      osc.stop(ctx.currentTime + startDelay + duration);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Block drop/land sound
  public playDrop() {
    const ctx = this.getContext();
    if (!ctx) return;
    this.playTone(120, 'square', 0.08, 0, 0.15);
    this.playTone(80, 'triangle', 0.12, 0.03, 0.2);
  }

  // Block rotation sound
  public playRotate() {
    this.playTone(320, 'square', 0.04, 0, 0.08);
    this.playTone(480, 'square', 0.05, 0.03, 0.08);
  }

  // Line Clear / Board solved fanfare
  public playLineClear() {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'square', 0.15, i * 0.08, 0.12);
    });
  }

  // Pac-Man chomping sound (wakka)
  public playPacman() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.07);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.14);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.17);
    } catch {
      // ignore
    }
  }

  // Insert Coin / Level up
  public playCoin() {
    this.playTone(987.77, 'square', 0.1, 0, 0.12);
    this.playTone(1318.51, 'square', 0.35, 0.09, 0.15);
  }

  // Resonance heart upvote sound
  public playResonance() {
    this.playTone(523.25, 'sine', 0.08, 0, 0.12); // C5
    this.playTone(659.25, 'sine', 0.1, 0.06, 0.12); // E5
    this.playTone(783.99, 'sine', 0.2, 0.12, 0.15); // G5
  }

  // Game over sound
  public playGameOver() {
    const notes = [440, 415, 392, 370, 349, 311, 260];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sawtooth', 0.22, idx * 0.12, 0.15);
    });
  }

  // Simple retro click/beep
  public playBeep() {
    this.playTone(600, 'square', 0.04, 0, 0.06);
  }
}

export const sfx = new SoundEffects();
