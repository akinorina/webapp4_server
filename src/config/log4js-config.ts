import * as path from 'path';

// ログ出力先は、サーバー内の絶対パスを動的に取得して出力先を設定したい
const APP_ROOT = path.join(__dirname, '../../');
console.log('APP_ROOT', APP_ROOT);

// ログ出力設定
// log4jsはルートロガーで使用するので、エクスポートに変更
export default {
  appenders: {
    consoleLog: {
      type: 'console',
    },
    // ADD
    systemLog: {
      type: 'file',
      filename: path.join(APP_ROOT, './logs/system/system.log'),
      maxLogSize: 5000000, // 5MB
      backups: 5, // 世代管理は5ファイルまで、古いやつgzで圧縮されていく
      compress: true,
    },
  },
  categories: {
    default: {
      // appendersで設定した名称を指定する
      // levelは出力対象とするものを設定ここではALL（すべて）
      appenders: ['consoleLog'],
      level: 'ALL',
    },
    // ADD
    system: {
      appenders: ['systemLog'],
      level: 'ERROR',
    },
  },
};
