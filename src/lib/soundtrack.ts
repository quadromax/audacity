/** Original AUDACITY composition: 80 BPM, Am9–Fmaj7–Cmaj7–G6.
 * Synthesized locally. No recordings, samples, external media, or licensed melodies. */
export async function composeSoundtrack(): Promise<AudioBuffer> {
  const rate = 22050,
    beat = 0.75,
    duration = 24,
    tail = 3;
  const ctx = new OfflineAudioContext(2, rate * (duration + tail), rate);
  const bus = ctx.createGain();
  bus.gain.value = 0.38;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.ratio.value = 3;
  bus.connect(compressor);
  compressor.connect(ctx.destination);
  const delay = ctx.createDelay(2),
    feedback = ctx.createGain(),
    wet = ctx.createGain();
  delay.delayTime.value = beat * 0.75;
  feedback.gain.value = 0.25;
  wet.gain.value = 0.2;
  bus.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(compressor);
  function note(
    midi: number,
    when: number,
    length: number,
    gain: number,
    type: OscillatorType,
    pan = 0,
    cutoff = 1300,
  ) {
    const osc = ctx.createOscillator(),
      amp = ctx.createGain(),
      filter = ctx.createBiquadFilter(),
      stereo = ctx.createStereoPanner();
    osc.type = type;
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    stereo.pan.value = pan;
    amp.gain.setValueAtTime(0, when);
    amp.gain.linearRampToValueAtTime(gain, when + Math.min(0.35, length * 0.2));
    amp.gain.setValueAtTime(gain * 0.65, when + length * 0.65);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + length);
    osc.connect(filter);
    filter.connect(amp);
    amp.connect(stereo);
    stereo.connect(bus);
    osc.start(when);
    osc.stop(when + length + 0.01);
  }
  const chords = [
    [57, 60, 64, 71],
    [53, 57, 60, 64],
    [48, 55, 59, 64],
    [55, 59, 62, 64],
  ];
  chords.forEach((chord, bar) => {
    const start = bar * 6;
    chord.forEach((pitch, i) => {
      note(pitch, start, 6.5, 0.045, "triangle", (i - 1.5) * 0.35);
      note(
        pitch + 12,
        start + 0.02,
        6.3,
        0.012,
        "sawtooth",
        (1.5 - i) * 0.3,
        700,
      );
    });
    for (let step = 0; step < 8; step++) {
      note(chord[0] - 12, start + step * beat, 0.55, 0.12, "sine", 0, 400);
      if (step % 2 === 1)
        note(
          chord[(step + bar) % 4] + 12,
          start + step * beat,
          0.65,
          0.025,
          "sine",
          step % 4 === 1 ? -0.45 : 0.45,
          1800,
        );
    }
  });
  // Soft original percussion: synthesized kick and high-passed deterministic noise.
  let seed = 731;
  const noise = ctx.createBuffer(1, rate * 0.12, rate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    seed = (seed * 16807) % 2147483647;
    samples[i] =
      ((seed / 2147483647) * 2 - 1) * Math.pow(1 - i / samples.length, 3);
  }
  for (let step = 0; step < 64; step++) {
    const t = (step * beat) / 2;
    if (step % 4 === 0) {
      const kick = ctx.createOscillator(),
        gain = ctx.createGain();
      kick.frequency.setValueAtTime(85, t);
      kick.frequency.exponentialRampToValueAtTime(38, t + 0.18);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      kick.connect(gain);
      gain.connect(bus);
      kick.start(t);
      kick.stop(t + 0.36);
    }
    if (step % 2 === 1) {
      const source = ctx.createBufferSource(),
        filter = ctx.createBiquadFilter(),
        gain = ctx.createGain();
      source.buffer = noise;
      filter.type = "highpass";
      filter.frequency.value = 6500;
      gain.gain.value = step % 4 === 3 ? 0.055 : 0.025;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(bus);
      source.start(t);
    }
  }
  const rendered = await ctx.startRendering();
  const loop = new AudioBuffer({
    numberOfChannels: 2,
    length: rate * duration,
    sampleRate: rate,
  });
  for (let channel = 0; channel < 2; channel++) {
    const src = rendered.getChannelData(channel),
      dst = loop.getChannelData(channel);
    dst.set(src.subarray(0, dst.length));
    for (let i = 0; i < rate * tail; i++) dst[i] += src[dst.length + i];
  }
  return loop;
}
