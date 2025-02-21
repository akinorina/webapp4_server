# webapp4_client

## 1. 概要
webapp4 は仲田明紀個人事業で開発している、Webアプリのテンプレートです。
ベースとなる webapp4、バックエンド・サーバーの webapp4_server および、フロントエンド・クライアントの webapp4_client と一緒に動作させることでWebアプリを実現できます。

Webアプリのテンプレートですので、基本的な機能を基本的な事例として実装しています。このテンプレートを使って実際の開発用に新たなリポジトリを作成して、新たなWebアプリを開発します。場合によっては *_server *_client は複数個作成する場面も出てくるかもしれません。

## 2. Webアプリの実行（開発用）
webapp4 をローカルPCで実行する手順を手順を示します。

### 2-1. 前提条件
前提として、次の値を使用します。必要なら読み替えてください。

| 属性 | 値 |
|:----------|:----------|
| アプリ名称                          | webapp4 |
| アプリ・ポート番号                    | 3000 |
| CORS                              | true |
| Origin                            | https://www.example.com |
| アプリ・システム名称                  | webapp4 |
| アプリ・システムのメールアドレス        | info@webapp4.com |
| アプリ管理者 名称                     | Webapp4システム管理者 |
| アプリ管理者 メールアドレス             | info@webapp4.com |
| 認証における任意の秘密キー文字列        | secret of auth. |
| 認証サインイン有効期間                | 24h |
| Google OAuth クライアントID         | (付与された値) |
| Google OAuth クラアント秘密キー文字列 | (付与された値) |
| Google OAuth認証 コールバックURL     | https://www.example.com/api/auth/signin-google-redirect |
| データベース ホスト名               | db (docker compose 実行時) または localhost (開発時の単独実行時) |
| データベース ポート番号             | 3306 |
| データベース アカウント名           | webapp4 |
| データベース アカウントパスワード     | webapp4 |
| データベース 名称                  | webapp4 |
| SMTPサーバー ホスト名             | smtp |
| SMTPサーバー ポート番号           | 1025 |
| SMTP認証の利用                   | false |
| SMTP認証 ユーザー名               | - |
| SMTP認証 パスワード               | - |
| S3/MINIO リージョン名称       | ap-northeast-1 |
| S3/MINIO エンドポイント       | http://www.example.com:9000 |
| S3/MINIO path-styleを利用    | true |
| S3/MINIO アクセスキーID       | (付与された値) |
| S3/MINIO アクセス秘密鍵       | (付与された値) |
| Bucket名                    | webapp4 |
| コンテンツURLのパスPrefix     | /s3 (webapp4_client の nginx 設定に合わせる) |
| MINIO ROOTユーザー名          | root |
| MINIO ROOTユーザーパスワード    | password |

### 2-2. 準備

#### 2-2-1. ローカルPCの hosts を編集
ローカルホスト（PC）上で実行する場合、実行時のホスト名をローカルホスト(127.0.0.1)に設定します。
www.example.com ドメインを使用する場合、hosts ファイルに次のように記述します。
```
127.0.0.1    www.example.com
```

#### 2-2-2. コードの配置
webapp4_server はベースとなる webapp4 とクライアントの webapp4_client と一緒に動作させます。

そのため、同じディレクトリの子ディレクトリとしてこれらのリポジトリを配置します。(下記参照)
<pre>
PROJECT_DIR/
  +-- webapp4/
  +-- webapp4_server/
  +-- webapp4_client/
</pre>

### 2-3. webapp4 実行手順
以上で配置したリポジトリ、コードのうち、 webapp4/ における準備手順を示します。

#### 2-3-1. 環境変数ファイルを配置
環境設定ファイル .env ファイルを作成します。

webapp4 には .env.development というテンプレートファイルがあります。
これを参考に、実行環境に合わせた内容を必要な箇所に記述した .env ファイルを作成します。

webapp4 の .env の例
```
# .env for docker compose environment.

# DATABASE (MySQL)
DATABASE_TYPE = 'mysql'
DATABASE_HOST = 'db'
DATABASE_PORT = 3306
DATABASE_USER = 'webapp4'
DATABASE_PASSWORD = 'webapp4'
DATABASE_DBNAME = 'webapp4'
DATABASE_ROOT_PASSWORD = 'root'

# SMTP
SMTP_HOST = 'smtp'
SMTP_PORT = 1025
SMTP_SECURE = false
SMTP_USER =
SMTP_PASSWORD =

# MINIO
MINIO_ROOT_USER = 'root'
MINIO_ROOT_PASSWORD = 'password'
```

