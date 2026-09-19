const fs = require('fs');

function updateLogoAnimation() {
  let file = 'src/LogoAnimation.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace calcCircularMotion with the edge-entry motion logic
  content = content.replace(
    /const calcCircularMotion[\s\S]*?return \{ dx, dy, rotate, scale \};\n  \};\n/m,
    ''
  );

  content = content.replace(
    /const gRedMotion = calcCircularMotion\(gRedProgress, 750, -240, -180, 1\.4\);/m,
    \const gRedMotion = {
    dx: interpolate(gRedProgress, [0, 1], [-LOGO_WIDTH, 0]),
    dy: 0,
    rotate: interpolate(gRedProgress, [0, 1], [-90, 0]),
    scale: interpolate(gRedProgress, [0, 1], [1.5, 1]),
  };\
  );

  content = content.replace(
    /const gYellowMotion = calcCircularMotion\(gYellowProgress, 620, 210, 160, 0\.35\);/m,
    \const gYellowMotion = {
    dx: 0,
    dy: interpolate(gYellowProgress, [0, 1], [-LOGO_HEIGHT * 1.5, 0]),
    rotate: interpolate(gYellowProgress, [0, 1], [90, 0]),
    scale: interpolate(gYellowProgress, [0, 1], [1.5, 1]),
  };\
  );

  content = content.replace(
    /const gBlueMotion = calcCircularMotion\(gBlueProgress, 500, -280, -200, 0\.25\);/m,
    \const gBlueMotion = {
    dx: interpolate(gBlueProgress, [0, 1], [LOGO_WIDTH, 0]),
    dy: 0,
    rotate: interpolate(gBlueProgress, [0, 1], [180, 0]),
    scale: interpolate(gBlueProgress, [0, 1], [1.5, 1]),
  };\
  );

  // Update Emblem motion to include translation from bottom
  content = content.replace(
    /const gEmblemOpacity = interpolate\(frame, \[30, 44\], \[0, 1\], \{/m,
    \const gEmblemMotion = {
    dx: 0,
    dy: interpolate(gEmblemProgress, [0, 1], [LOGO_HEIGHT * 1.5, 0]),
  };
  const gEmblemOpacity = interpolate(frame, [30, 44], [0, 1], {\
  );

  // Add the motion translation to the emblem's transform
  content = content.replace(
    /transform: \\\otate\\\(\\\$\\{gEmblemRotate\\}deg\\\) scale\\\(\\\$\\{gEmblemScale\\}\\\)\\\,/m,
    \	ransform: \\\	ranslate(\\\px, \\\px) rotate(\\\deg) scale(\\\)\\\,\
  );

  // 2. Add Defs for the C gradients
  const svgDefs = \          <svg
            width="100%"
            height="100%"
            viewBox={LOGO_VIEWBOX}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <radialGradient id="cavityShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#000000" stopOpacity={0.65} />
                <stop offset="70%" stopColor="#000000" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fccc00" stopOpacity={filamentFlash * 0.9} />
                <stop offset="40%" stopColor="#c43128" stopOpacity={filamentFlash * 0.5} />
                <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
              </radialGradient>
              <filter id="cInnerShadow">
                <feOffset dx="6" dy="6" />
                <feGaussianBlur stdDeviation="8" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="black" floodOpacity="0.4" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>
            </defs>\;

  content = content.replace(
    /<svg\\s+width="100%"\\s+height="100%"\\s+viewBox=\\{LOGO_VIEWBOX\\}\\s+style=\\{\\{\\s*overflow:\\s*'visible'\\s*\\}\\}\\s*>/m,
    svgDefs
  );

  // 3. Inject gradients & inner shadow into C
  const cBody = \{/* Outer red body of 'C' */}
              <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} filter="url(#cInnerShadow)" />

              {/* Gradient shadow inside the C cavity for depth */}
              <circle cx="1120" cy="285" r="140" fill="url(#cavityShadow)" />

              {/* Additive bulb glow filling the cavity */}
              <circle cx="1120" cy="285" r="160" fill="url(#bulbGlow)" style={{ mixBlendMode: 'screen' }} />\;

  content = content.replace(
    /\\{\\/\\* Outer red body of 'C'[\\s\\S]*?<path d=\\{PATHS_C\\[0\\]\\.d\\} fill=\\{LOGO_COLORS\\.red\\} \\/>/m,
    cBody
  );

  // 4. Add dynamic motion trails to the G elements
  // Red trail
  content = content.replace(
    /<path d=\\{PATH_G_RED\\} fill=\\{LOGO_COLORS\\.red\\} \\/>/m,
    \<path d={PATH_G_RED} fill={LOGO_COLORS.red} />
                <line x1={LOGO_CENTERS.gRed.x} y1={LOGO_CENTERS.gRed.y} x2={LOGO_CENTERS.gRed.x - 1000} y2={LOGO_CENTERS.gRed.y} stroke={LOGO_COLORS.red} strokeWidth="12" strokeLinecap="round" style={{ opacity: (1 - gRedProgress) * 0.8 }} />\
  );
  
  // Yellow trail
  content = content.replace(
    /<path d=\\{PATH_G_YELLOW\\} fill=\\{LOGO_COLORS\\.yellow\\} \\/>/m,
    \<path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
                <line x1={LOGO_CENTERS.gYellow.x} y1={LOGO_CENTERS.gYellow.y} x2={LOGO_CENTERS.gYellow.x} y2={LOGO_CENTERS.gYellow.y - 1000} stroke={LOGO_COLORS.yellow} strokeWidth="8" strokeLinecap="round" style={{ opacity: (1 - gYellowProgress) * 0.8 }} />\
  );

  // Blue trail
  content = content.replace(
    /<path d=\\{PATH_G_BLUE\\} fill=\\{LOGO_COLORS\\.blue\\} \\/>/m,
    \<path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
                <line x1={LOGO_CENTERS.gBlue.x} y1={LOGO_CENTERS.gBlue.y} x2={LOGO_CENTERS.gBlue.x + 1000} y2={LOGO_CENTERS.gBlue.y} stroke={LOGO_COLORS.blue} strokeWidth="8" strokeLinecap="round" style={{ opacity: (1 - gBlueProgress) * 0.8 }} />\
  );

  // Emblem trail - just add it properly (already handled mostly, we can just leave emblem without tail)
  
  fs.writeFileSync(file, content, 'utf8');
}

function updateWebsiteLoader() {
  let file = 'src/WebsiteLoader.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace calcCircular
  content = content.replace(
    /const calcCircular[\\s\\S]*?return \\{ dx, dy, rotate, scale \\};\n  \\};\n/m,
    ''
  );

  // 2. Update motions
  content = content.replace(
    /const gRedMotion = calcCircular\\(gRedP, 750, -240, -180, 1\\.4\\);/m,
    \const gRedMotion = { dx: (1 - gRedP) * -LOGO_WIDTH, dy: 0, rotate: (1 - gRedP) * -90, scale: 1 + (1 - gRedP) * 0.5 };\
  );

  content = content.replace(
    /const gYellowMotion = calcCircular\\(gYellowP, 620, 210, 160, 0\\.35\\);/m,
    \const gYellowMotion = { dx: 0, dy: (1 - gYellowP) * -LOGO_HEIGHT * 1.5, rotate: (1 - gYellowP) * 90, scale: 1 + (1 - gYellowP) * 0.5 };\
  );

  content = content.replace(
    /const gBlueMotion = calcCircular\\(gBlueP, 500, -280, -200, 0\\.25\\);/m,
    \const gBlueMotion = { dx: (1 - gBlueP) * LOGO_WIDTH, dy: 0, rotate: (1 - gBlueP) * 180, scale: 1 + (1 - gBlueP) * 0.5 };\
  );

  content = content.replace(
    /const gEmblemScale = gEmblemP;\n\\s+const gEmblemRot = \\(1 - gEmblemP\\) \\* 360;/m,
    \const gEmblemScale = 0.2 + gEmblemP * 0.8;
  const gEmblemRot = (1 - gEmblemP) * 360;
  const gEmblemMotion = { dx: 0, dy: (1 - gEmblemP) * LOGO_HEIGHT * 1.5 };\
  );

  content = content.replace(
    /transform: \\\otate\\\(\\\$\\{gEmblemRot\\}deg\\\) scale\\\(\\\$\\{gEmblemScale\\}\\\)\\\,/m,
    \	ransform: \\\	ranslate(\\\px, \\\px) rotate(\\\deg) scale(\\\)\\\,\
  );

  // 3. Add defs
  const svgDefs = \        <svg
          width="100%"
          height="100%"
          viewBox={LOGO_VIEWBOX}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="cavityShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity={0.65} />
              <stop offset="70%" stopColor="#000000" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fccc00" stopOpacity={filamentFlash * 0.9} />
              <stop offset="40%" stopColor="#c43128" stopOpacity={filamentFlash * 0.5} />
              <stop offset="100%" stopColor="#c43128" stopOpacity={0} />
            </radialGradient>
            <filter id="cInnerShadow">
              <feOffset dx="6" dy="6" />
              <feGaussianBlur stdDeviation="8" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.4" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>\;

  content = content.replace(
    /<svg\\s+width="100%"\\s+height="100%"\\s+viewBox=\\{LOGO_VIEWBOX\\}\\s+style=\\{\\{\\s*overflow:\\s*'visible'\\s*\\}\\}\\s*>/m,
    svgDefs
  );

  // 4. Inject into C
  const cBody = \{/* Outer red C */}
              <path d={PATHS_C[0].d} fill={LOGO_COLORS.red} filter="url(#cInnerShadow)" />
              {/* Cavity shadow & Glow */}
              <circle cx="1120" cy="285" r="140" fill="url(#cavityShadow)" />
              <circle cx="1120" cy="285" r="160" fill="url(#bulbGlow)" style={{ mixBlendMode: 'screen' }} />\;

  content = content.replace(
    /\\{\\/\\* Outer red C \\*\\/\\}[\\s\\S]*?<path d=\\{PATHS_C\\[0\\]\\.d\\} fill=\\{LOGO_COLORS\\.red\\} \\/>/m,
    cBody
  );

  // 5. Add trails
  content = content.replace(
    /<path d=\\{PATH_G_RED\\} fill=\\{LOGO_COLORS\\.red\\} \\/>/m,
    \<path d={PATH_G_RED} fill={LOGO_COLORS.red} />
                <line x1={LOGO_CENTERS.gRed.x} y1={LOGO_CENTERS.gRed.y} x2={LOGO_CENTERS.gRed.x - 1000} y2={LOGO_CENTERS.gRed.y} stroke={LOGO_COLORS.red} strokeWidth="12" strokeLinecap="round" style={{ opacity: (1 - gRedP) * 0.8 }} />\
  );
  
  content = content.replace(
    /<path d=\\{PATH_G_YELLOW\\} fill=\\{LOGO_COLORS\\.yellow\\} \\/>/m,
    \<path d={PATH_G_YELLOW} fill={LOGO_COLORS.yellow} />
                <line x1={LOGO_CENTERS.gYellow.x} y1={LOGO_CENTERS.gYellow.y} x2={LOGO_CENTERS.gYellow.x} y2={LOGO_CENTERS.gYellow.y - 1000} stroke={LOGO_COLORS.yellow} strokeWidth="8" strokeLinecap="round" style={{ opacity: (1 - gYellowP) * 0.8 }} />\
  );

  content = content.replace(
    /<path d=\\{PATH_G_BLUE\\} fill=\\{LOGO_COLORS\\.blue\\} \\/>/m,
    \<path d={PATH_G_BLUE} fill={LOGO_COLORS.blue} />
                <line x1={LOGO_CENTERS.gBlue.x} y1={LOGO_CENTERS.gBlue.y} x2={LOGO_CENTERS.gBlue.x + 1000} y2={LOGO_CENTERS.gBlue.y} stroke={LOGO_COLORS.blue} strokeWidth="8" strokeLinecap="round" style={{ opacity: (1 - gBlueP) * 0.8 }} />\
  );

  fs.writeFileSync(file, content, 'utf8');
}

updateLogoAnimation();
updateWebsiteLoader();
console.log("Updated both files.");
