// =====================================================================
// 网站基本信息：名字、定位、联系方式、分区。
// 改完保存，刷新网页就能看到效果。
// =====================================================================
window.SITE = {
  name: "Jiawei Yu",

  // 首页顶部的小字标签和大标题
  role: "Level & Technical Designer",
  status: "Seeking Summer 2027 Internship · Canada",
  headline: "I build spaces players read without a tutorial.",
  intro:
    "Game design student in Canada with a background in 3D environment art. " +
    "I take levels from paper map to blockout to final art, and script the systems that run them.",

  // 联系方式。不想显示的项留空 ""，按钮就会自动隐藏。
  resume: "resume.pdf", // 把简历 PDF 放到网站根目录，文件名保持一致
  email: "",
  linkedin: "",
  github: "https://github.com/JWYU0006",
  itch: "",
  artstation: "",

  // About 部分，每个引号是一段
  about: [
    "Before moving into design, I worked professionally as a 3D environment artist. That background shapes how I build levels: I think about readability, composition and lighting from the first blockout.",
    "I'm currently studying game design in Canada and looking for level design, technical design or gameplay programming internships.",
  ],

  // 首页的岗位分区，按这里的顺序显示。
  // id 要和 projects.js 里每个项目的 category 对应。
  sections: [
    { id: "level", title: "Level Design" },
    { id: "tech", title: "Technical Design" },
    { id: "code", title: "Programming" },
  ],

  // true = 网站顶部显示“示例内容”提示条。全部换成真实内容后改成 false。
  showDraftBanner: true,
};
