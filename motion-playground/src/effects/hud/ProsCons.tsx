import type { EffectDef, EffectProps } from "../types";
import { useEnter } from "../useAnimation";
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

export interface ProsConsParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 利/优点列表,| 分隔 */
  pros: string;
  /** 弊/缺点列表,| 分隔 */
  cons: string;
  /** 左列标题 */
  prosTitle: string;
  /** 右列标题 */
  consTitle: string;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

function parseList(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

/**
 * 利弊卡 · 两列清单对比
 * 用于「这件事的好处 vs 坏处」「做 vs 不做」这类取舍论述。
 */
function ProsCons({ params, playToken }: EffectProps<ProsConsParams>) {
  const { position, pros, cons, prosTitle, consTitle, accent } = params;
  const entered = useEnter(playToken);
  const proList = parseList(pros);
  const conList = parseList(cons);

  return (
    <div
      className={`hud pc hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="pc-grid">
        <div className="pc-col pc-col--pro" style={{ transitionDelay: "120ms" }}>
          <div className="pc-head">{prosTitle}</div>
          {proList.map((t, i) => (
            <div className="pc-item" key={i} style={{ transitionDelay: `${260 + i * 110}ms` }}>
              <span className="pc-dot">✓</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <div className="pc-col pc-col--con" style={{ transitionDelay: "240ms" }}>
          <div className="pc-head">{consTitle}</div>
          {conList.map((t, i) => (
            <div className="pc-item" key={i} style={{ transitionDelay: `${380 + i * 110}ms` }}>
              <span className="pc-dot">✗</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const prosConsDef: EffectDef<ProsConsParams> = {
  id: "pros-cons",
  name: "ProsCons",
  description: "利弊卡 · 两列清单对比",
  tags: ["对撞并置", "逐条落位"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "center",
    prosTitle: "利",
    consTitle: "弊",
    pros: "门槛低|见效快|可复制",
    cons: "容易卷|需持续投入|上限明显",
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
    { key: "prosTitle", label: "优点列标题", type: "text" },
    { key: "consTitle", label: "缺点列标题", type: "text" },
    { key: "pros", label: "优点(✓,| 分隔,最多 5 条)", type: "text" },
    { key: "cons", label: "缺点(✗,| 分隔,最多 5 条)", type: "text" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: ProsCons,
};
