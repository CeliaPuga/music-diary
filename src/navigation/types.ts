// The screens in the app and the parameters each one receives.
// "undefined" means the screen takes no parameters.
export type RootStackParamList = {
  Home: undefined;
  // songId is optional: without it the screen adds a new song,
  // with it the screen edits that song.
  AddSong: { songId?: string } | undefined;
  Diary: undefined;
  Settings: undefined;
};