#### 2-3-2. docker compose によって webapp4 を実行
次のコマンドを webapp4/ で実行し、 mysql および phpMyAdmin、mailpit、minio を実行する。
```
docker compose up -d
```
この実行の場合、 docker-compose.yml ファイルによる定義で Docker Compose が実行されます。
この場合、webapp4_server および webapp4_client は実行されません。

#### 2-3-3. phpMyAdmin にアクセス、DB作成
次のURLでローカルホストの phpMyAdmin をWebブラウザで開きます。
```
http://localhost:8080/
```
.env に記述したデータベースができていることを確認します（テーブルはありません）。

#### 2-3-4. MiniO にアクセス、各種設定
次のURLでローカルホストの MiniO をWebブラウザで開きます。
```
http://localhost:9001/
```
ローカルホストで Docker Compose 実行されている Minio のコンソールへログインする。
このとき、webapp4/.env に記述した xxx および xxx がそれぞれIDとパスワードになる。

##### (1). bucket 作成
webapp4 で利用するBucketを Minio に作成する。
作成したBucketの Access Policy を必要なら Public に設定しておく。

##### (2). 認証設定
Minio のユーザーを作成し、そのユーザーの Access Keys を作成する。
作成した Access Keys を .env に設定する。

##### (3). Region設定
Minio Configuration の Region 設定を行う。
基本的に Server Location 値は 'ap-northeast-1' で良い。

### 2-4. webapp4_server 実行手順
以上で配置したリポジトリ、コードのうち、 webapp4_server/ における準備手順を示します。

#### 2-4-1. 環境変数ファイルを配置
環境設定ファイル .env ファイルを作成します。

webapp4_server には .env.development というテンプレートファイルがあります。
これを参考に、実行環境に合わせた内容を必要な箇所に記述した .env ファイルを作成します。

webapp4 の .env の例
```
# .env for localhost:3000 environment.

# Application
APP_NAME = 'webapp4'
APP_PORT = 3000
APP_CORS = true
APP_ORIGIN = 'https://www.example.com'
# Application - System
APP_SYSTEM_NAME = 'webapp4'
APP_SYSTEM_EMAIL = 'info@webapp4.com'
# Application - Administrator
APP_ADMIN_NAME = 'Webapp4システム管理者'
APP_ADMIN_EMAIL = 'info@webapp4.com'

# Auth
AUTH_SECRET = 'secret of auth.'
AUTH_EXPIRESIN = '24h'
# Google
GOOGLE_CLIENT_ID = '((付与された値))'
GOOGLE_CLIENT_SECRET = '((付与された値))'
GOOGLE_REDIRECT_URL = 'https://www.example.com/api/auth/signin-google-redirect'

# DB
DATABASE_HOST = 'localhost'
DATABASE_PORT = 3306
DATABASE_USER = 'webapp4'
DATABASE_PASSWORD = 'webapp4'
DATABASE_DBNAME = 'webapp4'

# SMTP
SMTP_HOST = smtp
SMTP_PORT = 1025
SMTP_SECURE = false
SMTP_USER = 
SMTP_PASSWORD = 

# STORAGE(S3|MiniO)
STORAGE_REGION = 'ap-northeast-1'
STORAGE_ENDPOINT = 'http://www.example.com:9000'
STORAGE_FORCEPATHSTYLE = true
STORAGE_ACCESS_KEY_ID = '((付与された値))'
STORAGE_SECRET_ACCESS_KEY = '((付与された値))'
STORAGE_BUCKET_NAME = 'webapp4'
STORAGE_PATH_PREFIX = '/s3'
```

#### 2-4-2. Google-OAuth2.0 キーを .env に記述
Google Cloud コンソールの認証情報から Google-OAuth2.0 の クライアントID および クライアントシークレット を .env に記述します。

#### 2-4-3. Minio アクセスキーを .env に記述
「2-3-4. MiniO にアクセス、各種設定」で設定したアクセスキー、シークレットアクセスキーを .env に設定します。

#### 2-4-4. npmモジュールのインストール
```
npm install
```

#### 2-4-5. Typeorm の Migration によるDB構築
次のコマンドによって、DB の Migration を実行する。
```
npx typeorm-ts-node-commonjs migration:run -d src/database/database.providers.ts
```

