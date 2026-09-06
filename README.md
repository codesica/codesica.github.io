# Kai 的博客

**访问：https://codesica.github.io/**

Astro + Retypeset + GitHub Pages。独立公开仓库，不是 fork。

## 写文章

1. 复制 `templates/post.md` 到 `src/content/posts/你的英文文件名.md`。
2. 修改标题、日期、描述、正文及 `abbrlink`（英文短链接，不能与其他文章重复）。
3. 准备发布时将 `draft: true` 改成 `draft: false`，提交到 `main`。
4. 在 Actions 中确认部署成功。文章列表、文章页、标签、RSS 和站点地图自动生成。

**注意：公开仓库中的源文件和历史都可以被查看。`draft: true` 只是不在网站发布，不是隐私保护；不要提交私人聊天、客户资料、密码或令牌。**

## 常改的文件

| 文件 | 用途 |
| --- | --- |
| `src/content/posts/` | Markdown / MDX 文章 |
| `src/content/about/about.md` | 关于页 |
| `src/config.ts` | 站名、简介、配色、语言、页脚 |
| `templates/post.md` | 新文章模板，不会发布到网站 |
| `THEME.md` | 主题来源、版本、定制范围 |
| `.github/workflows/deploy.yml` | 自动构建、检查和发布 |

## 本地预览

使用 Node.js 24 和 pnpm 10.33.0：

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

构建检查：`pnpm build`。

## 发布

Pages 发布目标为 `https://codesica.github.io/`，不是旧项目的 `/blog/` 路径。新仓库与旧 `codesica/blog` 没有文件、分支或 Git 历史关系。

首次初始化由 `initialize.yml` 导入锁定版本的主题；以后不再覆盖已有站点。日常提交通过 `deploy.yml` 构建并发布。GitHub Pages 的 Source 应为 GitHub Actions。

## 开源主题

使用 [Retypeset](https://github.com/radishzzz/astro-theme-retypeset)，原作者 radishzz，主题代码为 MIT 许可证。原始许可保存在 `LICENSE`，导入版本和修改范围见 `THEME.md`。本站原创文章与主题代码是不同内容，不应将主题许可自动理解为文章授权。
