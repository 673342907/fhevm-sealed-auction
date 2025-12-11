# 🚀 GitHub 推送指南

## 步骤 1: 添加远程仓库

将 `YOUR_GITHUB_URL` 替换为你的 GitHub 仓库 URL：

```bash
git remote add origin YOUR_GITHUB_URL
```

例如：
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
```

或者使用 SSH：
```bash
git remote add origin git@github.com:yourusername/your-repo-name.git
```

## 步骤 2: 重命名主分支（如果需要）

如果你的 GitHub 仓库使用 `main` 分支而不是 `master`：

```bash
git branch -M main
```

## 步骤 3: 推送到 GitHub

```bash
git push -u origin master
```

或者如果使用 `main` 分支：

```bash
git push -u origin main
```

## 完成！

推送成功后，你的代码就会出现在 GitHub 上了。

---

## 如果遇到问题

### 问题 1: 远程仓库已存在
如果提示 "remote origin already exists"，先删除再添加：
```bash
git remote remove origin
git remote add origin YOUR_GITHUB_URL
```

### 问题 2: 需要先拉取
如果 GitHub 仓库有初始文件（如 README），先拉取：
```bash
git pull origin master --allow-unrelated-histories
```
然后再推送。

### 问题 3: 认证问题
如果使用 HTTPS 需要输入用户名和密码，建议：
1. 使用 GitHub Personal Access Token 作为密码
2. 或者配置 SSH 密钥使用 SSH URL



