# 作品集网站使用说明

网址：[https://jwyu0006.github.io](https://jwyu0006.github.io)

平时只需要改 `content/` 文件夹里的两个文件，其他文件都不用动：

| 文件 | 管什么 |
| --- | --- |
| `content/site.js` | 名字、首页标题、联系方式、About、岗位分区 |
| `content/projects.js` | 所有项目 |
| `content/vitv.js` | Voice in the Void 的四个页面（一个项目拆成多页的写法可以参考它） |

改完推送到 GitHub，大约 1 分钟后网站自动更新。也可以直接在项目里让 Claude 帮你改。

## 本地预览

在仓库根目录运行下面的命令，然后打开 http://localhost:8000：

```
python -m http.server 8000
```

也可以直接双击 `index.html` 打开。

## 图片、GIF 和简历放在哪里

- 图片和 GIF 放进 `images/` 文件夹，在内容文件里写 `"images/文件名.jpg"`。
- 简历 PDF 放在根目录，命名为 `resume.pdf`。
- 缩略图建议用 16:9 的比例，宽度 1280 像素左右。GIF 尽量控制在 5MB 以内。
- **视频有两种放法**：
  - **短视频（5–20 秒、无声、循环播放）**：导出成 MP4 放进 `images/`，用 `clip`、`thumbVideo` 或正文里的 `clip` 模块。打开页面就自动播放，效果和 GIF 一样，但更清晰，文件也小得多。每个文件尽量控制在 10MB 以内，GitHub 单个文件上限是 100MB。
  - **长视频（完整流程、有声音）**：上传到 YouTube（可以设成“不公开”），把视频 ID 填进 `youtube`。

## 一个项目的完整写法

```js
{
  id: "flooded-archive",          // 网址用的短名：小写字母、数字、横杠，不能重复
  title: "Flooded Archive",
  category: "level",              // game / level / code / art，对应 site.js 里的 sections
  featured: true,                 // false 表示放到 More Work
  summary: "一句话介绍，显示在卡片上和项目页标题下面",
  tags: ["UE5", "Solo", "6 weeks"],
  thumb: "images/flooded.jpg",    // 卡片缩略图
  thumbGif: "images/flooded.gif", // 鼠标悬停时播放，可不填
  meta: {                         // 项目页顶部的信息条，左边的名字可以自己改
    "My role": "Level design, scripting",
    Engine: "Unreal Engine 5",
    Team: "Solo",
    Duration: "6 weeks",
    Context: "Course project",
  },
  thumbVideo: "images/flooded-loop.mp4", // 鼠标悬停时播放的短视频，比 GIF 更好，可不填
  youtube: "dQw4w9WgXcQ",         // 视频网址 v= 后面那一串
  clip: "images/flooded-loop.mp4", // 没有 YouTube 时，顶部改为自动循环播放这个短视频
  heroImage: "",                  // 没有视频时用一张大图代替
  itch: "",                       // itch.io 网页版的嵌入地址（只有 Unity/Godot 的 WebGL 版本才有）
  download: { url: "https://xxx.itch.io/xxx", label: "Windows build, 1.4 GB" },
  github: "",                     // 完整代码的仓库链接
  related: [                      // 同一项目拆成多个页面时，互相链接
    { id: "flooded-archive-art", role: "Environment artist" },
  ],
  link: "",                       // 填了的话，点卡片会直接跳到这个外部链接（比如 ArtStation），不进项目页
  highlights: ["要点1", "要点2"], // 项目页顶部的 Highlights 框
  sections: [ ... ],              // 项目页正文，见下面
}
```

`itch` 的地址可以这样找：打开 itch.io 上你的游戏 → Edit game → Distribute → Embed game，复制代码里 `src="..."` 引号中的那段地址。

## 项目页正文（sections）可以用的模块

可以随意组合，排列顺序就是在页面上显示的顺序。每个模块的 `heading` 都可以不填。

```js
// 推荐：加粗结论 + bullet。clip 或 image 会显示在文字右边
{ type: "point", heading: "Click-to-move", lead: "一句话结论", bullets: ["要点1", "要点2"],
  clip: "images/move.mp4", mediaLabel: "素材到位前占位框里的说明" }

// 推荐：问题 → 方案 → 结果
{ type: "story", heading: "Camera trigger zones", problem: "...", solution: "...", result: "...",
  clip: "images/zones.mp4" }

// 分界线：把概括部分和细节部分分开，label 可以不填
{ type: "divider", label: "Design breakdown" }

// 文字。空一行就是新的一段
{ type: "text", heading: "Goal", body: "第一段\n\n第二段" }

// 列表，适合写“What I'd change”
{ type: "list", heading: "What I'd change", items: ["第一点", "第二点"] }

// 带编号标注的关卡俯视图。x 和 y 是百分比位置（0–100），从左上角开始算
{ type: "map", heading: "Level map", image: "images/map.png",
  pins: [ { x: 12, y: 70, label: "说明" } ] }

// 白盒和最终效果的拖动对比。两张图的尺寸和机位要一致
{ type: "compare", heading: "Blockout → Final",
  before: "images/blockout.jpg", after: "images/final.jpg",
  beforeLabel: "Blockout", afterLabel: "Final art" }

// 代码片段
{ type: "code", heading: "Scripting", code: "代码内容", link: "GitHub 文件链接" }

// 多张图片
{ type: "images", heading: "Process", images: [ { src: "images/a.jpg", caption: "说明" } ] }

// 自动循环播放的短视频（MP4，无声）
{ type: "clip", heading: "Wall-run prototype", src: "images/wallrun.mp4", caption: "说明" }

// 额外的视频
{ type: "video", heading: "Combat encounter", youtube: "视频ID", caption: "说明" }
```

## 一个项目拆成多个页面

比如一个项目你同时负责了关卡和美术：做两个项目，`category` 分别填 `level` 和 `art`，标题写成 “Project X: Level Design” 和 “Project X: Environment Art”。两个项目都加上 `related`，互相指向对方，每个页面顶部就会显示 “Also on this project”，写着你在另一部分的身份，点击就能跳过去。

## 上线前检查

- `site.js` 里的 `showDraftBanner` 改成 `false`。
- 删掉所有示例项目。
- 填好邮箱和 LinkedIn。
- 放好 `resume.pdf`。
