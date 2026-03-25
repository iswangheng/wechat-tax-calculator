# 项目规范 - WeChat Project 01

## 项目概述
微信小程序项目，目标是通过承接微信搜索流量，提供工具类服务并通过广告变现。

## 语言与交流
- 用中文交流和文档
- 代码注释用英文
- Commit message 用中文

## 项目结构

### 目录规范
```
wechat-project-01/
├── docs/                   # 📚 文档目录（所有文档统一放这里）
│   ├── market-research.md  # 市场调研报告
│   ├── requirements.md     # 需求文档
│   ├── design.md          # 技术设计文档
│   ├── api.md             # API 接口文档
│   └── deployment.md      # 部署文档
│
├── src/                   # 💻 源代码目录
│   ├── pages/            # 小程序页面
│   ├── components/       # 组件
│   ├── utils/            # 工具函数
│   ├── services/         # 服务层（API调用）
│   ├── styles/           # 样式文件
│   └── config/           # 配置文件
│
├── cloud/                # ☁️ 云函数（后端）
│   ├── functions/        # 云函数
│   └── database/         # 数据库配置
│
├── scripts/              # 🛠️ 脚本目录
│   ├── build.sh         # 构建脚本
│   ├── deploy.sh        # 部署脚本
│   └── init.sh          # 初始化脚本
│
├── tests/               # 🧪 测试目录
│   ├── unit/           # 单元测试
│   ├── integration/    # 集成测试
│   └── e2e/            # 端到端测试
│
├── assets/             # 🖼️ 静态资源
│   ├── images/        # 图片
│   └── icons/         # 图标
│
├── config/            # ⚙️ 项目配置
│   ├── dev.json      # 开发环境配置
│   └── prod.json     # 生产环境配置
│
├── .gitignore
├── package.json
├── project.config.json  # 微信小程序配置
├── CLAUDE.md           # 本规范文档
├── PROJECT_STRUCTURE.md # 详细结构说明
└── README.md
```

### 为什么这样设计
- **docs/** - 所有文档集中管理，方便查找和维护
- **src/** - 源代码结构清晰，按功能模块划分
- **scripts/** - 自动化脚本独立，便于 CI/CD
- **tests/** - 测试文件独立，避免混入源码
- **cloud/** - 后端代码分离，支持独立部署

## 命名规范

### 文件命名
- **页面文件**: kebab-case (例: `home-page.wxml`, `user-profile.js`)
- **组件文件**: PascalCase (例: `UserCard.wxml`, `SearchBar.js`)
- **工具函数**: camelCase (例: `formatDate.js`, `validatePhone.js`)
- **常量文件**: UPPER_SNAKE_CASE (例: `API_CONFIG.js`, `ERROR_CODES.js`)
- **脚本文件**: kebab-case (例: `build-prod.sh`, `deploy-cloud.sh`)

### 代码命名
- **变量**: camelCase (例: `userName`, `totalPrice`)
- **常量**: UPPER_SNAKE_CASE (例: `MAX_COUNT`, `API_BASE_URL`)
- **函数**: camelCase，动词开头 (例: `getUserInfo()`, `calculateTotal()`)
- **组件**: PascalCase (例: `<UserCard />`, `<SearchInput />`)
- **类**: PascalCase (例: `UserService`, `DataManager`)

## 代码风格

### JavaScript/小程序代码
- 缩进：2 空格
- 字符串：单引号
- 分号：必须加
- 优先使用 `const`，其次 `let`，禁止 `var`
- 函数不超过 50 行，超过则拆分
- 使用 async/await 而非 .then() 链

### 注释规范
```javascript
// 单行注释用英文
// Calculate total price with discount

/**
 * 函数注释用 JSDoc 格式（英文）
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} Final price after discount
 */
function calculateDiscount(price, discount) {
  // Implementation
}
```

## 文档规范

### 必备文档
所有文档必须放在 `docs/` 目录：
1. **market-research.md** - 市场调研报告
2. **requirements.md** - 功能需求文档
3. **design.md** - 技术设计文档
4. **api.md** - API 接口文档（如有后端）
5. **deployment.md** - 部署指南

### 文档格式要求
- 使用 Markdown 格式
- 必须包含标题和目录
- 代码示例使用代码块标注语言
- 图片统一放在 `docs/images/` 目录
- 文档顶部注明最后更新时间

### 文档模板
```markdown
# [文档标题]

