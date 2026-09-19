const fs = require('fs');
let html = fs.readFileSync('demo.html', 'utf8');

const firstStart = html.indexOf('function updateFrame(f) {');
const btnToggleStart = html.indexOf("btnTogglePlay.addEventListener('click',");

if (firstStart > 0 && btnToggleStart > firstStart) {
  let fixed = `function updateFrame(f) {
      currentFrame = f;
      timeline.value = f;
      timeDisplay.textContent = \`Frame \${Math.round(f)} / \${totalFrames}\`;

      const G_CENTER_OFFSET_X = 420.5;
      const gGlideP = easeOutCubic(clamp(getSub(52, 90, f), 0, 1));
      const gGroupOffX = (1 - gGlideP) * G_CENTER_OFFSET_X;
      grpG.style.transform = \`translateX(\${gGroupOffX}px)\`;

      const gRedP = easeOutBack(clamp(getSub(6, 48, f), 0, 1));
      const gRedM = { dx: (1 - gRedP) * -1310.29, dy: 0, rotate: (1 - gRedP) * -90, scale: 1 + (1 - gRedP) * 0.5 };
      const gRedOp = clamp(getSub(6, 18, f), 0, 1);
      gRed.style.transform = \`translate(\${gRedM.dx}px, \${gRedM.dy}px) rotate(\${gRedM.rotate}deg) scale(\${gRedM.scale})\`;
      gRed.style.opacity = gRedOp;

      const gYellowP = easeOutBack(clamp(getSub(14, 54, f), 0, 1));
      const gYellowM = { dx: 0, dy: (1 - gYellowP) * -892.2, rotate: (1 - gYellowP) * 90, scale: 1 + (1 - gYellowP) * 0.5 };
      const gYellowOp = clamp(getSub(14, 26, f), 0, 1);
      gYellow.style.transform = \`translate(\${gYellowM.dx}px, \${gYellowM.dy}px) rotate(\${gYellowM.rotate}deg) scale(\${gYellowM.scale})\`;
      gYellow.style.opacity = gYellowOp;

      const gBlueP = easeOutBack(clamp(getSub(22, 60, f), 0, 1));
      const gBlueM = { dx: (1 - gBlueP) * 1310.29, dy: 0, rotate: (1 - gBlueP) * 180, scale: 1 + (1 - gBlueP) * 0.5 };
      const gBlueOp = clamp(getSub(22, 34, f), 0, 1);
      gBlue.style.transform = \`translate(\${gBlueM.dx}px, \${gBlueM.dy}px) rotate(\${gBlueM.rotate}deg) scale(\${gBlueM.scale})\`;
      gBlue.style.opacity = gBlueOp;

      const gEmblemP = easeOutBack(clamp(getSub(30, 70, f), 0, 1));
      const gEmblemScale = 0.2 + gEmblemP * 0.8;
      const gEmblemRot = (1 - gEmblemP) * 360;
      const gEmblemM = { dx: 0, dy: (1 - gEmblemP) * 892.2 };
      const gEmblemOp = clamp(getSub(30, 44, f), 0, 1);
      gEmblem.style.transform = \`translate(\${gEmblemM.dx}px, \${gEmblemM.dy}px) rotate(\${gEmblemRot}deg) scale(\${gEmblemScale})\`;
      gEmblem.style.opacity = gEmblemOp;

      const pulseP = getSub(48, 78, f);
      if (pulseP > 0 && pulseP < 1) {
        if(gPulseRing) { gPulseRing.setAttribute('r', pulseP * 95); gPulseRing.setAttribute('opacity', (1 - pulseP) * 0.85); }
      } else {
        if(gPulseRing) gPulseRing.setAttribute('opacity', 0);
      }

      const eP = easeOutCubic(clamp(getSub(55, 95, f), 0, 1));
      const eX = (1 - eP) * 450;
      const eY = (1 - eP) * 40;
      const eScale = 0.85 + eP * 0.15;
      const eOp = clamp(getSub(55, 68, f), 0, 1);
      grpE.style.transform = \`translate(\${eX}px, \${eY}px) scale(\${eScale})\`;
      grpE.style.opacity = eOp;

      const cP = easeOutCubic(clamp(getSub(63, 103, f), 0, 1));
      const cX = (1 - cP) * 600;
      const cY = (1 - cP) * -30;
      const cScale = 0.8 + cP * 0.2;
      const cOp = clamp(getSub(63, 76, f), 0, 1);
      grpC.style.transform = \`translate(\${cX}px, \${cY}px) scale(\${cScale})\`;
      grpC.style.opacity = cOp;

      const sparkP = getSub(84, 116, f);
      const cBulbGloss = document.getElementById('cBulbGloss');
      if (sparkP > 0 && sparkP < 1) {
        const flash = Math.sin(sparkP * Math.PI);
        const sw = 0.75 + flash * 0.85;
        if(cFilament) {
           cFilament.setAttribute('stroke-width', sw);
           cFilament.setAttribute('stroke', flash > 0.3 ? '#fccc00' : '#c43128');
        }
        if (cBulbGloss) cBulbGloss.setAttribute('fill', flash > 0.4 ? '#ffe066' : '#c43128');
      } else {
        if(cFilament) {
          cFilament.setAttribute('stroke-width', 0.75);
          cFilament.setAttribute('stroke', '#c43128');
        }
        if (cBulbGloss) cBulbGloss.setAttribute('fill', '#c43128');
      }

      const subP = easeOutCubic(clamp(getSub(85, 130, f), 0, 1));
      const subY = (1 - subP) * 25;
      grpSubtitle.style.transform = \`translateY(\${subY}px)\`;

      subLetters.forEach((letter, i) => {
        const lP = clamp(getSub(85 + i * 0.85, 95 + i * 0.85, f), 0, 1);
        letter.style.opacity = lP;
      });

      const shimP = getSub(125, 170, f);
      if (shimP > 0 && shimP < 1) {
        const sx = -300 + shimP * 1900;
        const sop = Math.sin(shimP * Math.PI) * 0.45;
        if(shimmerBeam) {
           shimmerBeam.setAttribute('x', sx);
           shimmerBeam.style.opacity = sop;
        }
      } else {
        if(shimmerBeam) shimmerBeam.style.opacity = 0;
      }

      if (f >= 195) {
        websiteMockup.classList.add('revealed');
      } else {
        websiteMockup.classList.remove('revealed');
      }
    }

    function loop(timestamp) {
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (isPlaying) {
        currentFrame += delta * 60 * playbackSpeed;
        if (currentFrame >= totalFrames) {
          currentFrame = totalFrames;
          isPlaying = false;
          btnTogglePlay.textContent = 'Play';
          btnPlayPauseIcon.textContent = '▶ Play';
        }
        updateFrame(currentFrame);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    timeline.addEventListener('input', (e) => {
      isPlaying = false;
      btnTogglePlay.textContent = 'Play';
      btnPlayPauseIcon.textContent = '▶ Play';
      updateFrame(parseFloat(e.target.value));
    });

    `;
   html = html.substring(0, firstStart) + fixed + html.substring(btnToggleStart);
   fs.writeFileSync('demo.html', html);
   console.log('Fixed demo.html successfully');
}
