# 微软 OAuth2 API 无服务器版本

> **本项目 Fork 自 [HChaoHui/msOauth2api](https://github.com/HChaoHui/msOauth2api)**
> **在原项目基础上增加了删除邮件、Token信息查询等功能**

🌟 **简化微软 OAuth2 认证流程，轻松集成到你的应用中！** 🌟

本项目将微软的 OAuth2 认证取件流程封装成一个简单的 API，并部署在 Vercel 的无服务器平台上。通过这个 API，你可以轻松地在你的应用中进行 OAuth2 取件功能。

## ✨ 新功能：可视化邮件管理器

现在提供了全新的前端界面，让您无需手动调用API即可轻松管理邮箱：

- 📧 **邮件管理器** - 可视化的邮件操作界面
- ⚙️ **配置管理** - 安全的邮箱配置存储和管理
- 🎯 **一键操作** - 简单点击即可完成邮件操作
- 📱 **响应式设计** - 完美适配各种设备

## 🚀 快速开始

1. **Star 本项目**：首先，点击右上角的 `Star` 按钮，给这个项目点个赞吧！

2. **Fork 本项目**：点击右上角的 `Fork` 按钮，将项目复制到你的 GitHub 账户下。

3. **部署到 Vercel**：
   - 点击下面的按钮，一键部署到 Vercel。

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hmhm2022/msOauth2api)

   - 在 Vercel 部署页面，填写你的项目名称，然后点击 `Deploy` 按钮。

4. **配置环境变量**（可选）：
   - 在 Vercel 项目设置中，进入 `Settings` → `Environment Variables`
   - 添加环境变量 `PASSWORD`，设置你的 API 访问密码
   - **如果不设置密码，API 将不进行密码验证（公开访问）**
   - **建议设置密码以保护你的 API 安全**

5. **开始使用**：
   - 部署完成后，你可以通过访问 `https://your-vercel-app.vercel.app` 查看接口文档来进行使用。
   - **新功能**：访问 `https://your-vercel-app.vercel.app/mail-manager.html` 使用可视化邮件管理器。
   - **注意**：Vercel 的链接在国内可能无法访问，请使用自己的域名进行 CNAME 解析或使用 Cloudflare 进行代理。

## 🎯 使用方式

### 方式一：可视化界面（推荐）

1. **访问邮件管理器**：打开 `https://your-domain.com/mail-manager.html`
2. **配置邮箱**：在"邮箱配置"标签页添加您的邮箱信息
3. **开始使用**：切换到"邮件操作"标签页进行邮件管理

### 方式二：API接口调用

直接调用API接口进行邮件操作，详见下方API文档。

## 🚀 功能特性

### 📧 邮件管理器界面
- **配置管理**：安全存储多个邮箱配置，支持编辑和删除
- **邮件操作**：获取最新邮件、全部邮件，支持收件箱和垃圾箱切换
- **邮箱清理**：一键清空收件箱或垃圾箱
- **邮件发送**：支持纯文本和HTML格式邮件发送
- **本地存储**：配置信息安全保存在浏览器本地，不上传服务器
- **响应式设计**：完美适配手机、平板、电脑等各种设备

### 🔧 API接口
- **获取邮件**：支持获取最新邮件和全部邮件
- **邮箱清理**：批量清空收件箱和垃圾箱
- **邮件发送**：通过API发送邮件
- **验证码识别**：自动提取邮件中的6位数字验证码
- **安全保护**：支持密码验证，防止接口滥用

## 📚 API 文档

### 📧 获取最新的一封邮件

- **方法**: `GET`
- **URL**: `/api/mail-new`
- **描述**: 获取最新的一封邮件。如果邮件中含有6位数字验证码，会自动提取。支持 Graph API 和 IMAP 两种模式。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (必填): 邮箱地址。
  - `mailbox` (必填): 邮箱文件夹，支持的值为 `INBOX` 或 `Junk`。
  - `response_type` (可选): 返回格式，支持的值为 `json` 或 `html`，默认为 `json`。

### 📨 获取全部邮件

- **方法**: `GET`
- **URL**: `/api/mail-all`
- **描述**: 获取全部邮件。如果邮件中含有6位数字验证码，会自动提取。支持 Graph API 和 IMAP 两种模式。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (必填): 邮箱地址。
  - `mailbox` (必填): 邮箱文件夹，支持的值为 `INBOX` 或 `Junk`。

