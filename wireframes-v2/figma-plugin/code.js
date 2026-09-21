// Figma Plugin: GEC Architecture & Wireframe Generator
// Iteration 2: Rich UI Elements & Auto-Layout Component Canvas

async function run() {
  if (figma.editorType === 'dev') {
    figma.notify("⚠️ You are in Dev Mode! Please switch to Design Mode (press Shift+D or toggle top-right) to create wireframe frames.", { timeout: 6000, error: true });
    figma.closePlugin();
    return;
  }

  figma.notify("⏳ Generating rich GEC wireframe components & layouts in Figma...");

  // 1. Color Palette Definitions
  const c = {
    crimson: { r: 163/255, g: 4/255, b: 15/255 },
    crimsonAct: { r: 198/255, g: 47/255, b: 41/255 },
    gold: { r: 251/255, g: 202/255, b: 5/255 },
    blue: { r: 31/255, g: 126/255, b: 192/255 },
    canvas: { r: 252/255, g: 248/255, b: 237/255 },
    sand: { r: 244/255, g: 226/255, b: 202/255 },
    card: { r: 255/255, g: 253/255, b: 248/255 },
    white: { r: 1, g: 1, b: 1 },
    ink: { r: 34/255, g: 34/255, b: 34/255 },
    inkMuted: { r: 95/255, g: 86/255, b: 80/255 },
    borderSubtle: { r: 163/255, g: 4/255, b: 15/255 }
  };

  // Register Figma Local Paint Styles
  const styleDefs = [
    { name: "Brand/Crimson", color: c.crimson, a: 1 },
    { name: "Brand/Gold Accent", color: c.gold, a: 1 },
    { name: "Brand/Blue Tech", color: c.blue, a: 1 },
    { name: "Surface/Canvas (Cream)", color: c.canvas, a: 1 },
    { name: "Surface/Sand (Warm)", color: c.sand, a: 1 },
    { name: "Surface/Card Elevated", color: c.card, a: 1 },
    { name: "Text/Ink Primary", color: c.ink, a: 1 },
    { name: "Text/Ink Muted", color: c.inkMuted, a: 1 }
  ];

  const paintStyles = {};
  for (const s of styleDefs) {
    let style = figma.getLocalPaintStyles().find(item => item.name === s.name);
    if (!style) {
      style = figma.createPaintStyle();
      style.name = s.name;
    }
    style.paints = [{ type: 'SOLID', color: s.color, opacity: s.a }];
    paintStyles[s.name] = style;
  }

  // 2. Load Fonts
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  } catch (err) {
    figma.notify("Error loading Inter font: " + err);
    figma.closePlugin();
    return;
  }

  // 3. UI Helpers
  function txt(text, fontSize = 14, isBold = false, color = c.ink, width = null) {
    const t = figma.createText();
    t.fontName = { family: "Inter", style: isBold ? "Bold" : "Regular" };
    t.characters = text;
    t.fontSize = fontSize;
    t.fills = [{ type: 'SOLID', color: color }];
    if (width) {
      t.textAutoResize = "HEIGHT";
      t.resize(width, t.height);
    }
    return t;
  }

  function btn(label, isPrimary = true, width = null) {
    const b = figma.createFrame();
    b.name = isPrimary ? "Btn-Primary" : "Btn-Secondary";
    b.layoutMode = "HORIZONTAL";
    b.primaryAxisAlignItems = "CENTER";
    b.counterAxisAlignItems = "CENTER";
    b.paddingLeft = 24;
    b.paddingRight = 24;
    b.paddingTop = 12;
    b.paddingBottom = 12;
    b.cornerRadius = 8;
    b.fills = [{
      type: 'SOLID',
      color: isPrimary ? c.crimson : c.sand
    }];
    if (!isPrimary) {
      b.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.25 }];
      b.strokeWeight = 1;
    }
    const t = txt(label, 14, true, isPrimary ? c.white : c.crimson);
    b.appendChild(t);
    if (width) {
      b.primaryAxisSizingMode = "FIXED";
      b.resize(width, 44);
    } else {
      b.primaryAxisSizingMode = "AUTO";
      b.counterAxisSizingMode = "AUTO";
    }
    return b;
  }

  function badge(label, bgColor = c.sand, textColor = c.crimson) {
    const bd = figma.createFrame();
    bd.name = "Badge";
    bd.layoutMode = "HORIZONTAL";
    bd.primaryAxisAlignItems = "CENTER";
    bd.counterAxisAlignItems = "CENTER";
    bd.paddingLeft = 12;
    bd.paddingRight = 12;
    bd.paddingTop = 4;
    bd.paddingBottom = 4;
    bd.cornerRadius = 20;
    bd.fills = [{ type: 'SOLID', color: bgColor }];
    bd.strokes = [{ type: 'SOLID', color: textColor, opacity: 0.2 }];
    bd.strokeWeight = 1;
    bd.appendChild(txt(label, 11, true, textColor));
    bd.primaryAxisSizingMode = "AUTO";
    bd.counterAxisSizingMode = "AUTO";
    return bd;
  }

  function cardFrame(name, width, minHeight, bgColor = c.card) {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = "VERTICAL";
    f.itemSpacing = 16;
    f.paddingLeft = 28;
    f.paddingRight = 28;
    f.paddingTop = 28;
    f.paddingBottom = 28;
    f.cornerRadius = 14;
    f.fills = [{ type: 'SOLID', color: bgColor }];
    f.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.18 }];
    f.strokeWeight = 1;
    f.resize(width, minHeight);
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "FIXED";
    return f;
  }

  // 4. Section Generators
  function createNavbar() {
    const nav = figma.createFrame();
    nav.name = "Global-Navbar";
    nav.layoutMode = "HORIZONTAL";
    nav.primaryAxisAlignItems = "SPACE_BETWEEN";
    nav.counterAxisAlignItems = "CENTER";
    nav.paddingLeft = 48;
    nav.paddingRight = 48;
    nav.paddingTop = 18;
    nav.paddingBottom = 18;
    nav.resize(1320, 74);
    nav.cornerRadius = 12;
    nav.fills = [{ type: 'SOLID', color: c.card }];
    nav.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.15 }];
    nav.strokeWeight = 1;

    // Logo
    const logoGroup = figma.createFrame();
    logoGroup.layoutMode = "HORIZONTAL";
    logoGroup.itemSpacing = 12;
    logoGroup.counterAxisAlignItems = "CENTER";
    logoGroup.fills = [];
    const logoBadge = badge("GEC", c.crimson, c.white);
    const logoTxt = txt("Galgotias Entrepreneurship Cell", 15, true, c.ink);
    logoGroup.appendChild(logoBadge);
    logoGroup.appendChild(logoTxt);
    logoGroup.primaryAxisSizingMode = "AUTO";
    logoGroup.counterAxisSizingMode = "AUTO";

    // Nav Links
    const links = figma.createFrame();
    links.layoutMode = "HORIZONTAL";
    links.itemSpacing = 28;
    links.counterAxisAlignItems = "CENTER";
    links.fills = [];
    ['Home', 'About', 'Teams', 'Initiatives', 'Stories'].forEach((item, idx) => {
      const link = txt(item, 14, idx === 0, idx === 0 ? c.crimson : c.inkMuted);
      links.appendChild(link);
    });
    links.primaryAxisSizingMode = "AUTO";
    links.counterAxisSizingMode = "AUTO";

    // Action CTA
    const joinBtn = btn("Join Cohort '26", true);

    nav.appendChild(logoGroup);
    nav.appendChild(links);
    nav.appendChild(joinBtn);
    return nav;
  }

  function createHero() {
    const hero = figma.createFrame();
    hero.name = "Hero-Split-Section";
    hero.layoutMode = "HORIZONTAL";
    hero.itemSpacing = 40;
    hero.paddingTop = 48;
    hero.paddingBottom = 48;
    hero.resize(1320, 520);
    hero.fills = [];
    hero.primaryAxisSizingMode = "AUTO";
    hero.counterAxisSizingMode = "AUTO";

    // Left Column (7-Col Split ~760px)
    const left = figma.createFrame();
    left.name = "Hero-Left-Column";
    left.layoutMode = "VERTICAL";
    left.itemSpacing = 20;
    left.resize(740, 480);
    left.fills = [];
    left.primaryAxisSizingMode = "AUTO";
    left.counterAxisSizingMode = "FIXED";

    left.appendChild(badge("● GALGOTIAS ENTREPRENEURSHIP CELL • EST. 2018", c.sand, c.crimson));
    left.appendChild(txt("Empowering Student Founders to Build High-Consequence Ventures", 42, true, c.ink, 740));
    left.appendChild(txt("The official student-led innovation and incubation hub of Galgotias University. Ideate, prototype, and secure institutional seed capital with guidance from leading industry angels.", 16, false, c.inkMuted, 700));

    const ctaRow = figma.createFrame();
    ctaRow.layoutMode = "HORIZONTAL";
    ctaRow.itemSpacing = 16;
    ctaRow.fills = [];
    ctaRow.primaryAxisSizingMode = "AUTO";
    ctaRow.counterAxisSizingMode = "AUTO";
    ctaRow.appendChild(btn("Explore Ecosystem", true));
    ctaRow.appendChild(btn("Pitch Deck Submission", false));
    left.appendChild(ctaRow);

    const metricsPreview = txt("★ ₹2.4 Cr+ Capital Facilitated  •  42+ Incubated Ventures  •  35+ VC Partners", 13, true, c.crimson);
    left.appendChild(metricsPreview);

    // Right Column (5-Col Split ~520px)
    const rightCard = cardFrame("Hero-Visual-Bento", 520, 420, c.card);
    rightCard.appendChild(badge("COHORT IV • APPLICATION LIVE", c.crimson, c.white));
    rightCard.appendChild(txt("Galgotias Seed Grant & Incubation Track", 22, true, c.ink, 460));
    rightCard.appendChild(txt("Selected teams receive ₹50,000 equity-free prototype grants, cloud credits, legal incorporation assistance, and investor demo day access.", 14, false, c.inkMuted, 460));

    const steps = [
      "✔  Phase 1: Problem Validation & Market Sizing",
      "✔  Phase 2: MVP Sprint & Architecture Review",
      "⏳  Phase 3: Closed Demo Day to 35+ Angels"
    ];
    for (const s of steps) {
      const stepRow = figma.createFrame();
      stepRow.layoutMode = "HORIZONTAL";
      stepRow.paddingLeft = 14;
      stepRow.paddingRight = 14;
      stepRow.paddingTop = 10;
      stepRow.paddingBottom = 10;
      stepRow.cornerRadius = 8;
      stepRow.fills = [{ type: 'SOLID', color: c.canvas }];
      stepRow.resize(460, 40);
      stepRow.appendChild(txt(s, 13, true, c.ink));
      stepRow.primaryAxisSizingMode = "AUTO";
      stepRow.counterAxisSizingMode = "AUTO";
      rightCard.appendChild(stepRow);
    }
    rightCard.appendChild(btn("Apply Before Oct 15 →", true, 460));

    hero.appendChild(left);
    hero.appendChild(rightCard);
    return hero;
  }

  function createStatsBar() {
    const bar = figma.createFrame();
    bar.name = "Live-Stats-Bar";
    bar.layoutMode = "HORIZONTAL";
    bar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bar.itemSpacing = 20;
    bar.paddingLeft = 32;
    bar.paddingRight = 32;
    bar.paddingTop = 28;
    bar.paddingBottom = 28;
    bar.resize(1320, 130);
    bar.cornerRadius = 14;
    bar.fills = [{ type: 'SOLID', color: c.sand }];
    bar.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.15 }];
    bar.strokeWeight = 1;

    const stats = [
      { val: "₹2.4 Cr+", label: "Total Capital Facilitated" },
      { val: "42+", label: "Incubated Startups" },
      { val: "18,000+", label: "Students Reached" },
      { val: "35+", label: "Angel & VC Partners" }
    ];

    for (const st of stats) {
      const col = figma.createFrame();
      col.layoutMode = "VERTICAL";
      col.itemSpacing = 4;
      col.fills = [];
      col.resize(280, 70);
      col.primaryAxisSizingMode = "AUTO";
      col.counterAxisSizingMode = "FIXED";
      col.appendChild(txt(st.val, 28, true, c.crimson));
      col.appendChild(txt(st.label, 13, false, c.inkMuted));
      bar.appendChild(col);
    }
    return bar;
  }

  function createBentoGrid() {
    const bentoContainer = figma.createFrame();
    bentoContainer.name = "Whats-Happening-Bento";
    bentoContainer.layoutMode = "VERTICAL";
    bentoContainer.itemSpacing = 24;
    bentoContainer.resize(1320, 560);
    bentoContainer.fills = [];
    bentoContainer.primaryAxisSizingMode = "AUTO";
    bentoContainer.counterAxisSizingMode = "FIXED";

    // Section Header
    const head = figma.createFrame();
    head.layoutMode = "VERTICAL";
    head.itemSpacing = 6;
    head.fills = [];
    head.resize(1320, 60);
    head.primaryAxisSizingMode = "AUTO";
    head.appendChild(badge("ECOSYSTEM PULSE", c.sand, c.crimson));
    head.appendChild(txt("What's Happening in the Ecosystem", 28, true, c.ink));
    bentoContainer.appendChild(head);

    // Row 1 (Asymmetric 60/40)
    const row1 = figma.createFrame();
    row1.layoutMode = "HORIZONTAL";
    row1.itemSpacing = 24;
    row1.fills = [];
    row1.resize(1320, 220);
    row1.primaryAxisSizingMode = "AUTO";
    row1.counterAxisSizingMode = "AUTO";

    const c1 = cardFrame("Bento-1-ESummit", 760, 200, c.card);
    c1.appendChild(badge("FLAGSHIP EVENT • NOV 2026", c.crimson, c.white));
    c1.appendChild(txt("E-Summit '26: India's Largest Student Entrepreneurship Conclave", 20, true, c.ink, 700));
    c1.appendChild(txt("3 Days • 2,500+ Attendees • 50+ Startup Pitches • ₹5,00,000 Prize Pool with keynote speakers from top unicorns.", 14, false, c.inkMuted, 700));
    row1.appendChild(c1);

    const c2 = cardFrame("Bento-2-VentureStudio", 536, 200, c.card);
    c2.appendChild(badge("PROTOTYPING LAB", c.sand, c.crimson));
    c2.appendChild(txt("Venture Prototyping Studio", 18, true, c.ink, 480));
    c2.appendChild(txt("Dedicated hardware teardown benches, high-performance GPU nodes, and AWS credits for student founders.", 13, false, c.inkMuted, 480));
    row1.appendChild(c2);

    bentoContainer.appendChild(row1);

    // Row 2 (3 Columns)
    const row2 = figma.createFrame();
    row2.layoutMode = "HORIZONTAL";
    row2.itemSpacing = 24;
    row2.fills = [];
    row2.resize(1320, 180);
    row2.primaryAxisSizingMode = "AUTO";
    row2.counterAxisSizingMode = "AUTO";

    const items = [
      { tag: "CAPITAL", title: "Institutional Seed Grants", desc: "Equity-free prototyping grants up to ₹10 Lakhs through university fund." },
      { tag: "MENTORSHIP", title: "Founder-in-Residence", desc: "1-on-1 weekly sprint office hours with YC & Techstars alumni." },
      { tag: "NETWORK", title: "Corporate Syndicate", desc: "Direct enterprise pilot programs with 18+ Fortune 500 partners." }
    ];

    for (const it of items) {
      const cItem = cardFrame(`Bento-${it.tag}`, 424, 160, c.card);
      cItem.appendChild(badge(it.tag, c.sand, c.crimson));
      cItem.appendChild(txt(it.title, 16, true, c.ink, 370));
      cItem.appendChild(txt(it.desc, 13, false, c.inkMuted, 370));
      row2.appendChild(cItem);
    }

    bentoContainer.appendChild(row2);
    return bentoContainer;
  }

  function createPillarsSection() {
    const sec = figma.createFrame();
    sec.name = "Pillars-And-Heritage";
    sec.layoutMode = "VERTICAL";
    sec.itemSpacing = 24;
    sec.resize(1320, 480);
    sec.fills = [];
    sec.primaryAxisSizingMode = "AUTO";
    sec.counterAxisSizingMode = "FIXED";

    sec.appendChild(badge("FOUNDATIONAL ARCHITECTURE", c.sand, c.crimson));
    sec.appendChild(txt("The Four Pillars of Galgotias E-Cell", 28, true, c.ink));

    const grid = figma.createFrame();
    grid.layoutMode = "HORIZONTAL";
    grid.itemSpacing = 24;
    grid.fills = [];
    grid.resize(1320, 320);
    grid.primaryAxisSizingMode = "AUTO";
    grid.counterAxisSizingMode = "AUTO";

    const pillars = [
      { num: "01", title: "Incubation & Sprints", text: "Structured 12-week venture validation sprints taking raw student hypotheses to MVP and revenue." },
      { num: "02", title: "Capital Deployment", text: "Connecting early student prototypes directly to seed angels, micro-VCs, and state innovation grants." },
      { num: "03", title: "Operator Mentorship", text: "Tactical masterclasses taught by founders who have scaled past Series A, not theoretical lectures." },
      { num: "04", title: "Venture Culture", text: "Fostering an unapologetic campus culture of rapid shipping, peer critique, and radical ownership." }
    ];

    for (const p of pillars) {
      const pCard = cardFrame(`Pillar-${p.num}`, 306, 280, c.card);
      pCard.appendChild(txt(p.num, 32, true, c.crimson));
      pCard.appendChild(txt(p.title, 18, true, c.ink, 250));
      pCard.appendChild(txt(p.text, 13, false, c.inkMuted, 250));
      grid.appendChild(pCard);
    }

    sec.appendChild(grid);
    return sec;
  }

  // 4.3. Team Stage Manager & 7-Team System
  const gecTeams = [
    { id: "01", name: "Startup Development", color: c.gold, hex: "#FBCA05", tag: "role-gold", areas: ["Idea Discovery", "Venture Building", "Founder Relations", "Pitching", "Mentorship", "Ecosystem"] },
    { id: "02", name: "PR & Networking", color: c.crimson, hex: "#A3040F", tag: "role-crimson", areas: ["External Relations", "Speaker Outreach", "Partnerships", "Networking", "Collaborations", "Ecosystem"] },
    { id: "03", name: "Marketing & CA", color: { r: 249/255, g: 115/255, b: 22/255 }, hex: "#F97316", tag: "role-orange", areas: ["Campus Marketing", "Campaign Strategy", "Community Growth", "Ambassadors", "Promotions", "Engagement"] },
    { id: "04", name: "Event Management", color: { r: 112/255, g: 26/255, b: 36/255 }, hex: "#701A24", tag: "role-burgundy", areas: ["Event Planning", "Venues", "Participants", "Operations", "Logistics", "On-Ground Exec"] },
    { id: "05", name: "Digital Media", color: c.blue, hex: "#1F7EC0", tag: "role-blue", areas: ["Social Media", "Campaigns", "Content", "Photo & Video", "Promotions", "Storytelling"] },
    { id: "06", name: "Technical Team", color: { r: 51/255, g: 65/255, b: 85/255 }, hex: "#334155", tag: "role-charcoal", areas: ["Web Development", "Infrastructure", "Internal Tools", "Technical Support", "Event Tech", "Product Lab"] },
    { id: "07", name: "Career Connect", color: { r: 133/255, g: 77/255, b: 14/255 }, hex: "#854D0E", tag: "role-amber", areas: ["Internships", "Career Exposure", "Startup Hiring", "Industry Bridge", "Opportunities", "Talent Ops"] }
  ];

  function createTeamStageManager() {
    const sec = figma.createFrame();
    sec.name = "Teams-Stage-Manager-Section";
    sec.layoutMode = "VERTICAL";
    sec.itemSpacing = 28;
    sec.resize(1320, 1180);
    sec.fills = [];
    sec.primaryAxisSizingMode = "AUTO";
    sec.counterAxisSizingMode = "FIXED";

    // Header 3.1: Teams Hero & Quick Jumper
    const heroCard = figma.createFrame();
    heroCard.name = "3.1-Teams-Hero-And-Quick-Jump";
    heroCard.layoutMode = "VERTICAL";
    heroCard.itemSpacing = 16;
    heroCard.primaryAxisAlignItems = "CENTER";
    heroCard.counterAxisAlignItems = "CENTER";
    heroCard.paddingLeft = 32;
    heroCard.paddingRight = 32;
    heroCard.paddingTop = 28;
    heroCard.paddingBottom = 28;
    heroCard.resize(1320, 190);
    heroCard.cornerRadius = 14;
    heroCard.fills = [{ type: 'SOLID', color: c.card }];
    heroCard.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.15 }];
    heroCard.strokeWeight = 1;

    heroCard.appendChild(badge("THE ENGINE OF GEC • SECTION 3.1", c.sand, c.crimson));
    heroCard.appendChild(txt("7 Teams. One Shared Vision.", 30, true, c.ink));
    heroCard.appendChild(txt("The operational core behind India's fastest rising student entrepreneurial movement.", 14, false, c.inkMuted));

    // 7 Quick Jump Filter Pills
    const filterRow = figma.createFrame();
    filterRow.name = "7-Team-Quick-Jump-Pills";
    filterRow.layoutMode = "HORIZONTAL";
    filterRow.itemSpacing = 8;
    filterRow.fills = [];
    filterRow.primaryAxisSizingMode = "AUTO";
    filterRow.counterAxisSizingMode = "AUTO";

    gecTeams.forEach((tm, i) => {
      filterRow.appendChild(badge(`${tm.id}. ${tm.name}`, i === 0 ? c.crimson : c.canvas, i === 0 ? c.white : c.ink));
    });
    heroCard.appendChild(filterRow);
    sec.appendChild(heroCard);

    // Header 3.2: Animation Storyboard Timing Bar
    const storyboard = figma.createFrame();
    storyboard.name = "3.2-Stage-Manager-Storyboard-Ribbon";
    storyboard.layoutMode = "HORIZONTAL";
    storyboard.primaryAxisAlignItems = "SPACE_BETWEEN";
    storyboard.counterAxisAlignItems = "CENTER";
    storyboard.paddingLeft = 24;
    storyboard.paddingRight = 24;
    storyboard.paddingTop = 10;
    storyboard.paddingBottom = 10;
    storyboard.resize(1320, 48);
    storyboard.cornerRadius = 8;
    storyboard.fills = [{ type: 'SOLID', color: c.card }];
    storyboard.strokes = [{ type: 'SOLID', color: c.ink, opacity: 0.18 }];
    storyboard.strokeWeight = 1;

    const stepsRow = figma.createFrame();
    stepsRow.layoutMode = "HORIZONTAL";
    stepsRow.itemSpacing = 8;
    stepsRow.fills = [];
    stepsRow.primaryAxisSizingMode = "AUTO";
    stepsRow.counterAxisSizingMode = "AUTO";

    ['01 · SELECT · 0-120MS', '02 · SPATIAL SWAP · 100-450MS', '03 · CONTENT REVEAL · 300-600MS', 'SPRING · 250 / 28 / 0.9'].forEach(step => {
      stepsRow.appendChild(badge(step, c.sand, c.ink));
    });
    storyboard.appendChild(stepsRow);

    const statusBadge = badge("STATE · 01 ACTIVE · DETAIL CANVAS", c.crimson, c.white);
    storyboard.appendChild(statusBadge);
    sec.appendChild(storyboard);

    // Split Stage Manager: Left Rail (240px) + Right Active Canvas (1048px)
    const stageSplit = figma.createFrame();
    stageSplit.name = "Stage-Manager-Active-Split-View";
    stageSplit.layoutMode = "HORIZONTAL";
    stageSplit.itemSpacing = 32;
    stageSplit.resize(1320, 860);
    stageSplit.fills = [];
    stageSplit.primaryAxisSizingMode = "AUTO";
    stageSplit.counterAxisSizingMode = "AUTO";

    // LEFT RAIL: The 7 Teams Stack (Rotated Rail)
    const leftRail = figma.createFrame();
    leftRail.name = "Left-Rail-7-Teams-Stack";
    leftRail.layoutMode = "VERTICAL";
    leftRail.itemSpacing = 10;
    leftRail.resize(240, 840);
    leftRail.fills = [];
    leftRail.primaryAxisSizingMode = "AUTO";
    leftRail.counterAxisSizingMode = "FIXED";

    gecTeams.forEach((tm, idx) => {
      const isSelected = idx === 0;
      const railCard = figma.createFrame();
      railCard.name = `Rail-Card-${tm.id}-${tm.name}`;
      railCard.layoutMode = "HORIZONTAL";
      railCard.itemSpacing = 12;
      railCard.counterAxisAlignItems = "CENTER";
      railCard.paddingLeft = 14;
      railCard.paddingRight = 14;
      railCard.paddingTop = 14;
      railCard.paddingBottom = 14;
      railCard.cornerRadius = 10;
      railCard.resize(240, 68);
      railCard.fills = [{ type: 'SOLID', color: isSelected ? c.sand : c.card }];
      railCard.strokes = [{ type: 'SOLID', color: isSelected ? c.crimson : c.crimson, opacity: isSelected ? 1 : 0.15 }];
      railCard.strokeWeight = isSelected ? 2 : 1;

      railCard.appendChild(txt(tm.id, 20, true, isSelected ? c.crimson : c.inkMuted));

      const col = figma.createFrame();
      col.layoutMode = "VERTICAL";
      col.itemSpacing = 2;
      col.fills = [];
      col.primaryAxisSizingMode = "AUTO";
      col.counterAxisSizingMode = "AUTO";
      col.appendChild(txt(`TEAM ${tm.id}`, 10, true, isSelected ? c.crimson : c.inkMuted));
      col.appendChild(txt(tm.name, 12, true, c.ink));
      railCard.appendChild(col);

      leftRail.appendChild(railCard);
    });
    stageSplit.appendChild(leftRail);

    // RIGHT CANVAS: Active Team Detail Sub-Canvas Blueprint
    const rightCanvas = figma.createFrame();
    rightCanvas.name = "Right-Active-Team-Detail-Blueprint";
    rightCanvas.layoutMode = "VERTICAL";
    rightCanvas.itemSpacing = 20;
    rightCanvas.paddingLeft = 32;
    rightCanvas.paddingRight = 32;
    rightCanvas.paddingTop = 28;
    rightCanvas.paddingBottom = 32;
    rightCanvas.resize(1048, 840);
    rightCanvas.cornerRadius = 14;
    rightCanvas.fills = [{ type: 'SOLID', color: c.card }];
    rightCanvas.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.18 }];
    rightCanvas.strokeWeight = 1;
    rightCanvas.primaryAxisSizingMode = "AUTO";
    rightCanvas.counterAxisSizingMode = "FIXED";

    // Blueprint Toolbar
    const bpToolbar = figma.createFrame();
    bpToolbar.layoutMode = "HORIZONTAL";
    bpToolbar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bpToolbar.counterAxisAlignItems = "CENTER";
    bpToolbar.resize(984, 32);
    bpToolbar.fills = [];
    bpToolbar.appendChild(badge("[TEAM DETAIL SUB-PAGE BLUEPRINT • SITEMAP §5 & §6]", c.sand, c.crimson));
    bpToolbar.appendChild(txt("Route: /teams/startup-development", 12, true, c.blue));
    rightCanvas.appendChild(bpToolbar);

    // Active Team Hero Card
    const activeHero = figma.createFrame();
    activeHero.layoutMode = "VERTICAL";
    activeHero.itemSpacing = 8;
    activeHero.resize(984, 86);
    activeHero.fills = [];
    activeHero.primaryAxisSizingMode = "AUTO";
    activeHero.appendChild(badge("ACTIVE SELECTION • TEAM 01", c.gold, c.ink));
    activeHero.appendChild(txt("01. STARTUP DEVELOPMENT & INCUBATION", 24, true, c.crimson));
    activeHero.appendChild(txt("Fostering student ventures from raw idea to market validation through structured cohorts, incubation alignment with GICRISE, and founder support networks.", 14, false, c.inkMuted, 960));
    rightCanvas.appendChild(activeHero);

    // 6 Responsibilities Matrix (3x2 grid)
    rightCanvas.appendChild(txt("WHAT WE OWN: 6 RESPONSIBILITIES MATRIX", 12, true, c.inkMuted));

    const respGrid = figma.createFrame();
    respGrid.layoutMode = "VERTICAL";
    respGrid.itemSpacing = 12;
    respGrid.resize(984, 172);
    respGrid.fills = [];
    respGrid.primaryAxisSizingMode = "AUTO";

    const respRows = [
      [
        { num: "01. Idea Discovery", desc: "Campus-wide problem ideation workshops & hack sprints" },
        { num: "02. Venture Building", desc: "Rapid prototype & proof-of-concept testing cohorts" },
        { num: "03. Founder Relations", desc: "Continuous milestone reviews, grants & founder support" }
      ],
      [
        { num: "04. Pitching", desc: "Pitch decks, closed demo days, and VC pitch coaching" },
        { num: "05. Mentorship", desc: "Pairing student teams with unicorn alumni & seed angels" },
        { num: "06. Ecosystem", desc: "Direct venture pipeline integration into GICRISE" }
      ]
    ];

    respRows.forEach(rowItems => {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.itemSpacing = 12;
      row.resize(984, 76);
      row.fills = [];
      row.primaryAxisSizingMode = "AUTO";
      row.counterAxisSizingMode = "AUTO";

      rowItems.forEach(it => {
        const itemCard = figma.createFrame();
        itemCard.layoutMode = "VERTICAL";
        itemCard.itemSpacing = 4;
        itemCard.paddingLeft = 16;
        itemCard.paddingRight = 16;
        itemCard.paddingTop = 12;
        itemCard.paddingBottom = 12;
        itemCard.cornerRadius = 8;
        itemCard.resize(320, 72);
        itemCard.fills = [{ type: 'SOLID', color: c.canvas }];
        itemCard.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.12 }];
        itemCard.strokeWeight = 1;
        itemCard.appendChild(txt(it.num, 13, true, c.crimson));
        itemCard.appendChild(txt(it.desc, 11, false, c.inkMuted));
        row.appendChild(itemCard);
      });
      respGrid.appendChild(row);
    });
    rightCanvas.appendChild(respGrid);

    // Leadership & Team Roster Matrix
    const rosterSplit = figma.createFrame();
    rosterSplit.layoutMode = "HORIZONTAL";
    rosterSplit.itemSpacing = 16;
    rosterSplit.resize(984, 140);
    rosterSplit.fills = [];
    rosterSplit.primaryAxisSizingMode = "AUTO";
    rosterSplit.counterAxisSizingMode = "AUTO";

    // Current Head Profile
    const headCard = figma.createFrame();
    headCard.layoutMode = "VERTICAL";
    headCard.primaryAxisAlignItems = "CENTER";
    headCard.counterAxisAlignItems = "CENTER";
    headCard.itemSpacing = 6;
    headCard.paddingLeft = 18;
    headCard.paddingRight = 18;
    headCard.paddingTop = 14;
    headCard.paddingBottom = 14;
    headCard.cornerRadius = 10;
    headCard.resize(260, 136);
    headCard.fills = [{ type: 'SOLID', color: c.sand }];
    headCard.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.2 }];
    headCard.strokeWeight = 1;

    const headAvatar = figma.createEllipse();
    headAvatar.resize(44, 44);
    headAvatar.fills = [{ type: 'SOLID', color: c.card }];
    headAvatar.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.3 }];
    headAvatar.strokeWeight = 2;
    headCard.appendChild(headAvatar);
    headCard.appendChild(txt("Aarav Sharma", 14, true, c.ink));
    headCard.appendChild(txt("Lead · Startup Development", 11, true, c.crimson));
    rosterSplit.appendChild(headCard);

    // Coordinators & Associates Chips
    const membersCard = figma.createFrame();
    membersCard.layoutMode = "VERTICAL";
    membersCard.itemSpacing = 10;
    membersCard.paddingLeft = 20;
    membersCard.paddingRight = 20;
    membersCard.paddingTop = 14;
    membersCard.paddingBottom = 14;
    membersCard.cornerRadius = 10;
    membersCard.resize(708, 136);
    membersCard.fills = [{ type: 'SOLID', color: c.canvas }];
    membersCard.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.12 }];
    membersCard.strokeWeight = 1;

    membersCard.appendChild(txt("TEAM HIERARCHY: 4 COORDINATORS & 8 ASSOCIATES", 11, true, c.inkMuted));

    const avatarRow = figma.createFrame();
    avatarRow.layoutMode = "HORIZONTAL";
    avatarRow.itemSpacing = 10;
    avatarRow.fills = [];
    avatarRow.primaryAxisSizingMode = "AUTO";
    avatarRow.counterAxisSizingMode = "AUTO";

    ['COORD', 'COORD', 'MEM', 'MEM', 'MEM', 'MEM', 'MEM', 'MEM'].forEach(role => {
      const chipAvatar = figma.createFrame();
      chipAvatar.layoutMode = "HORIZONTAL";
      chipAvatar.primaryAxisAlignItems = "CENTER";
      chipAvatar.counterAxisAlignItems = "CENTER";
      chipAvatar.resize(40, 40);
      chipAvatar.cornerRadius = 20;
      chipAvatar.fills = [{ type: 'SOLID', color: role === 'COORD' ? c.sand : c.card }];
      chipAvatar.strokes = [{ type: 'SOLID', color: c.crimson, opacity: 0.2 }];
      chipAvatar.strokeWeight = 1;
      chipAvatar.appendChild(txt(role, 8, true, c.crimson));
      avatarRow.appendChild(chipAvatar);
    });
    membersCard.appendChild(avatarRow);
    rosterSplit.appendChild(membersCard);
    rightCanvas.appendChild(rosterSplit);

    // Bottom Action Row: Gallery + Join CTA
    const bottomRow = figma.createFrame();
    bottomRow.layoutMode = "HORIZONTAL";
    bottomRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    bottomRow.counterAxisAlignItems = "CENTER";
    bottomRow.resize(984, 52);
    bottomRow.fills = [];
    bottomRow.appendChild(badge("BEHIND THE SCENES: 4 TILES CONNECTED", c.sand, c.inkMuted));
    bottomRow.appendChild(btn("Apply to Startup Development Team →", true, 340));
    rightCanvas.appendChild(bottomRow);

    stageSplit.appendChild(rightCanvas);
    sec.appendChild(stageSplit);

    return sec;
  }

  function createInitiativesSection() {
    const sec = figma.createFrame();
    sec.name = "Initiatives-Grid";
    sec.layoutMode = "VERTICAL";
    sec.itemSpacing = 24;
    sec.resize(1320, 480);
    sec.fills = [];
    sec.primaryAxisSizingMode = "AUTO";
    sec.counterAxisSizingMode = "FIXED";

    sec.appendChild(badge("VENTURE ACCELERATORS", c.sand, c.crimson));
    sec.appendChild(txt("Flagship Competitions & Funding Tracks", 28, true, c.ink));

    const grid = figma.createFrame();
    grid.layoutMode = "HORIZONTAL";
    grid.itemSpacing = 24;
    grid.fills = [];
    grid.resize(1320, 320);
    grid.primaryAxisSizingMode = "AUTO";
    grid.counterAxisSizingMode = "AUTO";

    const inits = [
      { title: "Galgotias PitchFest", tag: "₹2,50,000 GRANT", date: "Quarterly Cycle", desc: "Shark Tank style live pitching session before angel investors and alumni partners." },
      { title: "Build-a-Thon 48H", tag: "HARDWARE & AI", date: "Semi-Annual", desc: "Intensive 48-hour continuous product sprint with mentor code audits." },
      { title: "Founder AMA Series", tag: "KNOWLEDGE", date: "Bi-Weekly", desc: "Closed-door interactive sessions with prominent unicorn founders." }
    ];

    for (const init of inits) {
      const card = cardFrame(`Init-${init.title}`, 424, 280, c.card);
      card.appendChild(badge(init.tag, c.crimson, c.white));
      card.appendChild(txt(init.title, 20, true, c.ink, 360));
      card.appendChild(txt(`Schedule: ${init.date}`, 12, true, c.crimson));
      card.appendChild(txt(init.desc, 14, false, c.inkMuted, 360));
      card.appendChild(btn("Register Venture →", true, 360));
      grid.appendChild(card);
    }

    sec.appendChild(grid);
    return sec;
  }

  function createStoriesSection() {
    const sec = figma.createFrame();
    sec.name = "Founder-Stories-Section";
    sec.layoutMode = "VERTICAL";
    sec.itemSpacing = 24;
    sec.resize(1320, 480);
    sec.fills = [];
    sec.primaryAxisSizingMode = "AUTO";
    sec.counterAxisSizingMode = "FIXED";

    sec.appendChild(badge("ALUMNI PORTFOLIO", c.sand, c.crimson));
    sec.appendChild(txt("Venture Spotlight & Founder Voices", 28, true, c.ink));

    const lead = cardFrame("Story-Lead-Card", 1320, 240, c.sand);
    lead.appendChild(badge("VALUATION: ₹14 CR • SEED STAGE", c.crimson, c.white));
    lead.appendChild(txt("\"GEC gave us our first ₹50,000 prototype check when no one believed university students could build enterprise logistics AI.\"", 22, true, c.ink, 1200));
    lead.appendChild(txt("— Tanmay Verma & Rishabh Shah, Co-founders at FleetMatrix (Class of 2024)", 15, true, c.crimson));
    lead.appendChild(btn("Read Case Study & Architecture Breakdown ↗", false, 380));
    sec.appendChild(lead);

    return sec;
  }

  function createFooter() {
    const foot = figma.createFrame();
    foot.name = "Global-Footer";
    foot.layoutMode = "HORIZONTAL";
    foot.primaryAxisAlignItems = "SPACE_BETWEEN";
    foot.itemSpacing = 40;
    foot.paddingLeft = 60;
    foot.paddingRight = 60;
    foot.paddingTop = 48;
    foot.paddingBottom = 48;
    foot.resize(1320, 240);
    foot.cornerRadius = 14;
    foot.fills = [{ type: 'SOLID', color: c.ink }];

    // Brand Col
    const col1 = figma.createFrame();
    col1.layoutMode = "VERTICAL";
    col1.itemSpacing = 12;
    col1.resize(380, 160);
    col1.fills = [];
    col1.primaryAxisSizingMode = "AUTO";
    col1.appendChild(txt("Galgotias Entrepreneurship Cell", 18, true, c.white));
    col1.appendChild(txt("Igniting high-velocity student enterprise at Galgotias University, Greater Noida, Uttar Pradesh.", 13, false, { r: 180/255, g: 180/255, b: 180/255 }, 360));
    col1.appendChild(txt("© 2026 GEC. Open Semantic Architecture.", 12, false, { r: 140/255, g: 140/255, b: 140/255 }));
    foot.appendChild(col1);

    // Nav Col
    const col2 = figma.createFrame();
    col2.layoutMode = "VERTICAL";
    col2.itemSpacing = 8;
    col2.resize(220, 160);
    col2.fills = [];
    col2.primaryAxisSizingMode = "AUTO";
    col2.appendChild(txt("Ecosystem", 14, true, c.gold));
    ['Incubation Pipeline', 'Seed Grant Protocol', 'E-Summit Portal', 'Venture Directory'].forEach(t => {
      col2.appendChild(txt(t, 13, false, { r: 210/255, g: 210/255, b: 210/255 }));
    });
    foot.appendChild(col2);

    // CTA Newsletter Col
    const col3 = figma.createFrame();
    col3.layoutMode = "VERTICAL";
    col3.itemSpacing = 12;
    col3.resize(360, 160);
    col3.fills = [];
    col3.primaryAxisSizingMode = "AUTO";
    col3.appendChild(txt("Stay in the Loop", 14, true, c.gold));
    col3.appendChild(txt("Get weekly deal-flow alerts and event invites.", 13, false, { r: 210/255, g: 210/255, b: 210/255 }));
    col3.appendChild(btn("Subscribe to Dispatch →", true, 260));
    foot.appendChild(col3);

    return foot;
  }

  function createTeamRosterGrid() {
    const sec = figma.createFrame();
    sec.name = "Teams-Full-Roster-Grid-Section";
    sec.layoutMode = "VERTICAL";
    sec.itemSpacing = 24;
    sec.resize(1320, 840);
    sec.fills = [];
    sec.primaryAxisSizingMode = "AUTO";
    sec.counterAxisSizingMode = "FIXED";

    sec.appendChild(badge("STATE A: 7 TEAMS ROSTER (INITIAL BROWSE STATE)", c.sand, c.crimson));
    sec.appendChild(txt("All 7 Organizational Verticals & Responsibility Areas", 26, true, c.ink));

    // Row 1 (4 teams)
    const row1 = figma.createFrame();
    row1.layoutMode = "HORIZONTAL";
    row1.itemSpacing = 16;
    row1.resize(1320, 360);
    row1.fills = [];
    row1.primaryAxisSizingMode = "AUTO";
    row1.counterAxisSizingMode = "AUTO";

    // Row 2 (3 teams)
    const row2 = figma.createFrame();
    row2.layoutMode = "HORIZONTAL";
    row2.itemSpacing = 16;
    row2.resize(1320, 360);
    row2.fills = [];
    row2.primaryAxisSizingMode = "AUTO";
    row2.counterAxisSizingMode = "AUTO";

    gecTeams.forEach((tm, idx) => {
      const card = cardFrame(`Team-Card-${tm.id}`, idx < 4 ? 318 : 429, 340, c.card);
      card.appendChild(txt(tm.id, 32, true, c.crimson));
      card.appendChild(badge(`[TEAM ${tm.id}: ${tm.name.toUpperCase()}]`, c.sand, c.crimson));
      
      const chipsContainer = figma.createFrame();
      chipsContainer.layoutMode = "VERTICAL";
      chipsContainer.itemSpacing = 6;
      chipsContainer.fills = [];
      chipsContainer.primaryAxisSizingMode = "AUTO";
      chipsContainer.counterAxisSizingMode = "AUTO";

      tm.areas.slice(0, 4).forEach(area => {
        chipsContainer.appendChild(badge(`• ${area}`, c.canvas, c.inkMuted));
      });
      card.appendChild(chipsContainer);

      card.appendChild(btn("Explore Team →", false, idx < 4 ? 260 : 370));

      if (idx < 4) {
        row1.appendChild(card);
      } else {
        row2.appendChild(card);
      }
    });

    sec.appendChild(row1);
    sec.appendChild(row2);
    return sec;
  }

  // 5. Build Complete Page Artboards
  const pagesConfig = [
    {
      title: "01 — GEC Home Canvas",
      build: (artboard) => {
        artboard.appendChild(createNavbar());
        artboard.appendChild(createHero());
        artboard.appendChild(createStatsBar());
        artboard.appendChild(createBentoGrid());
        artboard.appendChild(createInitiativesSection());
        artboard.appendChild(createStoriesSection());
        artboard.appendChild(createFooter());
      }
    },
    {
      title: "02 — About & Heritage Canvas",
      build: (artboard) => {
        artboard.appendChild(createNavbar());
        artboard.appendChild(createPillarsSection());
        artboard.appendChild(createStatsBar());
        artboard.appendChild(createFooter());
      }
    },
    {
      title: "03 — Teams: Stage Manager (Active Detail Canvas)",
      build: (artboard) => {
        artboard.appendChild(createNavbar());
        artboard.appendChild(createTeamStageManager());
        artboard.appendChild(createFooter());
      }
    },
    {
      title: "03-B — Teams: 7-Team Roster Grid (Browse State)",
      build: (artboard) => {
        artboard.appendChild(createNavbar());
        artboard.appendChild(createTeamRosterGrid());
        artboard.appendChild(createFooter());
      }
    },
    {
      title: "04 — Initiatives & Capital Canvas",
      build: (artboard) => {
        artboard.appendChild(createNavbar());
        artboard.appendChild(createInitiativesSection());
        artboard.appendChild(createStatsBar());
        artboard.appendChild(createFooter());
      }
    },
    {
      title: "05 — Stories & Founder Journal Canvas",
      build: (artboard) => {
        artboard.appendChild(createNavbar());
        artboard.appendChild(createStoriesSection());
        artboard.appendChild(createFooter());
      }
    }
  ];

  let startX = 0;
  const createdArtboards = [];

  for (const p of pagesConfig) {
    const artboard = figma.createFrame();
    artboard.name = p.title;
    artboard.x = startX;
    artboard.y = 0;
    artboard.layoutMode = "VERTICAL";
    artboard.itemSpacing = 48;
    artboard.paddingTop = 32;
    artboard.paddingBottom = 48;
    artboard.paddingLeft = 60;
    artboard.paddingRight = 60;
    artboard.primaryAxisSizingMode = "AUTO";
    artboard.counterAxisSizingMode = "AUTO";
    artboard.fills = [{ type: 'SOLID', color: c.canvas }];

    // 12-Column Layout Grid
    artboard.layoutGrids = [{
      pattern: "COLUMNS",
      alignment: "CENTER",
      gutterSize: 24,
      count: 12,
      sectionSize: 88,
      color: { r: 31/255, g: 126/255, b: 192/255, a: 0.08 }
    }];

    // Build the rich page elements
    p.build(artboard);

    createdArtboards.push(artboard);
    startX += 1550; // Gap between pages
  }

  figma.viewport.scrollAndZoomIntoView(createdArtboards);
  figma.notify("✅ GEC Rich Wireframes, Buttons, Cards & Bento Grids generated successfully in Figma!");
  figma.closePlugin();
}

run();
