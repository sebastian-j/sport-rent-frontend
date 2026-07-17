export const componentStyles = {
  contentPanel: {
    base: 'flex flex-1 flex-col items-center rounded-xl border-[1px] p-8',
    tone: {
      default: 'border-app-border bg-app-surfaceSoft',
      danger: 'border-app-danger bg-app-dangerSoft',
    },
  },

  button: {
    base: 'rounded-lg min-w-24 min-h-8',
    tone: {
      default: 'bg-app-surfaceStrongNeutral text-app-textInverted',
      inversed: 'bg-app-surfaceNeutral text-app-text',
    },
  },
} as const;

export type ContentPanelTone = keyof typeof componentStyles.contentPanel.tone;
export type ButtonTone = keyof typeof componentStyles.button.tone;
