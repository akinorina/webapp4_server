# webapp4_server

## 概要
webapp4 は仲田明紀個人事業で開発している、Webアプリ バックエンドサーバーのテンプレートです。

ベースとなる webapp4 および、クライアントの webapp4_client と一緒に動作させることでWebアプリを実現できます。

Webアプリのテンプレートですので、基本的な機能を基本的な事例として実装しています。このテンプレートを使って実際の開発用に新たなリポジトリを作成して、新たなWebアプリを開発します。場合によっては *_server *_client は複数個作成する場面も出てくるかもしれません。

## Webアプリの実行
webapp4 をこのまま実行する手順を示します。

### Webアプリ実行準備
ローカルPCで実行する手順を以下に示します。

前提として、次の値を使用します。必要なら読み替えてください。

| ページ名称 | URL(path) |
|:-----------|:---------------------------|
| サイトURL   | https://www.example.com/   |
| column     | column                     |
| column     | column                     |
| column     | column                     |


#### 1-a. コードの配置
webapp4_server はベースとなる webapp4 とクライアントの webapp4_client と一緒に動作させます。

そのため、同じディレクトリの子ディレクトリとしてこれらのリポジトリを配置します。(下記参照)
<pre>
PROJECT_DIR/
  +-- webapp4/
  +-- webapp4_server/
  +-- webapp4_client/
</pre>

#### 1-b. ローカルPCの /etc/hosts を編集


#### 1-c. 開発環境設定ファイルを配置
環境設定ファイル .env ファイルを作成します。

webapp4, webapp4_server, webapp4_client にはそれぞれ .env.development または .env.develop というテンプレートファイルがあります。

これを参考に、実行環境に合わせた内容を必要な箇所に記述した .env ファイルをそれぞれに作成します。

### 2. Webアプリの実行手順 （dockerによるWebアプリ実行）
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

### 3. Webアプリの実行手順 （開発時）
まず、webapp4 だけを実行します。
```
cd webapp4
docker compose up -d
cd ../
```
次に、バックエンドサーバーを実行します。
```
cd webapp4_server
npm run start:dev
cd ..
```

次に、フロントエンド用のWebサーバーを実行します。
```
cd webapp4_client
sudo npm run dev
(実行後、パスワードを訊かれたら入力する)
cd ..
```

この手順でサーバーとクライアントを実行すると、いずれもホットリロードによって、コードの変更後は基本的にすぐに反映されて動作します。

## Webアプリのページ構成
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
| サイン-アップ     | /signup/signup-sent-email          |
| サイン-アップ     | /signup/signup-register-info       |
| サイン-アップ     | /signup/signup-completion          |
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

## WebアプリのAPI構成
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
| ユーザー管理 - xxxxxxxxxxxx | POST | /api/users/verifing-email  |
| ユーザー管理 - xxxxxxxxxxxx | POST | /api/users/check_verifying_email  |
| ユーザー管理 - xxxxxxxxxxxx | POST | /api/users/register-user  |
| ユーザー管理 - xxxxxxxxxxxx | POST | /api/users/reset-password  |
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




