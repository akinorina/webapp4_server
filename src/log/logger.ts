import * as log4js from 'log4js';
import log4js_config from '../config/log4js-config';
log4js.configure(log4js_config);

export const console = log4js.getLogger();
export const system = log4js.getLogger('system');
