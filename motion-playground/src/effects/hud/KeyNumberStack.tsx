import type { EffectDef, EffectProps } from "../types";
import { useCountUp, useEnter } from "../useAnimation";
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

export interface KeyNumberStackParams {
  theme: "dark" | "light";
  position: "left" | "right" | "center";
  /** 数字行,| 分隔,每行「数字 标签」 */
  items: string;
  /** 数字前缀,如 +/¥ */
  prefix: string;
  /** 数字后缀,如 +/% */
  suffix: string;
  /** 计数时长 */
  countMs: number;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

interface NumRow {
  value: number;
  label: string;
}

function parseItems(raw: string): NumRow[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((seg) => {
      const m = seg.match(/^([\d.]+)\s+(.+)$/);
      return m ? { value: parseFloat(m[1]), label: m[2].trim() } : { value: 0, label: seg };
    });
}

/**
 * 数字堆叠卡 · 2-3 个大数字短标签纵向叠放
 * 用于一次抛出多个核心指标,不需要排名对比。
 */
function KeyNumberStack({ params, playToken }: EffectProps<KeyNumberStackParams>) {
  const { position, items, prefix, suffix, countMs, accent } = params;
  const entered = useEnter(playToken);
  const rows = parseItems(items);
  const p = useCountUp(1, countMs, playToken);

  return (
    <div
      className={`hud kns hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="kns-stack">
        {rows.map((r, i) => {
          const n = Math.round(r.value * p);
          return (
            <div
              className="kns-row"
              key={i}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <span className="kns-num">
                {prefix && <span className="kns-fix">{prefix}</span>}
                {n.toLocaleString("en-US")}
                {suffix && <span className="kns-fix kns-suffix">{suffix}</span>}
              </span>
              <span className="kns-label">{r.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const keyNumberStackDef: EffectDef<KeyNumberStackParams> = {
  id: "key-number-stack",
  name: "KeyNumberStack",
  description: "数字堆叠卡 · 2-3 个大数字短标签纵向叠放",
  tags: ["滚动计数", "堆叠累积"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "left",
    items: "12 万 播放量|8.4 分 评分|3 倍 完播提升",
    prefix: "",
    suffix: "",
    countMs: 1400,
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
        { label: "右侧", value: "right" },
        { label: "居中", value: "center" },
      ],
    },
    {
      key: "items",
      label: "数字行(数值 标签,| 分隔,最多 3 行)",
      type: "textarea",
      rows: 3,
    },
    { key: "prefix", label: "数字前缀(+/¥)", type: "text" },
    { key: "suffix", label: "数字后缀(+/%)", type: "text" },
    { key: "countMs", label: "计数时长(卡点用)", type: "range", min: 400, max: 5000, step: 100, unit: "ms" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: KeyNumberStack,
};
