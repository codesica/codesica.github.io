---
title: 这个博客是怎么搭起来的
published: 2026-09-06
description: 从一个空的 codesica.github.io 仓库，到 Markdown 写作、Astro 构建、Retypeset 排版和 GitHub Pages 自动发布，这篇文章把整条链路讲清楚。
tags:
  - 博客
  - Astro
  - GitHub Pages
  - Agent
draft: false
pin: 1
toc: true
abbrlink: how-this-blog-works
---

这篇文章记录这个博客当前的完整搭建方式。

目标其实很简单：**我只负责写内容，剩下的构建、检查和发布尽量交给 GitHub 自动完成。**

最终形成的链路是：

```text
Markdown
   ↓
GitHub Repository
   ↓
GitHub Actions
   ↓
Astro Build
   ↓
Static HTML / CSS / JS
   ↓
GitHub Pages
   ↓
https://codesica.github.io/
```

## 1. 为什么仓库叫 codesica.github.io

GitHub Pages 有两种常见的网站。

普通仓库，例如 `blog`，可以发布成项目站点：

```text
https://codesica.github.io/blog/
```

而与账号同名的特殊仓库：

```text
codesica/codesica.github.io
```

对应的是账号自己的根站点：

```text
https://codesica.github.io/
```

所以这次没有继续使用以前的 `blog` 仓库，而是建立了一个独立的 `codesica.github.io` 仓库。它不是别人的 fork，也没有继承其他博客的 Git 历史。

## 2. 为什么选 Astro

博客本质上是一批内容文件经过构建以后生成静态网页。

我最终选择 Astro，主要不是为了使用复杂的前端能力，而是因为它刚好处在一个比较合适的位置：

- 内容可以直接使用 Markdown / MDX；
- 最终输出静态网页，很适合 GitHub Pages；
- 需要的时候仍然可以使用组件；
- 主题、RSS、Sitemap、代码高亮这些能力比较成熟；
- 不需要数据库，也不需要长期运行一台服务器。

因此运行时其实非常简单。

访问博客的人并不会连接一个 Astro 服务。GitHub Actions 已经提前把文章编译成了静态文件，GitHub Pages 只负责把这些文件提供出来。

## 3. 为什么使用 Retypeset

框架解决的是“怎么生成网站”，主题解决的是“网站长什么样”。

当前使用的是 Retypeset，一个基于 Astro 的开源博客主题。

我选择它主要因为它更接近我想要的方向：**以文字和阅读为中心，而不是把首页做成产品展示页。**

它提供了比较完整的排版基础，包括：

- 中文阅读排版；
- 响应式布局；
- 深色 / 浅色模式；
- 文章目录；
- 标签；
- RSS / Atom；
- Sitemap；
- 代码高亮；
- Markdown 扩展能力。

但这个仓库并不是 Retypeset 仓库的 fork。

初始化时只导入了一个锁定版本的主题源码，并保留 MIT License 和来源说明，然后在自己的仓库中继续维护。这样既使用成熟主题，也不会让整个个人博客变成另一个项目的 Git fork。

## 4. 我改了什么

主题只是基础，不应该把作者自己的博客配置直接搬过来。

所以初始化以后又做了一轮清理和定制：

- 站点名称改为 `Kai`；
- 地址固定为 `https://codesica.github.io/`；
- 默认中文；
- 只保留中文站点，不启用多语言切换；
- 调整为更克制的黑白灰配色；
- 保留深浅色切换；
- 关闭评论；
- 移除主题作者的统计配置；
- 移除主题作者的搜索引擎验证 ID；
- 移除外部截图服务；
- 移除点击音效；
- 删除作者的示例文章和个人介绍；
- 重新写 About、404 和 favicon。

也就是说，**复用了主题的设计系统和博客能力，但没有复用作者的身份、数据和服务配置。**

## 5. 文章现在怎么存

真正重要的部分在这里。

