# AstroBox 悬浮式文档界面拆解

本文分析 [AstroBox 文档站](https://abox.run/) 如何在 Fumadocs 的基础结构上，通过少量但高影响力的视觉覆盖，将普通文档导航改造成具有系统控制中心气质的悬浮界面。

分析基于 2026 年 7 月线上页面的 DOM、计算样式和前端资源，并与 [Fumadocs 官方文档](https://www.fumadocs.dev/docs)进行同视口对比。线上构建文件名可能随部署发生变化，本文重点记录稳定的设计方法和实现关系。

## 结论概览

AstroBox 并没有从头重写文档系统。其实现可以概括为：

```text
Fumadocs 的布局、目录树、滚动监听、折叠与响应式逻辑
                         ＋
悬浮几何、品牌色、精细间距、柔和阴影和轻量交互反馈
                         ↓
具有“控制岛”和“桌面面板”气质的文档界面
```

最重要的四个改造对象是：

1. 顶部导航：渐进背景模糊和独立液态胶囊。
2. 移动端目录：从贴边目录条变成可展开的悬浮控制岛。
3. 居中品牌 Logo：遮罩着色、透明热区和按压反馈。
4. 桌面侧栏：从贴边分栏变成四周悬空的桌面窗口。

## 技术基础

从线上资源和 DOM 可以确认主要技术包括：

- Next.js、React 和 Turbopack 构建资源。
- Fumadocs 的 Docs Layout、TOC、侧栏树和搜索能力。
- Tailwind CSS 工具类与 CSS Modules。
- Radix/旧版折叠实现，以及新版 Fumadocs 中逐步迁移到的 Base UI。
- CSS `mask-image`、`backdrop-filter`、`color-mix()` 和自定义属性。

Fumadocs 已提供复杂的内容能力，AstroBox 的重点是改变组件与屏幕、页面背景和正文之间的视觉关系。

---

## 一、顶部导航栏

### 1. 固定导航框架

导航最外层固定在视口顶部，内部容器控制实际内容宽度：

```css
.nav-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  width: 100%;
  min-height: 72px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-inner {
  position: relative;
  width: calc(100% + 32px);
  max-width: 1232px;
  min-height: 56px;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  padding: 3px 6px 6px;
  border-radius: 48px;
  overflow: hidden;

  transition: transform 350ms cubic-bezier(0.18, 0.86, 0.34, 1);
}
```

导航本体基本透明。页面内容与导航之间的分离，主要由渐进背景模糊完成。

### 2. 渐进背景模糊

普通毛玻璃通常只有一层：

```css
backdrop-filter: blur(12px);
```

AstroBox 则叠加三层不同强度的模糊，并为每层设置不同渐变遮罩。线上强度参数为 `100`，对应约：

- 第一层：`blur(2px)`。
- 第二层：`blur(6px)`。
- 第三层：`blur(12px)`。

每层使用类似下面的遮罩：

```css
.blur-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;

  backdrop-filter: blur(var(--blur));
  mask-image: linear-gradient(
    to top,
    transparent var(--mask-start),
    black var(--mask-end)
  );
}
```

三层模糊由顶部向下逐渐消失，避免出现传统毛玻璃导航的硬边矩形。

### 3. Smooth Capsule 液态胶囊

每个桌面菜单项都包裹在 `smooth-capsule` 组件中。它不是单纯使用 `border-radius: 999px`，而是将三个遮罩拼接：

```text
左侧 SVG 端帽 ＋ 中间矩形 ＋ 右侧镜像 SVG 端帽
```

当胶囊高度为 `40px` 时，线上计算值约为：

```text
端帽宽度：32.727px
端帽高度：40px
拼接重叠：3.636px
背景模糊：24px
```

等价结构如下：

```css
.smooth-capsule {
  --height: 40px;
  --cap-width: 32.727px;
  --overlap: 3.636px;

  height: var(--height);
  display: inline-flex;
  align-items: center;
  position: relative;
  isolation: isolate;

  background: var(--tint, transparent);
  backdrop-filter: blur(24px);

  mask-image:
    var(--left-cap-mask),
    linear-gradient(#000 0 0),
    var(--right-cap-mask);

  mask-size:
    var(--cap-width) var(--height),
    calc(
      100% - var(--cap-width) - var(--cap-width)
      + var(--overlap) + var(--overlap)
    ) var(--height),
    var(--cap-width) var(--height);

  mask-position:
    left center,
    calc(var(--cap-width) - var(--overlap)) center,
    right center;

  mask-repeat: no-repeat;
}
```

SVG 端帽不是普通半圆，而是经过调整的曲线路径，因此轮廓更像具有表面张力的玻璃。

### 4. 菜单项状态

菜单项状态非常克制：

```css
.nav-link {
  min-height: 40px;
  padding-inline: 15px;
  border-radius: 999px;
  opacity: 0.7;
  font-size: 15px;
  font-weight: 600;
}

.nav-capsule:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.nav-capsule:hover .nav-link {
  opacity: 1;
}

.nav-capsule:active {
  background: transparent;
  transform: scale(0.96);
}

.nav-capsule[data-active="true"] {
  background: color-mix(in srgb, currentColor 14%, transparent);
}
```

Hover 只提示可点击性，Active 才改变几何尺寸，避免导航持续晃动。

---

## 二、移动端目录控制岛

Fumadocs 在小屏幕上会将文档目录显示为 Sticky Popover。AstroBox 保留其阅读进度、当前标题监听和折叠逻辑，只重做外层视觉关系。

### 1. 与 Fumadocs 官方的对比

在 `634 × 920` 视口下：

| 属性 | Fumadocs 默认 | AstroBox |
| --- | ---: | ---: |
| 水平位置 | 贴满屏幕 | 两侧各留约 12px |
| 折叠高度 | 约 41px | 约 50px |
| 圆角 | 0 | 25px |
| 背景透明度 | 80% | 88% |
| 背景模糊 | 8px | 12px |
| 边框 | 底部分割线 | 完整 1px 边框 |
| 折叠阴影 | 无 | `0 4px 28px #00000012` |

视觉语义由“页面栏”变成“独立可操作表面”。

### 2. 悬浮外壳

核心覆盖可以整理为：

```css
#nd-docs-layout [data-toc-popover] {
  z-index: 25;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
}

#nd-docs-layout [data-toc-popover] > header {
  position: relative;
  box-sizing: border-box;

  width: 100%;
  max-width: 900px;
  min-height: 50px;
  margin: 1px 12px;

  border: 1px solid var(--color-fd-border);
  border-radius: 25px;

  background: color-mix(
    in srgb,
    var(--color-fd-background) 88%,
    transparent
  );

  backdrop-filter: blur(12px);
  box-shadow: 0 4px 28px rgb(0 0 0 / 7%);
}

#nd-docs-layout [data-toc-popover-trigger] {
  min-height: 48px;
  padding-inline: 22px;
  gap: 10px;
}

#nd-docs-layout [data-toc-popover-content] {
  padding: 0 24px 6px;
}
```

线上按钮使用了 `padding: 24px 22px`，但在自己的实现中使用固定最小高度和水平 padding 更稳健。

### 3. 上下间距

在 `427 × 698` 视口下，实际测量结果为：

```text
0px
│
├─ 顶部导航
│
56px  ← Fumadocs 逻辑导航高度
│
│  10px 外层 padding-top
│  + 1px header margin-top
│
67px  ╭────────────────────────╮
      │    控制岛，高 50px      │
117px ╰────────────────────────╯
│
│  19px 视觉留白
│
136px 第一个正文标题开始
```

因此可见节奏为：

```text
导航底部 → 11px → 控制岛 → 19px → 正文标题
```

下方间距大于上方间距是有意设计：

- 较小上间距表达它属于导航系统。
- 较大下间距表达正文从新的阅读区域开始。

### 4. 使用变量计算间距

不要仅依赖随意的 `margin-bottom`，可以将关系显式写为变量：

```css
#nd-docs-layout {
  --mobile-nav-height: 56px;
  --toc-slot-height: 40px;

  --island-height: 50px;
  --island-top-gap: 11px;
  --island-content-gap: 19px;

  --island-overflow: calc(
    var(--island-top-gap)
    + var(--island-height)
    - var(--toc-slot-height)
  );

  --content-start-space: calc(
    var(--island-overflow)
    + var(--island-content-gap)
  );
}
```

代入当前值：

```text
岛向下溢出 = 11 + 50 - 40 = 21px
正文需要预留 = 21 + 19 = 40px
```

Fumadocs 页面本身已有顶部 padding，实际接入时应减去现有空间，避免重复留白。

### 5. 展开连续性

展开目录时，AstroBox 没有创建第二块分离的 Popover，而是让原来的玻璃外壳向下长高：

```text
折叠：

╭────────────────────────╮
│ ○ 当前章节           ˅ │
╰────────────────────────╯

展开：

╭────────────────────────╮
│ ○ 页面标题           ˄ │
│                        │
│ │ 当前章节             │
│ │ 其他章节             │
╰────────────────────────╯
```

背景、圆角、阴影和顶部位置保持不变，用户感受到的是“控制岛打开内部空间”，而不是弹出了一个额外菜单。

### 6. Fumadocs 提供的逻辑

下列能力主要来自 Fumadocs：

- 进度圆环根据阅读进度改变 `stroke-dashoffset`。
- 页面标题与当前章节标题叠放在同一 Grid 单元。
- 标题通过 `translateY + opacity` 切换。
- 当前章节由 Intersection Observer 更新。
- 箭头在展开时旋转 180°。
- 内容高度由折叠组件自动计算。
- 活跃目录项自动滚动到可视区域。

AstroBox 的价值主要在于为这些行为提供统一的悬浮外壳。

### 7. 控制岛何时渲染

控制岛是否存在，首先由页面的 TOC 数据和显式配置决定。Fumadocs 的默认逻辑可以归纳为：

```tsx
const tocPopoverEnabled =
  tableOfContentPopover.enabled ??
  Boolean(
    toc.length > 0 ||
    tableOfContentPopover.header ||
    tableOfContentPopover.footer
  );

return tocPopoverEnabled ? <TOCPopover /> : null;
```

因此，只要满足下列任意条件，React 就会创建控制岛：

- 当前 MD/MDX 页面生成了非空 `toc`。
- 为控制岛提供了自定义 `header` 或 `footer`。
- 显式设置 `tableOfContentPopover.enabled: true`。

如果页面没有可用标题，也没有自定义内容或显式开启，控制岛默认不会渲染。AstroBox 当前页面包含“从此开始”“写在开头”等标题，所以具备渲染条件。

### 8. 控制岛何时可见

渲染完成后，具体显示哪一种目录形态由 CSS 断点决定，而不是由 JavaScript 判断设备类型：

```html
<div
  data-toc-popover
  class="xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]"
>
  ...
</div>
```

```css
/* 小于 80rem 时显示控制岛，并为它预留 40px 网格行 */
@media (width < 80rem) {
  #nd-docs-layout {
    --fd-toc-popover-height: 2.5rem;
  }
}

/* 到达 80rem 后隐藏控制岛 */
@media (width >= 80rem) {
  [data-toc-popover] {
    display: none;
  }
}
```

AstroBox 当前根字号为 `16px`，所以 `80rem = 1280px`。控制岛和右侧桌面目录使用相反的断点：

| 视口宽度 | 左侧导航 | 控制岛 | 右侧目录 |
| --- | --- | --- | --- |
| `< 768px` | 移动端抽屉 | 显示 | 隐藏 |
| `768px–1279px` | 显示 | 显示 | 隐藏 |
| `>= 1280px` | 显示 | 隐藏 | 显示 |

可以把完整条件写成：

```ts
const shouldRenderIsland =
  explicitEnabled ?? Boolean(toc.length || customHeader || customFooter);

// 这一层实际由 CSS Media Query 完成。
const shouldShowIsland = shouldRenderIsland && viewportWidth < 1280;
```

窗口跨过断点时，浏览器只需重新计算 CSS；React 不需要因为视口变化重新决定是否渲染。滚动位置同样不控制岛的存在，它只更新当前章节、标题切换和进度圆环。

---

## 三、居中品牌 Logo

### 1. 结构与尺寸

Logo 的视觉内容约为：

```text
图标：20 × 20px
间距：8px
字标：62 × 16px
总视觉宽度：约 90px
```

但外层链接实际为约 `118 × 40px`，扩大了点击热区：

```html
<a class="brand-link" href="/" aria-label="AstroBox">
  <span class="brand-content">
    <span class="brand-icon" aria-hidden="true"></span>
    <svg class="brand-wordmark" viewBox="0 0 62 16" aria-hidden="true">
      <path d="..." fill="currentColor" />
    </svg>
  </span>
</a>
```

### 2. 使用图片作为 CSS Mask

蓝色图标不是直接显示 PNG，而是用 PNG 透明度作为遮罩，再用主题色填充：

```css
.brand-icon {
  width: 20px;
  height: 20px;
  flex: none;

  background-color: var(--color-fd-primary);

  -webkit-mask:
    url("/assets/brand/brand-icon.png")
    center / contain
    no-repeat;

  mask:
    url("/assets/brand/brand-icon.png")
    center / contain
    no-repeat;
}
```

这样只需修改 `--color-fd-primary` 就能为图标换色。

“DOCS”字标使用内联 SVG Path，避免字体差异和加载位移，并通过 `currentColor` 跟随深浅色主题。

### 3. Hover 与按压反馈

线上规则为：

```css
.brand-link {
  min-height: 40px;
  padding: 4px 10px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition:
    background 200ms,
    color 200ms,
    transform 150ms;
}

.brand-link:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.brand-link:active {
  opacity: 0.55;
  transform: scale(0.96);
}
```

状态关系是：

```text
默认：只显示品牌
Hover：显现淡色胶囊，提示可点击
Active：整体缩小并变淡，模拟按键下陷
```

推荐额外加入：

```css
.brand-link {
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 150ms ease,
    opacity 150ms ease;
}

.brand-link:focus-visible {
  outline: 2px solid var(--color-fd-primary);
  outline-offset: 2px;
}
```

### 4. 真正居中

移动端 Logo 热区的测量值为：

```text
左侧位置：约 147px
宽度：118px
中心位置：206px
可用页面宽度：412px
页面中心：206px
```

它不是在左右按钮之间近似居中，而是通过中心列 `width: 100%`、`justify-content: center` 和自动 margin 实现像素级居中。

---

## 四、桌面端悬浮侧栏

### 1. 与 Fumadocs 官方的对比

在 `1259 × 920` 视口下：

| 属性 | Fumadocs 默认 | AstroBox |
| --- | ---: | ---: |
| 左侧位置 | 0px | 8px |
| 顶部位置 | 0px | 8px |
| 宽度 | 268px | 252px |
| 高度 | 920px | 904px |
| 距离底部 | 0px | 8px |
| 圆角 | 0 | 20px |
| 边框 | 右侧分割线 | 完整 1px 边框 |
| 阴影 | 无 | `0 12px 40px #00000014` |
| 背景 | `rgb(241,241,241)` | `rgb(241,241,241)` |
| 背景模糊 | 无 | 无 |

当前桌面侧栏并没有启用 `backdrop-filter`。其高级感主要来自悬浮几何、完整轮廓、环境阴影和内部密度，而不是毛玻璃。

### 2. 从贴边栏变成桌面窗口

核心覆盖如下：

```css
.docs-sidebar-slot {
  display: flex;
  padding: 8px;
}

#nd-sidebar:not([data-collapsed="true"]) {
  width: calc(100% - 16px);
  max-width: calc(var(--fd-sidebar-width) - 16px);
  height: calc(100% - 16px);

  margin: 8px;

  border: 1px solid var(--color-fd-border);
  border-radius: 20px;
  background: var(--color-fd-card);

  box-shadow: 0 12px 40px rgb(0 0 0 / 8%);
}
```

线上使用了较依赖 DOM 结构的选择器：

```css
header + div:has(aside#nd-sidebar)
```

自己的项目更适合给父容器增加稳定类名。

### 3. 宽度如何自适应

侧栏的“自适应”不是按百分比连续缩放，而是固定侧栏宽度、让正文吸收剩余空间，并在小屏幕整体切换成抽屉。

Fumadocs 在 `768px` 以上把侧栏变量设置为 `268px`：

```css
#nd-docs-layout {
  --fd-sidebar-width: 0px;
}

@media (min-width: 768px) {
  #nd-docs-layout {
    --fd-sidebar-width: 268px;
  }
}

.docs-sidebar-slot {
  grid-area: sidebar;
  width: var(--fd-sidebar-width);
}
```

AstroBox 再将可见卡片向内收进 `8px`：

```css
#nd-sidebar {
  width: 100%;
  max-width: calc(var(--fd-sidebar-width) - 16px);
  margin: 8px;
  box-sizing: border-box;
}
```

因此实际尺寸为：

```text
侧栏网格槽位：268px
左侧外间距：    8px
右侧外间距：    8px
可见卡片宽度：252px

268 - 8 - 8 = 252px
```

线上实测结果：

| 视口宽度 | 侧栏槽位 | 可见卡片宽度 |
| ---: | ---: | ---: |
| 1259px | 268px | 252px |
| 900px | 268px | 252px |

两个视口下侧栏宽度完全相同，变化的是正文列。`1259px` 视口排除滚动条后的页面宽度为 `1244px`，网格实际为：

```css
grid-template-columns: 0px 268px 976px 0px 0px;
```

即正文获得剩余的 `976px`：

```text
1244 - 268 = 976px
```

整体模型可以抽象为：

```css
#nd-docs-layout {
  display: grid;
  grid-template-columns:
    var(--start-col)
    var(--fd-sidebar-width)
    minmax(0, 1fr)
    var(--fd-toc-width)
    var(--end-col);
}
```

小于 `768px` 时，桌面侧栏不是继续被压窄，而是通过 `max-md:hidden` 隐藏，导航入口切换到移动端抽屉。这样搜索框、菜单文字和底部工具不会随着窗口缩放而忽宽忽窄。

### 4. 三段式内部结构

侧栏采用：

```text
╭────────────────────────╮
│ Logo / 收起按钮         │
│ 搜索框                  │  固定头部，约 154px
│ 文档类型选择器          │
├────────────────────────┤
│                        │
│ 文档目录树              │  flex: 1，独立滚动
│                        │
├────────────────────────┤
│ GitHub / 主题切换        │  固定底部，约 65px
╰────────────────────────╯
```

关键布局：

```css
#nd-sidebar {
  display: flex;
  flex-direction: column;
}

.sidebar-scroll-wrapper {
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.sidebar-scroll-viewport {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
}
```

`min-height: 0` 可以防止 Flex 子元素被内容撑高，从而保证头部和底部始终固定。

### 5. 滚动渐隐

侧栏目录继承了 Fumadocs 的渐隐遮罩：

```css
.sidebar-scroll-viewport {
  mask-image: linear-gradient(
    to bottom,
    transparent,
    white 12px,
    white calc(100% - 12px),
    transparent
  );
}
```

目录在上下边缘自然淡出，比硬裁切更像桌面窗口内部的滚动区域。

### 6. 内部密度

Fumadocs 默认头部使用约 `16px` padding，AstroBox 收紧为约 `14px`：

```css
#nd-sidebar > div,
#nd-sidebar > div > div {
  box-sizing: border-box;
  max-width: 100%;
}

#nd-sidebar > .p-4,
#nd-sidebar > div > .p-4 {
  padding: 14px;
}
```

图标统一到 `16 × 16px`，使文字成为信息主体：

```css
#nd-sidebar svg.doc-icon {
  width: 16px;
  height: 16px;
}
```

### 7. 品牌化活动状态

```css
:root {
  --color-fd-primary: #1781ff;
  --color-fd-accent: #1781ff14;
}

#nd-sidebar a[data-active="true"] {
  color: var(--color-fd-primary);
  background: var(--color-fd-accent);
  font-weight: 500;
}

#nd-sidebar a[data-active="true"]::before {
  background: var(--color-fd-primary);
  border-radius: 4px;
}
```

当前项使用低透明度蓝色背景、蓝色文字和中等字重，而不是一整块高饱和蓝色。

### 8. 搜索快捷键

AstroBox 将默认带边框键帽改成更像系统工具栏的提示：

```css
[data-search-full] kbd {
  min-width: 20px;
  max-width: 42px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1px 3px 0;
  margin-left: 2px;

  border: none;
  border-radius: 3px;

  font-size: 13px;
  font-weight: 400;

  background: color-mix(
    in srgb,
    var(--color-fd-foreground) 10%,
    transparent
  );
}
```

---

## 五、统一的设计语言

四类组件虽然形态不同，但共享同一套规则。

### 1. 几何

- 重要表面离开屏幕边缘。
- 小控件使用完整胶囊，大面板使用 20px 左右圆角。
- 点击热区大于视觉内容。
- 上下间距不强求对称，而是表达组件归属关系。

### 2. 色彩

- 主色统一为 `#1781ff`。
- Hover 和 Active 背景通常只混入 8%～14% 的当前颜色。
- 活跃状态通过颜色、字重和轻背景共同表达。
- 深色模式使用更明亮的蓝色与更强的环境阴影。

### 3. 深度

- 控制岛使用半透明背景和背景模糊。
- 桌面侧栏使用稳定纯色背景和大范围低浓度阴影。
- 边框定义表面轮廓，阴影表达离开页面的高度。

### 4. 动效

- Hover 主要改变表面颜色。
- Active 才使用 `scale(0.96)` 等几何反馈。
- 背景过渡约 200ms，按压反馈约 150ms。
- 滚动监听使用 passive listener 和 `requestAnimationFrame` 节流。

### 5. 字体与图标

AstroBox 使用：

```css
font-family:
  "Google Sans Flex",
  "MiSans Chinese",
  "PingFang SC",
  "Microsoft YaHei",
  sans-serif;
```

圆润字体与胶囊、圆形进度环和圆角面板保持一致。目录图标普遍控制在 16px，避免与文本争夺注意力。

---

## 六、可访问性与兼容性建议

### 1. 键盘焦点

所有可交互胶囊都应提供 `:focus-visible`：

```css
:where(a, button):focus-visible {
  outline: 2px solid var(--color-fd-primary);
  outline-offset: 2px;
}
```

### 2. 减少动态效果

```css
@media (prefers-reduced-motion: reduce) {
  .nav-inner,
  .smooth-capsule,
  .brand-link,
  #nd-sidebar,
  [data-toc-popover] * {
    transition: none;
    animation: none;
  }
}
```

### 3. Mask 兼容性

Safari 仍建议同时声明 `-webkit-mask-*` 和标准 `mask-*`。

### 4. Backdrop Filter 性能

避免在大面积持续滚动区域使用高强度 `backdrop-filter`。桌面侧栏保持纯色背景，是可读性和性能都更稳定的选择。

### 5. 避免深层 DOM 选择器

Fumadocs 官方允许使用稳定的 `id` 和 `data-*` 属性覆盖样式，但不保证深层内部 DOM 永远不变。线上已经可以观察到版本差异：

- 旧版折叠内容使用 `data-state` 和 `--radix-collapsible-content-height`。
- 新版 Fumadocs 使用 `data-open` 和 `--collapsible-panel-height`。

优先选择：

1. Fumadocs 暴露的配置属性。
2. `tableOfContentPopover` 等组件选项。
3. TOC Slots。
4. 通过 Fumadocs CLI 将组件安装到项目后修改。
5. 最后才使用依赖子元素层级的全局选择器。

可通过以下命令获得可编辑组件：

```bash
npx @fumadocs/cli@latest customize
```

---

## 七、实施顺序建议

如果要在自己的 Fumadocs 项目中复现，推荐按以下顺序实施：

1. 先定义品牌色、字体、圆角和阴影 Token。
2. 将桌面侧栏改成四周留白的悬浮面板。
3. 为活动目录项、搜索框和文档类型选择器统一状态色。
4. 将移动端 TOC 改成同一表面内展开的控制岛。
5. 最后增加顶部渐进模糊和 Smooth Capsule。
6. 补齐键盘焦点、Reduced Motion 和不同主题测试。

推荐 Token：

```css
:root {
  --brand-primary: #1781ff;
  --brand-primary-soft: rgb(23 129 255 / 8%);

  --radius-control: 999px;
  --radius-island: 25px;
  --radius-panel: 20px;

  --shadow-island: 0 4px 28px rgb(0 0 0 / 7%);
  --shadow-panel: 0 12px 40px rgb(0 0 0 / 8%);

  --duration-hover: 200ms;
  --duration-press: 150ms;
  --press-scale: 0.96;
}
```

## 参考资料

- [AstroBox 文档](https://abox.run/)
- [AstroBox 使用教程页面](https://abox.run/docs/usage)
- [Fumadocs 官方文档](https://www.fumadocs.dev/docs)
- [Fumadocs Docs Layout](https://www.fumadocs.dev/docs/ui/layouts/docs)
- [Fumadocs Docs Page 与 TOC 配置](https://www.fumadocs.dev/docs/ui/layouts/page)
- [Fumadocs Customize UI](https://www.fumadocs.dev/docs/guides/customize-ui)
- [Fumadocs Headless TOC](https://www.fumadocs.dev/docs/headless/components/toc)
