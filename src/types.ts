import { PressableStateCallbackType } from 'react-native';

export type CrossPlatformPressableStateCallbackType = PressableStateCallbackType & {
  hovered?: boolean;
};

export interface UserAuthData {
  session: UserSession | null
  loading: boolean
  canLogin: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export interface UserSession {
  id: string;
  googleId: string;
  nickname: string | null;
  email?: string;
  lastActivity: number;
}
