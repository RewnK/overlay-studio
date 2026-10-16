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

export interface CalloutBannerParams {
  theme: "dark" | "light";
  position: "top" | "bottom";
  /** 横幅主文案 */
  label: string;
  /** 左侧小标(可空) */
  kicker: string;
  accent: string;
  offsetX?: number;
  offsetY?: number;
  glass?: "none" | "dark" | "light";
  glassAlpha?: number;
}

/**
 * 横幅卡 · 贴顶/贴底通栏提示
 * 用于章节切换、警示条、行动号召等需要一条横带贯穿画面的时刻。
 */
function CalloutBanner({ params, playToken }: EffectProps<CalloutBannerParams>) {
  const { position, label, kicker, accent } = params;
  const entered = useEnter(playToken);

  return (
    <div
      className={`hud cob hud-anchor hud-anchor--${position} ${glassClass(params.glass)} ${entered ? "is-in" : ""}`}
      style={{
        ["--hud-acc" as string]: ACCENT_VAR[accent],
        ...offsetVars(params),
        ...glassVars(params.glassAlpha),
      }}
    >
      <div className="cob-bar">
        <span className="cob-strip" />
        <span className="cob-kicker">{kicker}</span>
        <span className="cob-label">{label}</span>
      </div>
    </div>
  );
}

export const calloutBannerDef: EffectDef<CalloutBannerParams> = {
  id: "callout-banner",
  name: "CalloutBanner",
  description: "横幅卡 · 贴顶/贴底通栏提示",
  tags: ["扫过点亮"],
  selfPosition: true,
  defaults: {
    theme: "dark",
    position: "top",
    label: "这是一个需要强调的全局提示",
    kicker: "SECTION",
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
        { label: "顶部", value: "top" },
        { label: "底部", value: "bottom" },
      ],
    },
    { key: "label", label: "横幅主文案", type: "text" },
    { key: "kicker", label: "左侧小标(可空)", type: "text" },
    { key: "accent", label: "强调色", type: "select", options: ACCENT_OPTIONS },
    ...OFFSET_CONTROLS,
  ],
  Component: CalloutBanner,
};