#### 2-4-6. 実行
次のコマンドによって、バックエンド・サーバーを実行する。
```
npm run start:dev
```

次のURLをWebブラウザで実行する。
```
http://localhost:3000/api
```
すると、次のような表示がされれば、webapp4_server が正常に動作していることがわかる。
```
Application "webapp4" is running.
```

終了するときは ```ctrl-c```で止まります。




### 2-5. webapp4_client 実行手順
以上で配置したリポジトリ、コードのうち、 webapp4_client/ における準備手順を示します。

#### 2-5-1. 環境変数ファイルを配置
環境設定ファイル .env.local ファイルを作成します。

webapp4_client には .env.development というテンプレートファイルがあります。
これを参考に、実行環境に合わせた内容を必要な箇所に記述した .env.local ファイルを作成します。

webapp4 の .env.local の例
```
# App
VITE_API_BASE_URL = ''

# STORAGE
VITE_STORAGE_PATH_PREFIX = '/s3'
```

#### 2-5-2. npmモジュールのインストール
```
npm install
```

#### 2-5-3. 自己署名証明書(オレオレ証明書)の作成
Webアプリは https 通信を行うことを前提に開発している。
ゆえに、SSL/TLS自己署名証明書を作成する必要がある。

WebクライアントのWebサーバーの設定で、次のディレクトリに証明書を作成するように定義している：
```
PROJECT_DIR/webapp4_client/nginx/ssl
```
(設定ファイル: 開発時vite: vite.config.ts / Nginx実行時: nginx/nginx.conf )

##### (0). 秘密鍵、公開鍵を配置するディレクトリへ移動
```
cd PROJECT_DIR/webapp4_client/nginx/ssl
```

##### (1). 秘密鍵(KEY)を作成する
```
openssl genrsa 2048 > server.key
```

##### (2). 証明書署名要求(CSR)を作成する
```
openssl req -new -key server.key > server.csr
```

##### (3). 証明書署名要求(CSR)を自分の秘密鍵で署名する
```
cat server.csr | openssl x509 -req -signkey server.key > server.crt
```

#### 2-5-4. 実行
次のコマンドによって、フロントエンド・アプリを実行する。
```
sudo npm run dev
```
ローカルホスト（PC）のrootパスワードを求められるので入力する。

DB初期データで登録済みの管理ユーザーアカウントは次を使ってサイン-インできます。
```
ID: admin@example.com
PW: P@ssw0rd
```

終了するときは ```ctrl-c```で止まります。


## 3. Webアプリの実行（Docker Compose実行用）
上述「2. Webアプリの実行（開発用）」を一度でも行なったなら、必要な作業が完了しています。
その場合、 Docker Compose による実行も行えます。

### 3-1. 実行手順
webapp4/ を working dir にして、docker compose によってビルド、実行します。

```
cd webapp4
docker compose -f docker-compose.yml -f docker-compose-cs.yml build
docker compose -f docker-compose.yml -f docker-compose-cs.yml up -d
```

動作したら、次のURLへWebブラウザでアクセスしてみましょう：
```
https://www.example.com
```

バックグラウンドで動作しています。
停止させる時は次のコマンドを実行します。
```
docker compose -f docker-compose.yml -f docker-compose-cs.yml down
```

# Appendix

## Appendix 1. Webアプリのページ構成
webapp4 はWebアプリのテンプレートですが、基本的な部分が動作するように、既にいくつかのページが実装されています。

