import type { EffectDef, EffectProps } from "../types";
import { useElapsed, useEnter } from "../useAnimation";
import {
  ACCENT_OPTIONS,
  ACCENT_VAR,
  GLASS_DEFAULTS,
  OFFSET_CONTROLS,
  OFFSET_DEFAULTS,
  offsetVars,
  THEME_OPTIONS,
  glassClass,
  glassVars,
} from "./accent";

export interface CountdownOrTimerParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 模式:countdown 倒计时 / elapsed 经过计时 */
  mode: "countdown" | "elapsed";
  /** 目标秒数(倒计时从此开始)",elapsed 从此值往上计 */
  seconds: number;
  /** 顶部小标 */
  kicker: string;
  /** 底部说明 */
  label: string;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

function fmtTime(totalSeconds: number) {
  const t = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * 计时卡 · 倒计时或经过计时
 * 用于限时挑战、紧迫感节拍、训练时长等场景。
 */
function CountdownOrTimer({ params, playToken }: EffectProps<CountdownOrTimerParams>) {
  const { position, mode, seconds, kicker, label, accent } = params;
  const entered = useEnter(playToken);
  const elapsed = useElapsed(playToken, Math.max(seconds, 1) * 2000) / 1000;
  const shown = mode === "countdown" ? Math.max(0, seconds - elapsed) : seconds + elapsed;

  return (
    <div
      className={`hud cdt hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="cdt-card">
        {kicker && <div className="cdt-kicker">{kicker}</div>}
        <div className="cdt-num">{fmtTime(shown)}</div>
        {label && <div className="cdt-label">{label}</div>}
      </div>
    </div>
  );
}

export const countdownOrTimerDef: EffectDef<CountdownOrTimerParams> = {
  id: "countdown-or-timer",
  name: "CountdownOrTimer",
  description: "计时卡 · 倒计时或经过计时",
  tags: ["滚动计数"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "center",
    mode: "countdown",
    seconds: 60,
    kicker: "COUNTDOWN",
    label: "限时挑战",
    accent: "alert",
    ...GLASS_DEFAULTS,
    ...OFFSET_DEFAULTS,
  },
  controls: [
    { key: "theme", label: "底色(此卡独立生效)", type: "select", options: THEME_OPTIONS },
    {
      key: "position",
      label: "落位",
      type: "select",
      options: [
        { label: "左侧", value: "left" },
        { label: "居中", value: "center" },
        { label: "右侧", value: "right" },
      ],
    },
    {
      key: "mode",
      label: "模式",
      type: "select",
      options: [
        { label: "倒计时", value: "countdown" },
        { label: "经过计时", value: "elapsed" },
      ],
    },
    { key: "seconds", label: "起始秒数", type: "range", min: 5, max: 600, step: 5, unit: "s" },
    { key: "kicker", label: "顶部小标", type: "text" },
    { key: "label", label: "底部说明", type: "text" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: CountdownOrTimer,
};
