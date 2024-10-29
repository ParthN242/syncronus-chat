export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = `/api/auth`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTE}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const UPDATE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/update-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;

export const CONTACT_ROUTE = `/api/contact`;
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_CONTACT_LIST_ROUTE = `${CONTACT_ROUTE}/get-contact-list`;
export const GET_ALL_CONTACT_ROUTE = `${CONTACT_ROUTE}/get-all-contact`;

export const MESSAGE_ROUTE = `/api/message`;
export const SEND_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/send-message`;
export const GET_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/get-message`;
export const SEND_FILE_ROUTE = `${MESSAGE_ROUTE}/upload-file`;

export const CHANNEL_ROUTE = `/api/channel`;
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`;
export const GET_CHANNEL_LIST_ROUTE = `${CHANNEL_ROUTE}/get-channel-list`;
export const SEND_CHANNEL_FILE_ROUTE = `${CHANNEL_ROUTE}/upload-file`;