| ページ名称        | URL(path)                          |
|:----------------|:-----------------------------------|
| top             | /                                  |
| Blog一覧         | /blog                              |
| Blog詳細         | /blog/:id                          |
| サイン-イン       | /signin                            |
| サイン-イン       | /signin-google-redirect            |
| サイン-アウト     | /signout                           |
| サイン-アップ     | /signup                            |
| サイン-アップ     | /signup-sent-email          |
| サイン-アップ     | /signup-input       |
| サイン-アップ     | /signup-completion          |
| パスワードリセット | /reset-password                    |
| パスワードリセット | /reset-password-sent-email         |
| パスワードリセット | /reset-password-input              |
| パスワードリセット | /reset-password-completion         |
| 管理画面 - top            | /admin                             |
| 管理画面 - パスワード変更   | /admin/change-password             |
| 管理画面 - ユーザー管理     | /admin/users                       |
| 管理画面 - ユーザー管理     | /admin/users/new                   |
| 管理画面 - ユーザー管理     | /admin/users/:id/edit              |
| 管理画面 - 画像管理                     | /admin/images                      |
| 管理画面 - 画像管理 - 編集              | /admin/images/:id/edit             |
| 管理画面 - 画像管理 - 新樹作成            | /admin/images/new                  |
| 管理画面 - ブログ管理                     | /admin/blogs                       |
| 管理画面 - ブログ管理 - 編集              | /admin/blogs/:id/edit              |
| 管理画面 - ブログ管理 - 新樹作成          | /admin/blogs/new                   |
| サンプル - top                          | /samples                           |
| サンプル - ボタン                         | /samples/buttons                   |
| サンプル - モーダル                       | /samples/generalmodal              |
| サンプル - CKEditor - classic           | /samples/ckeditor/classic |
| サンプル - CKEditor - inline            | /samples/ckeditor/inline  |
| サンプル - CKEditor - ballon            | /samples/ckeditor/balloon |
| サンプル - media                        | /samples/media                     |
| サンプル - media - 通常                 | /samples/media-normal              |
| サンプル - media - 代替テキスト           | /samples/media-alttext             |
| サンプル - media - バーチャル背景（ぼかし） | /samples/media-blur |
| サンプル - media - バーチャル背景（画像）   | /samples/media-vbg        |
| サンプル - audio                        | /samples/audio                     |
| サンプル - draggable                    | /samples/draggable                 |

## Appendix 2. WebアプリのAPI構成
| API名称                | method | URL(path)                          |
|:-----------------------|:--------|:-----------------------------------|
| アプリ名称              | GET | /api        |
| サイン-イン             | POST | /api/auth/signin  |
| サイン-イン with Google | GET  | /api/auth/signin-google  |
| サイン-イン with Google | GET  | /api/auth/signin-google-redirect  |
| サイン-アウト           | POST | /api/auth/signout  |
| プロフィール情報取得     | GET  | /api/auth/profile  |
| ユーザー管理 - 新樹作成   | POST | /api/users  |
| ユーザー管理 - 一覧取得   | GET  | /api/users  |
| ユーザー管理 - 取得       | GET | /api/users/:id |
| ユーザー管理 - 更新       | PUT | /api/users/:id |
| ユーザー管理 - 削除       | DELETE | /api/users/:id |
| ユーザー管理 - パスワード変更 | PUT | /api/users/change-password |
| ユーザー管理 - verify-email - 確認メール送信 | POST | /api/users/send-verifying-email  |
| ユーザー管理 - verify-email - メールアドレス検証 | POST | /api/users/check-verifying-email  |
| ユーザー管理 - ユーザー情報登録 | POST | /api/users/register-user  |
| ユーザー管理 - パスワードリセット | POST | /api/users/reset-password  |
| ユーザー管理 for TEST | POST | /api/users/send_test_mail  |
| ログ出力サンプル - 例                 | GET | /api/sample_logs  |
| ログ出力サンプル - 例 - fatal         | GET | /api/sample_logs/fatal  |
| ログ出力サンプル - 例 - error         | GET | /api/sample_logs/error  |
| ログ出力サンプル - 例 - warn          | GET | /api/sample_logs/warn  |
| ログ出力サンプル - 例 - info          | GET | /api/sample_logs/info  |
| ログ出力サンプル - 例 - debug         | GET | /api/sample_logs/debug  |
| ログ出力サンプル - 例 - trace         | GET | /api/sample_logs/trace  |
| ログ出力サンプル - 例 - err（お試し用） | GET | /api/sample_logs/err  |
| 画像管理 - 一覧取得 (PUBLIC)          | GET | /api/images/public      |
| 画像管理 - 取得 (PUBLIC)              | GET | /api/images/public/:id  |
| 画像管理 - 新樹作成                   | POST | /api/images        |
| 画像管理 - 新樹作成 upload用          | POST | /api/images/upload  |
| 画像管理 - 一覧取得                   | GET | /api/images         |
| 画像管理 - 取得                       | GET | /api/images/:id     |
| 画像管理 - 更新                       | PUT | /api/images/:id  |
| 画像管理 - 削除                       | DELETE | /api/images/:id  |
| ブログ - 新樹作成                     | POST | /api/blogs  |
| ブログ - 一覧取得                     | GET | /api/blogs  |
| ブログ - 取得                         | GET | /api/blogs/:id  |
| ブログ - 更新                         | PUT | /api/blogs/:id  |
| ブログ - 削除                         | DELETE | /api/blogs/:id  |




