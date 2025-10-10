type Section = 'login';
export type LoginKey =
  | 'title'
  | 'username'
  | 'password'
  | 'button'
  | 'buttonLoading'
  | 'error'
  | 'errorInvalid';

export type SupportedLang = 'en' | 'es';

type ResourceType = {
  [lang in SupportedLang]: {
    login: Record<LoginKey, string>;
  };
};

export const resources: ResourceType = {
  en: {
    login: {
      title: 'Login',
      username: 'Username',
      password: 'Password',
      button: 'Login',
      buttonLoading: 'Logging in...',
      error: 'Login failed',
      errorInvalid: 'Invalid credentials',
    },
  },
  es: {
    login: {
      title: 'Iniciar sesión',
      username: 'Usuario',
      password: 'Contraseña',
      button: 'Ingresar',
      buttonLoading: 'Ingresando...',
      error: 'Error al iniciar sesión',
      errorInvalid: 'Credenciales inválidas',
    },
  },
};

export function t(lang: SupportedLang, section: Section, key: LoginKey): string {
  return resources[lang][section][key] ?? key;
}
