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

export interface SourceCiteParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 来源类型小标,如 SOURCE / PAPER / NEWS */
  type: string;
  /** 来源名称 */
  source: string;
  /** 日期 */
  date: string;
  /** 补充说明,如 URL/期刊/作者 */
  note: string;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

/**
 * 来源卡 · 紧凑的引用/出处 chip 行
 * 用于引用论文、报道、数据时给观众一个可信赖的出处提示。
 */
function SourceCite({ params, playToken }: EffectProps<SourceCiteParams>) {
  const { position, type, source, date, note, accent } = params;
  const entered = useEnter(playToken);

  return (
    <div
      className={`hud sc hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="sc-chip">
        <span className="sc-type">{type}</span>
        <span className="sc-source">{source}</span>
        {date && <span className="sc-date">{date}</span>}
        {note && <span className="sc-note">{note}</span>}
      </div>
    </div>
  );
}

export const sourceCiteDef: EffectDef<SourceCiteParams> = {
  id: "source-cite",
  name: "SourceCite",
  description: "来源卡 · 紧凑的引用/出处 chip 行",
  tags: ["扫过点亮"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "left",
    type: "SOURCE",
    source: "Nature · 2026",
    date: "06.14",
    note: "样本量 n=4,217",
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
    { key: "type", label: "来源类型标签", type: "text" },
    { key: "source", label: "来源名称", type: "text" },
    { key: "date", label: "日期", type: "text" },
    { key: "note", label: "补充说明", type: "text" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: SourceCite,
};