### 📤 发送邮件

- **方法**: `GET` 或 `POST`
- **URL**: `/api/send-mail`
- **描述**: 支持 Microsoft Graph API 发送邮件。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (必填): 发件人邮箱地址。
  - `to` (必填): 收件人邮箱地址。
  - `subject` (必填): 邮件主题。
  - `body` (必填): 邮件正文。

### 🗑️ 清空收件箱

- **方法**: `GET` 或 `POST`
- **URL**: `/api/clear-inbox`
- **描述**: 清空收件箱中的所有邮件。支持 Graph API 和 IMAP 两种模式。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (必填): 邮箱地址。

### 🗑️ 清空垃圾箱

- **方法**: `GET` 或 `POST`
- **URL**: `/api/clear-junk`
- **描述**: 清空垃圾箱中的所有邮件。支持 Graph API 和 IMAP 两种模式。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (必填): 邮箱地址。

### ❌ 删除指定邮件

- **方法**: `GET` 或 `POST`
- **URL**: `/api/delete-mail`
- **描述**: 删除指定的邮件。支持 Graph API 和 IMAP 两种模式。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (必填): 邮箱地址。
  - `message_id` (必填): 要删除的邮件 ID。
  - `mailbox` (可选): 邮箱文件夹，默认为 `INBOX`。

### 🔑 获取 Token 信息

- **方法**: `GET` 或 `POST`
- **URL**: `/api/token-info`
- **描述**: 获取访问令牌和相关信息，检测 Graph API 支持状态。
- **参数说明**:
  - `password` (可选): API 访问密码。如果在 Vercel 中设置了 `PASSWORD` 环境变量，则此参数必填。
  - `refresh_token` (必填): 用于身份验证的 refresh_token。
  - `client_id` (必填): 客户端 ID。
  - `email` (可选): 邮箱地址。

## 🔐 安全说明

本项目支持可选的密码保护功能：

### 密码验证逻辑

1. **不设置密码**（默认）：
   - 不在 Vercel 中配置 `PASSWORD` 环境变量
   - API 调用时不需要 `password` 参数
   - **任何人都可以访问你的 API**（不推荐）

2. **设置密码**（推荐）：
   - 在 Vercel 项目设置中配置环境变量 `PASSWORD`
   - 所有 API 调用时必须传递正确的 `password` 参数
   - 密码错误将返回 401 错误

### 环境变量说明

- `PASSWORD`: 用于所有 API 的密码保护（包括发送邮件）

### 示例请求

**不使用密码**：
```bash
# GET 请求
https://your-app.vercel.app/api/mail-new?refresh_token=xxx&client_id=xxx&email=xxx&mailbox=INBOX
```

**使用密码**：
```bash
# GET 请求
https://your-app.vercel.app/api/mail-new?password=your_password&refresh_token=xxx&client_id=xxx&email=xxx&mailbox=INBOX

# POST 请求
curl -X POST https://your-app.vercel.app/api/mail-new \
  -H "Content-Type: application/json" \
  -d '{
    "password": "your_password",
    "refresh_token": "xxx",
    "client_id": "xxx",
    "email": "xxx@outlook.com",
    "mailbox": "INBOX"
  }'
```

## 🖼️ 效果图

### API接口效果
![Demo](https://raw.githubusercontent.com/HChaoHui/msOauth2api/refs/heads/main/img/demo.png)

### 邮件管理器界面
新增的可视化邮件管理器提供了友好的操作界面：
- 📝 邮箱配置管理页面
- 📨 邮件操作控制面板
- 📤 邮件发送功能界面
- ℹ️ 详细的功能说明页面

访问 `/mail-manager.html` 体验完整的可视化管理功能。

## 🤝 贡献

**原项目**：[HChaoHui/msOauth2api](https://github.com/HChaoHui/msOauth2api)
**原作者邮箱**：[z@unix.xin](mailto:z@unix.xin)

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 💖 支持

如果你喜欢本项目，欢迎给它一个 Star ⭐️！

如果想支持原作者，可以访问：[原项目](https://github.com/HChaoHui/msOauth2api)

**Happy Coding!** 🎉