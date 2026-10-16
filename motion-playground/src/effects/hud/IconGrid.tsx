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

export interface IconGridParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 项目,| 分隔,每项「图标 标签」 */
  items: string;
  /** 列数 */
  columns: 2 | 3;
  /** 标题 */
  title: string;
  /** 每项弹入间隔 */
  stepMs: number;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

interface GridItem {
  icon: string;
  label: string;
}

function parseItems(raw: string): GridItem[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((seg) => {
      const m = seg.match(/^(.+?)\s+(.+)$/);
      return m ? { icon: m[1].trim(), label: m[2].trim() } : { icon: "◆", label: seg };
    });
}

/**
 * 图标网格卡 · 2×2 或 3 列图标+标签并列
 * 用于展示并列概念、工具、特征,信息密度高且整齐。
 */
function IconGrid({ params, playToken }: EffectProps<IconGridParams>) {
  const { position, items, columns, title, stepMs, accent } = params;
  const entered = useEnter(playToken);
  const list = parseItems(items);
  const colClass = columns === 3 ? "ig-grid--3" : "ig-grid--2";

  return (
    <div
      className={`hud ig hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="ig-card">
        {title && <div className="ig-title">{title}</div>}
        <div className={`ig-grid ${colClass}`}>
          {list.map((it, i) => (
            <div
              className="ig-cell"
              key={i}
              style={{ transitionDelay: `${260 + i * stepMs}ms` }}
            >
              <span className="ig-icon">{it.icon}</span>
              <span className="ig-label">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const iconGridDef: EffectDef<IconGridParams> = {
  id: "icon-grid",
  name: "IconGrid",
  description: "图标网格卡 · 2×2 或 3 列图标+标签并列",
  tags: ["逐条落位"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "center",
    title: "四大核心能力",
    items: "🎯 目标感|⚡ 行动力|🧠 判断力|🔄 复盘力",
    columns: 2,
    stepMs: 120,
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
    { key: "title", label: "标题(可空)", type: "text" },
    { key: "items", label: "项目(图标 标签,| 分隔,最多 6 项)", type: "textarea", rows: 3 },
    {
      key: "columns",
      label: "列数",
      type: "select",
      options: [
        { label: "2 列", value: "2" },
        { label: "3 列", value: "3" },
      ],
    },
    { key: "stepMs", label: "每项弹入间隔", type: "range", min: 0, max: 600, step: 20, unit: "ms" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: IconGrid,
};
