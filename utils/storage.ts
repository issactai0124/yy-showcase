
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
      const parsed = JSON.parse(saved);
      // 特殊處理：還原日期物件
      return JSON.parse(saved, (key, value) => {
        if (key === 'date' && typeof value === 'string') return new Date(value);
        return value;
      });
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
