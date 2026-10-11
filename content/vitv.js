// =====================================================================
// Voice in the Void：一个项目拆成四个页面，互相链接。
//
// 页面写法：
//   highlights  页面顶部的要点框，每条一句话
//   youtube     顶部完整流程视频（可不填）
//   sections    正文。point = 加粗结论 + bullet；story = 问题/方案/结果
//               每段都可以填 clip（MP4 短视频）或 image，会显示在文字右边
//               mediaLabel 是素材还没放之前，占位框上显示的说明
// =====================================================================
(function () {
  const intro = {
    type: "point",
    heading: "The game",
    lead: "A point-and-click visual novel where you can't trust the voice guiding you.",
    bullets: [
      "You play an injured scientist with amnesia, trapped on a damaged spaceship.",
      "A voice on the radio guides you, and slowly stops making sense.",
      "Choices come from what you do in the world, not from dialogue menus.",
      "Team of five, one semester. Result: a technical prototype with every core system working end to end and limited story content.",
    ],
  };

  const meta = (role) => ({
    "My role": role,
    Engine: "Unreal Engine 5.6",
    Team: "5",
    Duration: "One semester",
    Context: "Course project",
  });

  const related = (self) =>
    [
      { id: "vitv-systems", role: "Systems designer" },
      { id: "vitv-level", role: "Level designer" },
      { id: "vitv-tech", role: "Technical designer" },
      { id: "vitv-art", role: "3D character artist" },
    ].filter((r) => r.id !== self);

  const pages = [
    {
      id: "vitv-systems",
      title: "Voice in the Void: Systems Design",
      category: "game",
      featured: true,
      summary: "Camera, movement and world-interaction systems for a point-and-click sci-fi thriller.",
      tags: ["UE 5.6", "Team of 5", "Systems design"],
      thumb: "images/vitv-cover.jpg",
      meta: meta("Systems designer"),
      related: related("vitv-systems"),
      highlights: [
        "Surveillance cameras that make the player feel watched, with a dead zone that stops jitter when they follow",
        "Click-to-move that stays consistent across camera cuts",
        "Camera trigger zones, and the overlap fix that stopped cameras flipping back and forth",
        "Dialogue trigger zones that pace the story by where the player walks",
        "Minigame-to-level links: rerouting power opens a door and turns on a light",
      ],
      youtube: "H453xrXbhXc", // 完整关卡流程（YouTube 不公开视频）
      sections: [
        intro,
        { type: "divider", label: "Design breakdown" },
        {
          type: "story",
          heading: "Surveillance cameras",
          lead: "The player sees the ship through security cameras, so they feel watched.",
          bullets: [
            "Inspired by the fixed cameras of early Resident Evil.",
            "Supports the core theme: you can't be sure who is on the other end of the radio.",
            "Each shot only needs art for what its camera sees, which saved time for a small team.",
          ],
          problem:
            "Fully fixed cameras showed too little of each room. Letting them turn to follow the player fixed that, but when they turned quickly the view jittered.",
          solution:
            "Added a dead zone: a camera only turns once the player moves a set angle away from the centre of its view.",
          result: "Steady shots that still keep the player in frame.",
          mediaLabel: "camera following the player with a dead zone",
        },
        {
          type: "point",
          heading: "Click-to-move",
          lead: "Click a spot on screen and the character walks there.",
          bullets: [
            "Fits the point-and-click genre and the project brief.",
            "Avoids a classic fixed-camera problem: with direction keys, \"forward\" changes every time the shot cuts.",
            "A click on a destination means the same thing in every shot.",
          ],
          mediaLabel: "click-to-move across a camera cut",
        },
        {
          type: "story",
          heading: "Camera trigger zones",
          lead: "Each camera can own several trigger volumes, placed freely to fit the level.",
          bullets: [
            "Volumes follow the shape of the space, so the right camera takes over from whichever direction the player approaches.",
            "Because they fit the space tightly, nearby areas don't trigger the wrong camera.",
          ],
          problem:
            "Players who click rapidly could land their next click back in the previous zone right after a cut, so the view flipped between two cameras over and over.",
          solution:
            "Overlap neighbouring zones instead of placing them edge to edge, so the player has to walk a short distance before the previous zone can trigger again.",
          result: "The flip-flopping stopped.",
          mediaLabel: "zones edge to edge vs. overlapping",
        },
        {
          type: "point",
          heading: "Dialogue trigger zones",
          lead: "Story beats start when the player walks into specific areas.",
          bullets: ["The narrative is paced by where the player goes, not by menus."],
          mediaLabel: "walking into a dialogue zone",
        },
        {
          type: "point",
          heading: "Minigames that change the level",
          lead: "I designed how minigame choices change the world.",
          bullets: [
            "Why: the project's goal was choices that matter, so a choice has to show up in the world, not just in a text box.",
            "In the power-distribution minigame, how the player routes power changes the level.",
            "A door becomes usable and a light comes on.",
            "The full game wasn't finished, but this proved the chain works from a minigame decision to a visible change in the level.",
          ],
          mediaLabel: "power reroute → door opens, light turns on",
        },
      ],
    },
    {
      id: "vitv-level",
      title: "Voice in the Void: Spaceship Level",
      category: "level",
      featured: true,
      summary: "A claustrophobic research ship built for exploration, environmental clues and fixed-camera framing.",
      tags: ["UE 5.6", "Team of 5", "Level design lead"],
      thumb: "images/vitv-cover.jpg",
      meta: meta("Level design lead"),
      related: related("vitv-level"),
      highlights: [
        "Led level design: documentation, layout, mission flow and in-engine build",
        "Claustrophobic but readable spaceship, referencing Alien",
        "Rooms laid out together with fixed camera angles and their trigger zones",
        "Progress gated by minigame outcomes that visibly change the level",
      ],
      youtube: "H453xrXbhXc", // 完整关卡流程（YouTube 不公开视频）
      sections: [
        intro,
        { type: "divider", label: "Design breakdown" },
        {
          type: "point",
          heading: "Goals",
          lead: "Claustrophobic, but easy to navigate.",
          bullets: [
            "The ship should feel tight and trapped, like the Nostromo in Alien.",
            "Exploration is rewarded with environmental clues that reveal the voice isn't human.",
          ],
          mediaLabel: "level overview / top-down map",
        },
        {
          type: "point",
          heading: "Designing for fixed cameras",
          lead: "Rooms and camera angles were planned together.",
          bullets: [
            "Each shot has to show where the player can go and what they can interact with.",
            "Camera trigger zones are part of the layout itself.",
            "I placed every camera, then tested and tuned each one's dead zone and turn speed individually.",
          ],
          mediaLabel: "camera placement on the level map",
        },
        {
          type: "point",
          heading: "Progress driven by minigames",
          lead: "Minigame outcomes open up the ship.",
          bullets: ["Rerouting power, for example, opens a door and lights up a new area."],
          mediaLabel: "blockout → final",
        },
      ],
    },
    {
      id: "vitv-tech",
      title: "Voice in the Void: Technical Design & Pipelines",
      category: "code",
      featured: true,
      summary: "Turning design ideas into buildable systems, setting up pipelines and helping teammates use them.",
      tags: ["UE 5.6", "Maya", "Team of 5", "Technical design"],
      thumb: "images/vitv-cover.jpg",
      youtube: "H453xrXbhXc",
      meta: meta("Technical designer"),
      related: related("vitv-tech"),
      highlights: [
        "Translated design ideas into system structures for the programmers",
        "Set up an interface-first workflow between designers and programmers",
        "Built a shared-skeleton pipeline so character art and animation fit together",
        "Taught teammates the Unreal ↔ Maya round trip and Blend Spaces",
        "Set naming conventions, and learned from a Git LFS storage problem",
        "Ran user stories, the schedule and weekly task planning",
      ],
      sections: [
        intro,
        { type: "divider", label: "Breakdown" },
        {
          type: "point",
          heading: "Bridging design and programming",
          lead: "Designers define the interface, programmers implement it.",
          bullets: [
            "I translated design ideas into system structures the programmers could build.",
            "For each system, designers defined what goes in, what comes out and which events it fires.",
            "Agreeing on the interface first meant fewer misunderstandings and less rework.",
          ],
          mediaLabel: "system interface diagram",
        },
        {
          type: "point",
          heading: "Character and animation pipeline",
          lead: "One shared skeleton for models and animations.",
          bullets: [
            "Exported Unreal's default character and made its skeleton the shared base.",
            "I built the character model on it; our animator animated on the same skeleton.",
            "Taught the animator the import and export steps: a clean round trip from Unreal to Maya and back.",
          ],
          mediaLabel: "character in Maya and in Unreal",
        },
        {
          type: "point",
          heading: "Teaching Blend Spaces",
          lead: "Animate a walk and a run; Unreal blends the jog in between.",
          bullets: ["Showed teammates how Unreal's Blend Spaces work, so we needed fewer hand-made animations."],
          mediaLabel: "walk → jog → run blend",
        },
        {
          type: "point",
          heading: "Naming conventions and version control",
          lead: "Shared rules for files, and a lesson about tool limits.",
          bullets: [
            "Set naming conventions shared by design and art, so assets were easier to find.",
            "Introduced Git LFS for large files, then hit its free storage limit and removed it, which cost a full day.",
            "Lesson: check a tool's limits against the project's size before the whole team depends on it.",
          ],
        },
        {
          type: "point",
          heading: "Production",
          lead: "Kept the team's work visible and unblocked.",
          bullets: [
            "Maintained the user stories and the schedule.",
            "Each week, reviewed tasks, mapped dependencies and assigned work so blockers surfaced early.",
            "Worked in Scrum, within the limits of a course project.",
          ],
          mediaLabel: "user story board / schedule",
        },
      ],
    },
    {
      id: "vitv-art",
      title: "Voice in the Void: Character Art",
      category: "art",
      featured: true,
      summary: "Game-ready character model and materials built on a shared animation skeleton.",
      tags: ["UE 5.6", "Maya", "Substance 3D Painter"],
      thumb: "images/vitv-cover.jpg",
      heroImage: "images/vitv-cover.jpg", // 之后换成角色渲染图
      heroTitle: "",
      meta: meta("3D character artist"),
      related: related("vitv-art"),
      highlights: [
        "Character models and materials",
        "Built on Unreal's default skeleton to share animations with the team",
        "First character pipeline, coming from an environment art background",
      ],
      sections: [
        intro,
        { type: "divider", label: "Breakdown" },
        {
          type: "point",
          heading: "Character models and materials",
          lead: "My first character pipeline.",
          bullets: [
            "My background is in environment art, so characters were new to me.",
            "Built on Unreal's default skeleton so the model could share animations with the team's work.",
          ],
          mediaLabel: "character turnaround",
        },
        {
          type: "point",
          heading: "Still in progress: hair",
          lead: "Learning a new hair pipeline.",
          bullets: ["The hair isn't finished yet. I'm using it to learn Maya XGen and Houdini."],
        },
      ],
    },
  ];

  window.PROJECTS = pages.concat(window.PROJECTS || []);
})();
