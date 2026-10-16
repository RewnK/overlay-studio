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

export interface BeforeAfterParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 变化前关键词 */
  before: string;
  /** 变化后关键词 */
  after: string;
  /** 变化前标签 */
  beforeLabel: string;
  /** 变化后标签 */
  afterLabel: string;
  /**  wipe 动画时长 */
  wipeMs: number;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

/**
 * 前后对比卡 · 水平 before→after 转换
 * 用于展示改变、成长、解决方案效果:从旧状态扫向新状态。
 */
function BeforeAfter({ params, playToken }: EffectProps<BeforeAfterParams>) {
  const { position, before, after, beforeLabel, afterLabel, wipeMs, accent } = params;
  const entered = useEnter(playToken);
  const draw = useProgress(Math.max(500, wipeMs), playToken);

  return (
    <div
      className={`hud ba hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="ba-card">
        <div className="ba-row">
          <div className="ba-side ba-side--before">
            <span className="ba-tag">{beforeLabel}</span>
            <span className="ba-word">{before}</span>
          </div>
          <div className="ba-arrow">
            <svg viewBox="0 0 48 24" width="48" height="24">
              <path d="M2 12h40M34 4l10 8-10 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="ba-side ba-side--after">
            <span className="ba-tag">{afterLabel}</span>
            <span className="ba-word">{after}</span>
          </div>
        </div>
        <div className="ba-track">
          <div className="ba-fill" style={{ transform: `scaleX(${draw})` }} />
        </div>
      </div>
    </div>
  );
}

export const beforeAfterDef: EffectDef<BeforeAfterParams> = {
  id: "before-after",
  name: "BeforeAfter",
  description: "前后对比卡 · 水平 before→after 转换",
  tags: ["生长描画", "对撞并置"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "center",
    before: "混乱",
    after: "清晰",
    beforeLabel: "变化前",
    afterLabel: "变化后",
    wipeMs: 1200,
    accent: "orange",
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
    { key: "before", label: "变化前关键词", type: "text" },
    { key: "after", label: "变化后关键词", type: "text" },
    { key: "beforeLabel", label: "变化前标签", type: "text" },
    { key: "afterLabel", label: "变化后标签", type: "text" },
    { key: "wipeMs", label: "转换动画时长", type: "range", min: 400, max: 4000, step: 100, unit: "ms" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: BeforeAfter,
};
