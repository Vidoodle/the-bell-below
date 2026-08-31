export type AmbientScore = {
  stop: () => void;
};

const droneNotes = [73.42, 87.31, 110];
const bellNotes = [220, 261.63, 293.66, 349.23];
const masterVolume = 0.26;

export async function startAmbientScore(): Promise<AmbientScore> {
  const context = new AudioContext();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(4);
  const feedback = context.createGain();
  const wet = context.createGain();
  const oscillators: OscillatorNode[] = [];
  let bellTimer: number | undefined;
  let stopped = false;

  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(masterVolume, context.currentTime + 3);
  filter.type = "lowpass";
  filter.frequency.value = 480;
  filter.Q.value = 0.8;
  delay.delayTime.value = 1.7;
  feedback.gain.value = 0.24;
  wet.gain.value = 0.3;
  master.connect(filter).connect(context.destination);
  filter.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(context.destination);

  droneNotes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index === 2 ? -7 : index * 4;
    gain.gain.value = index === 0 ? 0.45 : 0.16;
    oscillator.connect(gain).connect(master);
    oscillator.start();
    oscillators.push(oscillator);
  });

  const playBell = () => {
    if (stopped) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const note = bellNotes[Math.floor(Math.random() * bellNotes.length)];

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note, now);
    oscillator.frequency.exponentialRampToValueAtTime(note * 0.985, now + 5);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 6);
    oscillator.connect(gain).connect(master);
    oscillator.start(now);
    oscillator.stop(now + 6);

    bellTimer = window.setTimeout(playBell, 7_000 + Math.random() * 9_000);
  };

  bellTimer = window.setTimeout(playBell, 2_500);
  await context.resume();

  return {
    stop() {
      stopped = true;
      if (bellTimer !== undefined) window.clearTimeout(bellTimer);
      master.gain.cancelAndHoldAtTime(context.currentTime);
      master.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
      window.setTimeout(() => {
        oscillators.forEach((oscillator) => oscillator.stop());
        void context.close();
      }, 350);
    },
  };
}
