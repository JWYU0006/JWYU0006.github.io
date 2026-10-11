// =====================================================================
// Voice in the Void：一个项目拆成四个页面，互相链接。
// 素材到了以后，在对应页面填上 thumb / clip / youtube，或在 sections 里加图片模块。
// =====================================================================
(function () {
  const intro = {
    type: "text",
    heading: "The game",
    body:
      "Voice in the Void is a point-and-click visual novel. You play an injured scientist with amnesia, trapped on a damaged spaceship " +
      "and guided by a voice on the radio that slowly stops making sense. Instead of picking dialogue options, players make choices " +
      "through what they do in the world.\n\n" +
      "Our team of five built a technical prototype in one semester: every core system works end to end, with limited story content.",
  };

  const meta = (role) => ({
    "My role": role,
    Engine: "Unreal Engine 5.6",
    Team: "5",
    Duration: "One semester",
    Context: "Course project, Sheridan College",
  });

  const pages = [
    {
      id: "vitv-systems",
      title: "Voice in the Void: Systems Design",
      category: "game",
      featured: true,
      summary: "Camera, movement and world-interaction systems for a point-and-click sci-fi thriller.",
      tags: ["UE 5.6", "Team of 5", "Systems design"],
      meta: meta("Systems designer"),
      related: [
        { id: "vitv-level", role: "Level designer" },
        { id: "vitv-tech", role: "Technical designer" },
        { id: "vitv-art", role: "3D character artist" },
      ],
      sections: [
        intro,
        {
          type: "text",
          heading: "What I designed",
          body:
            "I proposed and defined the systems below, and the team adopted them. The minigames themselves were designed by a teammate; " +
            "I designed how they connect to the level.",
        },
        {
          type: "text",
          heading: "Fixed surveillance cameras",
          body:
            "The player sees the ship through fixed cameras, inspired by early Resident Evil. The goal was to make the player feel watched, " +
            "which supports the core theme: you can't be sure who is on the other end of the radio.\n\n" +
            "It also helped production. Each shot only needs art for what that camera can see, which saved time for a small team.",
        },
        {
          type: "text",
          heading: "Click-to-move",
          body:
            "Players click a point on screen and the character walks there. It fits the point-and-click genre, and it avoids a classic " +
            "fixed-camera problem: with direction keys, \"forward\" suddenly points somewhere else every time the shot changes. " +
            "A click on a destination means the same thing in every shot.",
        },
        {
          type: "text",
          heading: "Camera trigger zones",
          body:
            "Each camera owns a trigger zone in the level. When the player enters a zone, the view cuts to that camera.\n\n" +
            "This created a problem. Some players click rapidly, and right after a cut their next click could land back in the " +
            "previous zone, so the view flipped between two cameras over and over.\n\n" +
            "My fix was to overlap neighbouring zones instead of placing them edge to edge. The player now has to walk a short distance " +
            "to fully leave the previous zone before it can trigger again, which removed the flip-flopping.",
        },
        {
          type: "text",
          heading: "Dialogue trigger zones",
          body:
            "Story beats start when the player walks into specific areas, so the narrative is paced by where the player goes rather than by menus.",
        },
        {
          type: "text",
          heading: "Minigames that change the level",
          body:
            "I designed the link between minigames and the world. In the power-distribution minigame, how the player routes power changes " +
            "the level: a door becomes usable and a light comes on.\n\n" +
            "The full game wasn't finished, but these changes proved the whole chain works, from a minigame decision to a visible change in the level.",
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
      meta: meta("Level design lead"),
      related: [
        { id: "vitv-systems", role: "Systems designer" },
        { id: "vitv-tech", role: "Technical designer" },
        { id: "vitv-art", role: "3D character artist" },
      ],
      sections: [
        intro,
        {
          type: "text",
          heading: "My role",
          body:
            "I led level design for the project: I wrote the level design documentation, laid out the spaceship and its mission flow, " +
            "and built the environments in Unreal Engine.",
        },
        {
          type: "text",
          heading: "Goals",
          body:
            "The ship had to feel claustrophobic, like the Nostromo in Alien, while staying easy to navigate. Players should be rewarded " +
            "for exploring: clues in the environment gradually reveal that the voice on the radio isn't human.",
        },
        {
          type: "text",
          heading: "Designing for fixed cameras",
          body:
            "Rooms and camera angles were planned together. Each shot has to show the player where they can go and what they can " +
            "interact with, and the camera trigger zones are part of the layout itself.",
        },
        {
          type: "text",
          heading: "Level changes driven by minigames",
          body:
            "Progress through the ship is tied to minigame outcomes. Rerouting power, for example, opens a door and lights up a new area.",
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
      meta: meta("Technical design, pipelines, production"),
      related: [
        { id: "vitv-systems", role: "Systems designer" },
        { id: "vitv-level", role: "Level designer" },
        { id: "vitv-art", role: "3D character artist" },
      ],
      sections: [
        intro,
        {
          type: "text",
          heading: "Bridging design and programming",
          body:
            "I acted as the team's technical designer. I translated design ideas into system structures the programmers could build, " +
            "and set up a workflow where designers define each system's interface (what goes in, what comes out, which events it fires) " +
            "and programmers implement it. Agreeing on the interface first meant fewer misunderstandings and less rework later.",
        },
        {
          type: "text",
          heading: "Character and animation pipeline",
          body:
            "To keep art and animation compatible, I exported Unreal's default character from the engine and made its skeleton the shared " +
            "base: I built our character model on it, and our animator created animations on the same skeleton.\n\n" +
            "I then taught the animator the import and export steps, and we got a clean round trip from Unreal to Maya and back to Unreal.",
        },
        {
          type: "text",
          heading: "Teaching Blend Spaces",
          body:
            "I showed teammates how Unreal's Blend Spaces work: animate only a walk and a run, and the engine blends the jog in between. " +
            "That cut the number of animations we needed to make.",
        },
        {
          type: "text",
          heading: "Naming conventions and version control",
          body:
            "I set up naming conventions shared by design and art, which made assets easier to find and reduced back-and-forth in the team.\n\n" +
            "I also introduced Git LFS for large files. When we hit the limits of its free storage, I removed it from the project, which " +
            "cost a full day. The lesson: check a tool's limits against the project's size before the whole team depends on it.",
        },
        {
          type: "text",
          heading: "Production",
          body:
            "I maintained the user stories and the schedule. At the start of each week I reviewed tasks, mapped dependencies between them, " +
            "and assigned work so that blocked tasks surfaced early. We followed Scrum within the limits of a course project.",
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
      meta: meta("3D character artist"),
      related: [
        { id: "vitv-systems", role: "Systems designer" },
        { id: "vitv-level", role: "Level designer" },
        { id: "vitv-tech", role: "Technical designer" },
      ],
      sections: [
        intro,
        {
          type: "text",
          heading: "Character models and materials",
          body:
            "I created the character models and materials. My background is in environment art, so this was my first character pipeline. " +
            "I built the model on Unreal's default skeleton so it could share animations with the rest of the team's work.",
        },
        {
          type: "text",
          heading: "Still in progress: hair",
          body:
            "The character's hair isn't finished. I'm using it to learn a new pipeline with Maya XGen and Houdini.",
        },
      ],
    },
  ];

  window.PROJECTS = pages.concat(window.PROJECTS || []);
})();
