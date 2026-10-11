// =====================================================================
// 网站基本信息：名字、定位、联系方式、分区。
// 改完保存，刷新网页就能看到效果。
// =====================================================================
window.SITE = {
  name: "Jiawei Yu",

  // 首页顶部：橘色岗位名 + 下面一行求职状态
  role: "Game Designer · Level Designer · Gameplay Programmer",
  status: "Graduating April 2028 · Open to Summer 2027 internships & full-time roles",

  // 大标题
  headline: "I plan carefully and design boldly to build experiences players remember.",

  // 大标题下面：加粗的学校专业 + 一段能力介绍
  school: "Honours Bachelor of Game Design · Sheridan College",
  intro:
    "I document designs clearly, prototype them quickly in engine, and think about mechanics, systems and code structure " +
    "as both a designer and a programmer. I work comfortably in Scrum teams, and my professional 3D art background " +
    "strengthens everything I build.",

  // 联系方式。不想显示的项留空 ""，按钮就会自动隐藏。
  resume: "resume.pdf", // 把简历 PDF 放到网站根目录，文件名保持一致
  email: "",
  linkedin: "",
  github: "https://github.com/JWYU0006",
  itch: "",
  artstation: "",

  // About 部分，每个引号是一段
  about: [
    "Before studying game design, I worked professionally as a 3D environment artist. That background shapes how I design: I think about readability, composition and player experience from the first blockout.",
    "I'm now in the Honours Bachelor of Game Design program at Sheridan College, where I work across game design, level design and gameplay programming. I'm looking for internships and, after graduating in April 2028, full-time roles in Canada.",
  ],

  // About 下面的技能列表。label 是左边的类别名，items 是标签。
  skills: [
    { label: "Engines", items: ["Unreal Engine 5", "Unity"] },
    { label: "Programming", items: ["C++", "C#", "Blueprint"] },
    { label: "Design", items: ["Design documentation", "Rapid prototyping", "Level blockout", "Scrum"] },
    { label: "Art", items: ["3D environment art"] },
  ],

  // 首页的分区，按这里的顺序显示。
  // id 要和 projects.js 里每个项目的 category 对应。
  sections: [
    { id: "game", title: "Game Design" },
    { id: "level", title: "Level Design" },
    { id: "code", title: "Gameplay Programming & Technical Design", nav: "Programming & Tech Design" }, // nav = 顶部导航栏里的短名
    { id: "art", title: "Environment Art" },
  ],

  // true = 网站顶部显示“示例内容”提示条。全部换成真实内容后改成 false。
  showDraftBanner: true,
};
