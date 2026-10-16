import type { EffectDef, EffectProps } from "../types";
import { useEnter, useProgress } from "../useAnimation";
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

export interface ProgressStepsParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 阶段名称,| 分隔 */
  steps: string;
  /** 当前所在阶段(1 开始),0 = 未开始 */
  current: number;
  /** 标题 */
  title: string;
  /** 进度条走完时长 */
  fillMs: number;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

function parseSteps(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

/**
 * 阶段进度卡 · 横向步骤追踪
 * 用于展示当前处于流程的哪一步,「已完成 / 进行中 / 待完成」一目了然。
 */
function ProgressSteps({ params, playToken }: EffectProps<ProgressStepsParams>) {
  const { position, steps, current, title, fillMs, accent } = params;
  const entered = useEnter(playToken);
  const list = parseSteps(steps);
  const draw = useProgress(Math.max(400, fillMs), playToken);
  const target = Math.max(0, Math.min(current, list.length));
  const progress = target / Math.max(list.length, 1);
  const shown = Math.min(progress, progress * draw);

  return (
    <div
      className={`hud pst hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="pst-card">
        {title && <div className="pst-title">{title}</div>}
        <div className="pst-track">
          <div className="pst-fill" style={{ transform: `scaleX(${shown})` }} />
          {list.map((s, i) => {
            const at = (i / Math.max(list.length - 1, 1)) * 0.96;
            const on = Math.max(0, Math.min(1, (draw * progress - at) / 0.08));
            const active = i + 1 <= target;
            return (
              <div
                key={i}
                className={`pst-node ${active ? "is-active" : ""}`}
                style={{ left: `${(i / Math.max(list.length - 1, 1)) * 100}%`, opacity: 0.3 + 0.7 * on }}
              >
                <span className="pst-nnum">{i + 1}</span>
                <span className="pst-nlabel">{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const progressStepsDef: EffectDef<ProgressStepsParams> = {
  id: "progress-steps",
  name: "ProgressSteps",
  description: "阶段进度卡 · 横向步骤追踪",
  tags: ["生长描画"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "left",
    title: "当前进度",
    steps: "准备|执行|验证|复盘",
    current: 2,
    fillMs: 1200,
    accent: "blue",
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
    { key: "title", label: "标题", type: "text" },
    { key: "steps", label: "阶段(| 分隔,最多 6 个)", type: "text" },
    { key: "current", label: "当前阶段(1 开始)", type: "range", min: 0, max: 6, step: 1 },
    { key: "fillMs", label: "进度画满时长", type: "range", min: 400, max: 4000, step: 100, unit: "ms" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: ProgressSteps,
};