文章不再手写 HTML，而是普通 Markdown 文件：

```text
src/content/posts/
```

例如这篇文章本身就是：

```text
src/content/posts/how-this-blog-works.md
```

每篇文章开头只有一小段元数据：

```yaml
---
title: 文章标题
published: 2026-09-06
description: 一句话描述
tags:
  - 技术
draft: false
abbrlink: article-url
---
```

下面直接写 Markdown 正文。

这意味着以后无论内容来自我自己写、ChatGPT 整理、其他 Agent 生成，最终都只需要落成一个 Markdown 文件。

这也是后续自动化最关键的接口。

## 6. 一次发布到底发生了什么

当 Markdown 提交到 `main` 分支以后，GitHub Actions 会自动开始工作。

当前流程大致是：

```text
push main
   ↓
安装 pnpm / Node.js
   ↓
安装锁定依赖
   ↓
Astro 类型检查
   ↓
构建静态站点
   ↓
检查生成页面和内部链接
   ↓
检查是否残留主题作者的统计/评论配置
   ↓
启动本地静态服务器
   ↓
浏览器检查桌面和手机布局
   ↓
检查导航和深色模式
   ↓
上传 Pages artifact
   ↓
GitHub Pages 发布
   ↓
通过公网 HTTPS 再验证一次线上版本
```

所以“Action 绿色”还不是最后一步。

工作流会在部署后访问正式地址，并确认线上页面对应的就是当前提交。这能避免一种常见情况：构建成功了，但 Pages 实际仍然展示旧版本。

## 7. 为什么还做浏览器验证

静态构建成功，只能证明代码可以生成 HTML，并不能证明页面看起来正常。

因此部署流程里还增加了真实浏览器检查。

目前会验证：

- 首页有实际内容，不是白屏；
- 桌面宽度正常；
- 手机宽度正常；
- About 可以打开；
- 标签页可以打开；
- 深色模式可以切换；
- 页面没有明显的框架错误层。

同时保存截图和检查报告作为短期 Actions artifact。

这一步本质上是在把“我打开看了一眼”也变成自动化。

## 8. RSS、标签和 Sitemap 不需要手工维护

因为文章已经进入 Astro 的 Content Collection，所以很多东西可以从文章元数据自动推导。

例如：

```text
Markdown
 ├─→ 首页文章列表
 ├─→ 文章详情页
 ├─→ Tags
 ├─→ RSS
 ├─→ Atom
 ├─→ Sitemap
 └─→ OG metadata
```

以后增加一篇文章，不应该再同时修改五六个 HTML/XML 文件。

**内容应该是唯一事实源，其他东西都由构建过程派生。**

## 9. 整套系统真正的核心

表面上看，这是 Astro、Retypeset、GitHub Actions 和 GitHub Pages 的组合。

但这些都只是工具。

真正重要的是把整个博客拆成了三层：

```text
内容层
Markdown / 图片

生成层
Astro + Theme

发布层
GitHub + Actions + Pages
```

三层之间尽量解耦。

这样以后即使 Retypeset 不用了，Markdown 文章还在；Astro 换成 Hugo，内容仍然可以迁移；GitHub Pages 换成 Cloudflare Pages，也不需要重写文章。

**真正应该长期保存的是内容，而不是某个主题。**

## 10. 下一步

现在博客已经解决了“有地方写”和“提交后自动发布”。

下一步更值得做的，不是继续折腾页面，而是把内容生产接进来：

```text
ChatGPT / Codex / Gemini / Grok
            ↓
       对话与工作记录
            ↓
       提取有价值内容
            ↓
       整理为 Markdown
            ↓
          Review
            ↓
          GitHub
            ↓
           Blog
```

到了这里，博客就不只是一个网站。

它会变成一个**个人知识输出层**：平时产生的大量对话、实验、技术排查和思考，不再随着聊天窗口结束而消失，而是逐渐沉淀成可以搜索、引用、继续迭代的长期资产。
