type UserParams = {
  uid: string | undefined;
  username: string | undefined;
  phone: string;
  phone_number: string;
  phone_status: string;
  country_code: string;
  pushToken: string | undefined;
  OneSignalID: string | undefined;
};

type StoryParams = {
  userUID: string;
};

type UserProfileProps = {
  uid: string | undefined;
  cameFrom: string;
};

type routeNamesType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'setup'
  | 'home'
  | 'settings'
  | 'bugreport'
  | 'activeStatus'
  | 'changeUsername'
  | 'addBio'
  | 'editProfile'
  | 'devices'
  | 'discover'
  | 'story'
  | 'addStory'
  | 'chat'
  | 'chatSettings'
  | 'passcodeSetup'
  | 'passcodeVerify'
  | 'userProfile'
  | 'darkMode'
  | 'privacySecurity';

type RootStackParamList = {
  [key in routeNamesType]: object | undefined;
} & {
  splash: {} | undefined;
  onboarding: {} | undefined;
  login: {} | undefined;
  setup: {user: UserParams} | undefined;
  home: {} | undefined;
  settings: {} | undefined;
  bugreport: {} | undefined;
  activeStatus: {} | undefined;
  changeUsername: {} | undefined;
  addBio: {} | undefined;
  editProfile: {} | undefined;
  devices: {} | undefined;
  discover: {} | undefined;
  story: {story: StoryParams} | undefined;
  addStory: {} | undefined;
  chat: {item: any} | undefined;
  chatSettings: {} | undefined;
  passcodeSetup: {} | undefined;
  passcodeVerify: {} | undefined;
  userProfile: {userProfile: UserProfileProps} | undefined;
  darkMode: {} | undefined;
  privacySecurity: {} | undefined;
};

export type {routeNamesType, RootStackParamList};
