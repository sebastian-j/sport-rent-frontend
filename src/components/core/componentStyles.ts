export const componentStyles = {
  contentPanel: {
    base: 'flex flex-1 flex-col items-center rounded-xl border-[1px] p-8',
    tone: {
      default: 'border-app-border bg-app-surfaceSoft',
      danger: 'border-app-danger bg-app-dangerSoft',
    },
  },

  button: {
    base: 'rounded-lg min-w-4 min-h-4',
    tone: {
      default: 'bg-app-surfaceStrong text-app-textInverted',
      inversed: 'bg-app-surface text-app-text',
    },
  },
} as const;

export type ContentPanelTone = keyof typeof componentStyles.contentPanel.tone;
export type ButtonTone = keyof typeof componentStyles.button.tone;
