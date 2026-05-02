import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeMode = 'Light' | 'Dark' | 'Auto';
export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Chinese';

interface Preferences {
  theme: ThemeMode;
  language: Language;
}

interface PreferencesContextType {
  preferences: Preferences;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  English: {
    settings: 'Settings',
    userSettings: 'User Settings',
    notificationSettings: 'Notification Settings',
    systemPreferences: 'System Preferences',
    theme: 'Theme',
    language: 'Language',
    saveChanges: 'Save Changes',
    alertsAndRisks: 'Alerts & Risks',
    monitorAlerts: 'Monitor and manage supply chain alerts',
    activeAlerts: 'Active Alerts',
    highPriority: 'High Priority',
    resolvedToday: 'Resolved Today',
    activeAlertsHeading: 'Active Alerts',
    resolvedAlertsHeading: 'Resolved Alerts',
    routeOptimization: 'Route Optimization',
  },
  Spanish: {
    settings: 'Configuración',
    userSettings: 'Configuración de usuario',
    notificationSettings: 'Configuración de notificaciones',
    systemPreferences: 'Preferencias del sistema',
    theme: 'Tema',
    language: 'Idioma',
    saveChanges: 'Guardar cambios',
    alertsAndRisks: 'Alertas y Riesgos',
    monitorAlerts: 'Monitorear y gestionar alertas de la cadena',
    activeAlerts: 'Alertas activas',
    highPriority: 'Alta prioridad',
    resolvedToday: 'Resuelto hoy',
    activeAlertsHeading: 'Alertas activas',
    resolvedAlertsHeading: 'Alertas resueltas',
    routeOptimization: 'Optimización de rutas',
  },
  French: {
    settings: 'Paramètres',
    userSettings: 'Paramètres utilisateur',
    notificationSettings: 'Paramètres de notification',
    systemPreferences: 'Préférences système',
    theme: 'Thème',
    language: 'Langue',
    saveChanges: 'Enregistrer',
    alertsAndRisks: 'Alertes et Risques',
    monitorAlerts: 'Surveillez et gérez les alertes',
    activeAlerts: 'Alertes actives',
    highPriority: 'Haute priorité',
    resolvedToday: 'Résolu aujourd’hui',
    activeAlertsHeading: 'Alertes actives',
    resolvedAlertsHeading: 'Alertes résolues',
    routeOptimization: 'Optimisation des itinéraires',
  },
  German: {
    settings: 'Einstellungen',
    userSettings: 'Benutzereinstellungen',
    notificationSettings: 'Benachrichtigungseinstellungen',
    systemPreferences: 'Systemeinstellungen',
    theme: 'Thema',
    language: 'Sprache',
    saveChanges: 'Änderungen speichern',
    alertsAndRisks: 'Warnungen und Risiken',
    monitorAlerts: 'Überwachen und verwalten Sie Alarme',
    activeAlerts: 'Aktive Warnungen',
    highPriority: 'Hohe Priorität',
    resolvedToday: 'Heute gelöst',
    activeAlertsHeading: 'Aktive Warnungen',
    resolvedAlertsHeading: 'Gelöste Warnungen',
    routeOptimization: 'Streckenoptimierung',
  },
  Chinese: {
    settings: '设置',
    userSettings: '用户设置',
    notificationSettings: '通知设置',
    systemPreferences: '系统偏好',
    theme: '主题',
    language: '语言',
    saveChanges: '保存更改',
    alertsAndRisks: '警报与风险',
    monitorAlerts: '监控并管理供应链警报',
    activeAlerts: '活动警报',
    highPriority: '高优先级',
    resolvedToday: '今天已解决',
    activeAlertsHeading: '活动警报',
    resolvedAlertsHeading: '已解决警报',
    routeOptimization: '路线优化',
  },
};

const storageKey = 'pulsechain_preferences';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'Light',
    language: 'English',
  });

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const saved = JSON.parse(stored) as Preferences;
        setPreferences(saved);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'Dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'Light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences]);

  const setTheme = (theme: ThemeMode) => {
    setPreferences((current) => ({ ...current, theme }));
  };

  const setLanguage = (language: Language) => {
    setPreferences((current) => ({ ...current, language }));
  };

  const t = (key: string) => {
    return translations[preferences.language][key] || translations.English[key] || key;
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setTheme, setLanguage, t }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
