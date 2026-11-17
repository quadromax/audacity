"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { composeSoundtrack } from "@/lib/soundtrack";
const key = "audacity-audio-v1";
export function AudioWidget() {
  const [on, setOn] = useState(false),
    [volume, setVolume] = useState(0.3),
    [busy, setBusy] = useState(false),
    [remembered, setRemembered] = useState(false),
    [error, setError] = useState("");
  const engine = useRef<{
      ctx: AudioContext;
      gain: GainNode;
      source?: AudioBufferSourceNode;
    } | null>(null),
    mounted = useRef(true),
    fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    mounted.current = true;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      if (typeof saved.volume === "number" && Number.isFinite(saved.volume))
        setVolume(Math.max(0, Math.min(1, saved.volume)));
      setRemembered(saved.enabled === true);
    } catch {}
    return () => {
      mounted.current = false;
      clearTimeout(fadeTimer.current);
      engine.current?.source?.stop();
      void engine.current?.ctx.close();
      engine.current = null;
    };
  }, []);
  function save(enabled: boolean, value: number) {
    try {
      localStorage.setItem(key, JSON.stringify({ enabled, volume: value }));
    } catch {}
  }
  async function toggle() {
    if (busy) return;
    setError("");
    clearTimeout(fadeTimer.current);
    if (on && engine.current) {
      const { ctx, gain } = engine.current;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      setOn(false);
      setRemembered(false);
      save(false, volume);
      fadeTimer.current = setTimeout(() => void ctx.suspend(), 650);
      return;
    }
    setBusy(true);
    try {
      if (!engine.current) {
        const ctx = new AudioContext(),
          gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        engine.current = { ctx, gain };
      }
      const current = engine.current;
      await current.ctx.resume();
      if (!current.source) {
        const buffer = await composeSoundtrack();
        if (!mounted.current) return;
        const source = current.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(current.gain);
        source.start();
        current.source = source;
      }
      if (!mounted.current) return;
      current.gain.gain.cancelScheduledValues(current.ctx.currentTime);
      current.gain.gain.setTargetAtTime(volume, current.ctx.currentTime, 0.35);
      setOn(true);
      setRemembered(true);
      save(true, volume);
    } catch {
      setError("Sound unavailable. Tap to retry.");
      setOn(false);
      if (engine.current) {
        void engine.current.ctx.close();
        engine.current = null;
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <aside
      className={"audio-widget " + (on ? "audio-on" : "")}
      aria-label="AUDACITY soundtrack"
    >
      <button
        aria-label={
          on
            ? "Mute soundtrack"
            : remembered
              ? "Resume soundtrack"
              : "Enable soundtrack"
        }
        aria-pressed={on}
        disabled={busy}
        onClick={toggle}
      >
        {on ? <Volume2 size={17} /> : <VolumeX size={17} />}
        <span>
          <strong>LEONIDA FM</strong>
          <small>
            {busy
              ? "TUNING IN"
              : on
                ? volume === 0
                  ? "SILENT / 0%"
                  : "NIGHT DRIVE / ON"
                : remembered
                  ? "TAP TO RESUME"
                  : "SOUND OFF"}
          </small>
        </span>
        <i aria-hidden="true" />
      </button>
      <label>
        <span className="sr-only">Soundtrack volume</span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(volume * 100)}
          aria-valuetext={Math.round(volume * 100) + " percent"}
          onChange={(e) => {
            const next = Number(e.target.value) / 100;
            setVolume(next);
            save(on || remembered, next);
            const audio = engine.current;
            if (audio && on) {
              audio.gain.gain.cancelScheduledValues(audio.ctx.currentTime);
              audio.gain.gain.setTargetAtTime(next, audio.ctx.currentTime, 0.1);
            }
          }}
        />
      </label>
      <span className="audio-error" role="status">
        {error}
      </span>
    </aside>
  );
}
