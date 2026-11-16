import type { SpecAnnotation } from "./firstDesign/inspectorTypes";

/**
 * Dev inspection for the CRCLE profile phone.
 * Uses the same spec cards and hotspot overlay as the Bending Spoons inspector.
 * Ids match `[data-inspect-id]` on the live controls.
 */
export const CRCLE_PROFILE_INSPECT: SpecAnnotation[] = [
  {
    id: "onboarding-done",
    kind: "button",
    hotspot: { x: 72, y: 58 },
    bounds: { x: 52, y: 54, w: 40, h: 8 },
    toast: { side: "left", top: 36 },
    category: "+ Button",
    element: "Get Started",
    elementType: "Primary Action Button",
    target: "Profile onboarding — leave the customise sheet and land on the dashboard.",
    spacing: "Height 49px · full pill · 8px gap beside Skip tutorial",
    accessibleName: "Get Started",
    aria: 'role="button"',
    description: "Dismisses the customise-your-profile sheet. The auto-demo taps this first.",
  },
  {
    id: "mood-toggle",
    kind: "button",
    hotspot: { x: 62, y: 28 },
    bounds: { x: 48, y: 24, w: 28, h: 6 },
    toast: { side: "left", top: 18 },
    category: "+ Button",
    element: "Broadcast mood",
    elementType: "Status Chip",
    target: "Profile — open the mood switch without leaving the dashboard.",
    spacing: "Pill · pl 8px / pr 4px · 24px icon · paired with Signal Live",
    accessibleName: "Broadcast mood",
    aria: 'role="button"',
    description: "Opens the mood sheet. Choosing In the area continues into messages.",
  },
  {
    id: "bento-work",
    kind: "frame",
    hotspot: { x: 74, y: 62 },
    bounds: { x: 52, y: 52, w: 44, h: 18 },
    toast: { side: "left", top: 48 },
    category: "Frame",
    element: "Work",
    elementType: "Bento Widget",
    target: "Profile dashboard — the work tile that opens the edit sheet.",
    spacing: "Radius 20px · padding 8px · frosted glass tile",
    accessibleName: "Work",
    aria: 'role="button"',
    description: "Opens Edit Work. The auto-demo taps this tile after the mood switch.",
  },
  {
    id: "sheet-close",
    kind: "button",
    hotspot: { x: 82, y: 22 },
    bounds: { x: 72, y: 18, w: 20, h: 6 },
    toast: { side: "left", top: 12 },
    category: "+ Button",
    element: "Done",
    elementType: "Sheet Action",
    target: "Edit Work — close the sheet and return to the profile.",
    spacing: "37×72px · radius 20px",
    accessibleName: "Done",
    aria: 'role="button"',
    description: "Saves the sheet and closes it. The auto-demo ends on this control.",
  },
];

export function crcleMessagingInspect(
  conversations: { id: string; userName: string; lastMessage: string }[],
) {
  return conversations.flatMap((conversation): SpecAnnotation[] => [
    {
      id: `chat-row-${conversation.id}`,
      kind: "frame",
      hotspot: { x: 50, y: 70 },
      bounds: { x: 4, y: 64, w: 92, h: 8 },
      toast: { side: "left", top: 24 },
      category: "Frame",
      element: conversation.userName,
      elementType: "Chat List Row",
      target: "Messaging inbox — one person in the active chat list.",
      spacing: "Padding 12px · gap 12px · avatar 42px · meta column 20px · 1px row rule",
      accessibleName: conversation.userName,
      aria: 'role="button"',
      description: `ChatListItem. class flex w-full items-center justify-between border-b p-3. Opens ${conversation.userName}'s thread.`,
    },
    {
      id: `chat-preview-${conversation.id}`,
      kind: "reading",
      hotspot: { x: 50, y: 74 },
      bounds: { x: 18, y: 70, w: 70, h: 3 },
      toast: { side: "left", top: 48 },
      category: "Reading",
      element: conversation.lastMessage,
      elementType: "Preview Line",
      target: "Messaging inbox — the last message under the name.",
      spacing: "13px light / 16.25px · 2px under the name · truncate to one line",
      accessibleName: conversation.lastMessage,
      aria: "text",
      description:
        "class w-full truncate text-[13px] font-light leading-[16.25px] text-[var(--crcle-fg-muted)].",
    },
  ]);
}

/** Spec cards for the hovered chat row. Idle inspection shows Alex Hart. */
export function crcleMessagingInspectFocus(annotations: SpecAnnotation[], activeId: string | null) {
  const stem = activeId?.replace(/^chat-(row|preview)-/, "") ?? "chat-alex";
  const pair = annotations.filter((annotation) => annotation.id.endsWith(stem));
  return pair.length > 0 ? pair : annotations.filter((annotation) => annotation.id.endsWith("chat-alex"));
}

export function crcleInspectForScreen(onboardingOpen: boolean, overlay: string | null) {
  if (onboardingOpen) return CRCLE_PROFILE_INSPECT.filter((a) => a.id === "onboarding-done");
  if (overlay === "work") return CRCLE_PROFILE_INSPECT.filter((a) => a.id === "sheet-close");
  if (overlay) return [];
  return CRCLE_PROFILE_INSPECT.filter((a) => a.id === "mood-toggle" || a.id === "bento-work");
}
