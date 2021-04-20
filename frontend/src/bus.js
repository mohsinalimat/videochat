import Vue from 'vue';
export default new Vue();
export const LOGGED_OUT = "loggedOut";
export const LOGGED_IN = "loggedIn";
export const CHAT_ADD = "chatAdd";
export const CHAT_EDITED = "chatEdited";
export const CHAT_DELETED = "chatDeleted";
export const OPEN_CHAT_EDIT = "openChatEdit";
export const OPEN_SIMPLE_MODAL = "openSimpleModal";
export const CLOSE_SIMPLE_MODAL = "closeSimpleModal";
export const MESSAGE_ADD = "messageAdd";
export const MESSAGE_DELETED = "messageDeleted";
export const MESSAGE_EDITED = "messageEdited";
export const SET_EDIT_MESSAGE = "setEditMessageDto";
export const UNREAD_MESSAGES_CHANGED = "unreadMessagesChanged";
export const USER_TYPING = "userTyping";
export const MESSAGE_BROADCAST = "messageBroadcast";
export const OPEN_CHOOSE_AVATAR = "openChooseAvatar";
export const USER_PROFILE_CHANGED = "userProfileChanged";
export const CHANGE_WEBSOCKET_STATUS = "changeWebsocket";
export const OPEN_INFO_DIALOG = "openInfo";
export const VIDEO_CALL_CHANGED = "videoCallChanged";
export const VIDEO_CALL_INVITED = "videoCallInvited";
export const OPEN_PERMISSIONS_WARNING_MODAL = "openPermissionsWarningModal";
export const SHARE_SCREEN_START = "shareScreenStart";
export const SHARE_SCREEN_STOP = "shareScreenStop";
export const VIDEO_CALL_KICKED = "videoCallKicked";
export const VIDEO_START_MUTING = "videoStartMuting";
export const AUDIO_START_MUTING = "audioStartMuting";
export const REFRESH_ON_WEBSOCKET_RESTORED = "refreshOnWsRestored";
export const REQUEST_CHANGE_VIDEO_RESOLUTION = "requestChangeVideoResolution";
export const VIDEO_RESOLUTION_CHANGED = "videoResolutionChanged";