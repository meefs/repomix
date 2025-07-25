# GitHubリポジトリの処理

## 基本的な使用方法

パブリックリポジトリを処理
```bash
# 完全なURLを使用
repomix --remote https://github.com/user/repo

# GitHubのショートハンド形式を使用
repomix --remote user/repo
```

## ブランチとコミットの選択

```bash
# 特定のブランチ
repomix --remote user/repo --remote-branch main

# タグ
repomix --remote user/repo --remote-branch v1.0.0

# コミットハッシュ
repomix --remote user/repo --remote-branch 935b695
```

## 必要条件

- Gitがインストールされていること
- インターネット接続があること
- リポジトリへの読み取りアクセス権があること

## 出力の制御

```bash
# 出力先のカスタマイズ
repomix --remote user/repo -o custom-output.xml

# XML形式で出力
repomix --remote user/repo --style xml

# コメントを削除
repomix --remote user/repo --remove-comments
```

## Docker使用時

```bash
# カレントディレクトリに出力
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix \
  --remote user/repo

# 特定のディレクトリに出力
docker run -v ./output:/app -it --rm ghcr.io/yamadashy/repomix \
  --remote user/repo
```

## 一般的な問題

### アクセスの問題
- リポジトリがパブリックであることを確認
- Gitのインストールを確認
- インターネット接続を確認

### 大規模リポジトリの処理
- `--include`で特定のパスを選択
- `--remove-comments`を有効化
- ブランチごとに個別に処理
