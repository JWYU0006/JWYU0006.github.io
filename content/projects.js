// =====================================================================
// 所有项目都在这里。每个 { ... } 是一个项目，按顺序显示（最好的放最前面）。
// 详细说明见 README.md。下面的项目全是示例，替换成你自己的即可。
//
// 常用字段：
//   id        网址里用的英文短名，只能用小写字母、数字和横杠，不能重复
//   category  属于哪个分区：game / level / code / art（对应 site.js 的 sections）
//   featured  true = 放在分区里；false = 放到 More Work
//   thumb     缩略图路径（images/ 文件夹），留空会显示色块
//   thumbGif  鼠标悬停时播放的 GIF，可不填
//   youtube   YouTube 视频 ID（网址 v= 后面那串），可不填
//   itch      itch.io 网页版嵌入地址，可不填（UE 项目不能用）
//   download  可下载版本 { url, label }，可不填
//   sections  项目页正文，类型见 README.md
// =====================================================================
window.PROJECTS = [
  {
    id: "rift-tactics",
    title: "Rift Tactics",
    category: "game",
    featured: true,
    summary: "Turn-based tactics prototype where terrain shifts every third turn.",
    tags: ["Unity", "Team of 3", "Design doc"],
    meta: { "My role": "Lead designer", Engine: "Unity", Team: "3", Duration: "8 weeks", Context: "Course project" },
    sections: [
      { type: "text", heading: "Overview", body: "Example project. Replace with your own." },
    ],
  },
  {
    id: "flooded-archive",
    title: "Flooded Archive",
    category: "level",
    featured: true,
    summary: "Stealth level built around light, water and three routes to one objective.",
    tags: ["UE5", "Solo", "6 weeks"],
    thumb: "",
    thumbGif: "",
    meta: {
      "My role": "Level design, scripting, art",
      Engine: "Unreal Engine 5",
      Team: "Solo",
      Duration: "6 weeks",
      Context: "Course project",
    },
    youtube: "",
    itch: "",
    download: { url: "", label: "Windows build on itch.io" },
    sections: [
      {
        type: "text",
        heading: "Goal",
        body: "Teach the player to read light as danger without a single tutorial prompt, then test that skill in a space with three valid routes.",
      },
      {
        type: "map",
        heading: "Level map",
        image: "",
        pins: [
          { x: 12, y: 70, label: "Safe intro: light pools teach the hiding rule" },
          { x: 40, y: 40, label: "First guard, one forced lesson" },
          { x: 62, y: 65, label: "Route split: water, rafters, or vents" },
          { x: 82, y: 22, label: "Objective, visible from the start as a landmark" },
        ],
      },
      {
        type: "compare",
        heading: "Blockout → Final",
        before: "",
        after: "",
        beforeLabel: "Blockout",
        afterLabel: "Final art",
      },
      {
        type: "code",
        heading: "Scripting",
        code:
          "// Guard detection rises faster in lit areas\n" +
          "float ATensionGuard::GetDetectionRate(const APawn* Player) const\n" +
          "{\n" +
          "    const float Light = LightSampler->SampleAt(Player->GetActorLocation());\n" +
          "    return BaseRate * FMath::Lerp(0.2f, 1.5f, Light);\n" +
          "}",
        link: "",
      },
      {
        type: "list",
        heading: "What I'd change",
        items: [
          "Playtests showed most players missed the vent route. I'd add a visual hook at the split.",
          "The final room reads too flat. I'd add a stronger key light on the objective.",
        ],
      },
    ],
  },
  {
    id: "canyon-run",
    title: "Canyon Run",
    category: "level",
    featured: true,
    summary: "Linear combat arena paced with three escalating encounters.",
    tags: ["UE5", "Team of 4", "Game Jam"],
    meta: { "My role": "Level designer", Engine: "Unreal Engine 5", Team: "4", Duration: "48 hours", Context: "Game Jam" },
    sections: [
      { type: "text", heading: "Overview", body: "Example project. Replace with your own." },
    ],
  },
  {
    id: "puzzle-toolkit",
    title: "Modular Puzzle Toolkit",
    category: "code",
    featured: true,
    summary: "Blueprint toolkit so designers can wire switches, doors and timers without code.",
    tags: ["UE5 Blueprint", "Solo"],
    meta: { "My role": "Technical designer", Engine: "Unreal Engine 5", Team: "Solo", Duration: "4 weeks" },
    sections: [
      { type: "text", heading: "Overview", body: "Example project. Replace with your own." },
    ],
  },
  {
    id: "tide-rider",
    title: "Tide Rider",
    category: "code",
    featured: true,
    summary: "Surf movement prototype with tunable wave physics.",
    tags: ["Unity", "Play in browser"],
    meta: { "My role": "Design & programming", Engine: "Unity", Team: "Solo", Duration: "3 weeks" },
    itch: "",
    sections: [
      { type: "text", heading: "Overview", body: "Example project. Replace with your own." },
    ],
  },
  {
    id: "ai-director",
    title: "Enemy AI Director",
    category: "code",
    featured: true,
    summary: "C++ system that spawns and paces enemies based on player stress.",
    tags: ["UE5 C++", "GitHub"],
    meta: { "My role": "Programmer", Engine: "Unreal Engine 5 (C++)", Team: "Solo", Duration: "5 weeks" },
    sections: [
      { type: "text", heading: "Overview", body: "Example project. Replace with your own." },
    ],
  },

  // ---- Environment Art ----
  { id: "desert-outpost", title: "Desert Outpost", category: "art", featured: true, summary: "Modular desert environment, UE5.", tags: ["UE5", "Maya", "Substance"], link: "" , sections: [] },
  { id: "forest-shrine", title: "Forest Shrine", category: "art", featured: true, summary: "Stylized forest scene.", tags: ["UE5"], sections: [] },

  // ---- More Work（featured: false）----
  { id: "jam-echo", title: "48h Jam: Echo", category: "game", featured: false, summary: "Game jam", sections: [] },
  { id: "card-battler-doc", title: "Card Battler GDD", category: "game", featured: false, summary: "Design document", sections: [] },
];
