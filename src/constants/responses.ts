import { SET_FEEDLY_STREAM_NAME, SET_FEEDLY_TOKEN, SET_TODOIST_PROJECT_ID, SET_TODOIST_TOKEN } from './commands';

export const SET_FEEDLY_TOKEN_RESPONSE = 'Установите API токен для Feedly';
export const SET_FEEDLY_STREAM_NAME_RESPONSE = 'Установите stream для Feedly';
export const SET_TODOIST_TOKEN_RESPONSE = 'Установите API токен для Todoist';
export const SET_TODOIST_PROJECT_ID_RESPONSE = 'Установите ID проекта для Todoist';

export const SET_FEEDLY_TOKEN_BY_COMMAND_RESPONSE = `Установите API токен для Feedly командой /${SET_FEEDLY_TOKEN.command}`;
export const SET_FEEDLY_STREAM_NAME_BY_COMMAND_RESPONSE = `Установите stream для Feedly командой /${SET_FEEDLY_STREAM_NAME.command}`;
export const SET_TODOIST_TOKEN_BY_COMMAND_RESPONSE = `Установите API токен для Todoist командой /${SET_TODOIST_TOKEN.command}`;
export const SET_TODOIST_PROJECT_ID_BY_COMMAND_RESPONSE = `Установите ID проекта для Todoist командой /${SET_TODOIST_PROJECT_ID.command}`;
export const YOU_CAN_START_RESPONSE = `Теперь вы можете отправлять ссылки в бот и они автоматически по понедельникам будут отправляться вам в Todoist, как и ссылки из Feedly (Read Later)`;

export const INCORRECT_FEEDLY_CREDENTIALS = 'Указаны некорректные данные для Feedly';
export const INCORRECT_TODOIST_CREDENTIALS = 'Указаны некорректные данные для Todoist';
export const UNKNOWN_ERROR = 'Произошла неизвестная ошибка';