**最后更新**: 2026-03-24
**作者**: Claude
**版本**: v1.0

## 目录
- [章节1](#章节1)
- [章节2](#章节2)

## 章节1
内容...

## 章节2
内容...
```

## Git 工作流

### Commit Message 规范
格式：`type(scope): description`

**Type 类型**：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（既不是新功能也不是修复）
- `test`: 测试相关
- `chore`: 构建/工具变动
- `perf`: 性能优化

**示例**：
```
feat(pages): 添加房贷计算器页面
fix(utils): 修复日期格式化错误
docs(api): 更新接口文档
```

### 分支管理
- **main**: 主分支，保持稳定
- **dev**: 开发分支
- **feature/xxx**: 功能分支（从 dev 拉取）
- **fix/xxx**: 修复分支（从 dev 拉取）

### Git 安全规则
- ❌ 不要 `git push --force`
- ❌ 不要 `git reset --hard` 除非明确需要
- ✅ 提交前检查是否有敏感信息（API key、密码、token）
- ✅ 每个 commit 只做一件事

## 测试规范

### 测试原则
- 关键功能必须有测试
- 测试覆盖率目标 > 80%
- 测试文件放在 `tests/` 目录，按类型分类

### 测试命名
- 描述**行为**而非**实现**
- 格式：`should [expected behavior] when [condition]`
- 示例：
  - `should return empty array when no data found`
  - `should calculate correct total when discount applied`

### 测试分类
- **unit/**: 单元测试（工具函数、组件）
- **integration/**: 集成测试（多模块协作）
- **e2e/**: 端到端测试（完整用户流程）

## 开发工作流

### 复杂任务处理
1. **必须先用 plan mode**，不要直接写代码
2. 明确需求 → 技术方案 → 分步实施
3. 每步完成后更新文档

### 文件操作规则
1. **修改文件前必须先读取**文件内容
2. 不要一次性修改大量文件
3. 每次修改后说明改动原因

### 代码提交规则
- ❌ **不要自动 commit**，除非用户明确要求
- ✅ 代码完成后询问用户是否需要提交
- ✅ 提交前检查代码质量和测试

### 文档维护
- 代码变更时同步更新相关文档
- 不要创建不必要的文档（如无意义的 CHANGELOG）
- 文档要实用，避免过度工程化

## 技术栈

### 前端
- 微信小程序原生开发
- 必要时可引入 WeUI 组件库

### 后端
- 微信云开发（优先选择，快速上线）
- 或 Node.js + Express（如需复杂逻辑）

### 数据库
- 云数据库（配合微信云开发）
- 或 MySQL（如需复杂查询）

### 工具
- 包管理器：npm
- 版本管理：Git
- 小程序开发工具：微信开发者工具

## 常用命令

```bash
# 安装依赖
npm install

# 开发模式（需手动在微信开发者工具中运行）
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test

# 部署云函数
npm run deploy:cloud
```

## 广告变现规范

### 广告位设计
- **首页 banner**: 页面顶部
- **结果页插屏**: 计算结果展示后
- **底部 banner**: 固定在页面底部

### 用户体验原则
- 广告不能影响核心功能使用
- 首次加载不弹出插屏广告
- 提供"关闭广告"选项（5秒后）

## 注意事项

### 安全规范
- 所有 API 调用必须验证参数
- 敏感信息不得硬编码
- 使用环境变量管理配置

### 性能优化
- 图片使用 webp 格式
- 首屏加载时间 < 2 秒
- 避免频繁的 setData 操作

### 微信审核规范
- 不得包含未经授权的内容
- 广告内容符合微信规范
- 用户隐私政策明确

## 项目维护

### 定期检查
- [ ] 依赖包安全更新
- [ ] 代码质量检查
- [ ] 文档完整性检查
- [ ] 测试覆盖率检查

### 版本发布
1. 更新版本号
2. 更新 README.md
3. 运行完整测试
4. 创建 Git tag
5. 提交审核

---

**最后更新**: 2026-03-24
**版本**: v1.0
