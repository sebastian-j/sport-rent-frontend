export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (!error || typeof error !== 'object') return fallback;

  if ('message' in error && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  if ('detail' in error) {
    if (typeof error.detail === 'string' && error.detail.trim()) return error.detail;

    if (Array.isArray(error.detail)) {
      const detailMessage = error.detail.find((detail): detail is { msg: string } =>
        Boolean(
          detail &&
          typeof detail === 'object' &&
          'msg' in detail &&
          typeof detail.msg === 'string' &&
          detail.msg.trim()
        )
      )?.msg;

      if (detailMessage) return detailMessage;
    }
  }

  return fallback;
};
