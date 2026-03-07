// PixelDream Advanced Interactivity
// Featuring Particle Text and 3D-to-2D Game Transformation
// v2.0 - Authentically Textured Blocks & Better Physics

document.addEventListener("DOMContentLoaded", () => {
  try { initTextEffect(); } catch(e) { console.error('Text effect error:', e); }
  try { initCubeGame(); } catch(e) { console.error('Cube game error:', e); }
  try { initSmoothScroll(); } catch(e) { console.error('Smooth scroll error:', e); }
  try { initFormHandler(); } catch(e) { console.error('Form handler error:', e); }
  try { initMobileMenu(); } catch(e) { console.error('Mobile menu error:', e); }
  try { initMediaLightbox(); } catch(e) { console.error('Lightbox error:', e); }
});

function initMobileMenu() {
  console.log("Initializing Mobile Menu...");
  const menuToggle = document.getElementById("mobile-menu");
  const nav = document.querySelector(".navbar nav");

  if (menuToggle && nav) {
    console.log("Menu Toggle and Nav found");
    // Clone to remove old listeners if any
    const newToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newToggle, menuToggle);

    newToggle.addEventListener("click", (e) => {
        console.log("Menu Toggle Clicked");
        e.stopPropagation();
        e.preventDefault();
        nav.classList.toggle("active");
    });
  } else {
    console.error("Mobile Menu elements not found");
  }
}

// ==========================================
// PART 4: AJAX FORM SUBMISSION (NEW)
// ==========================================
function initFormHandler() {
  // Check if form exists
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Remove any existing listeners by cloning (simple way to clear events)
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  const notification = document.getElementById("mission-notification");

  newForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // CRITICAL: Stop redirect

    const btn = newForm.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "TRANSMITTING...";
    btn.disabled = true;

    const data = new FormData(newForm);

    try {
      const response = await fetch(newForm.action, {
        method: newForm.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        newForm.reset();
        showNotification();
        btn.innerText = originalText;
        btn.disabled = false;
      } else {
        const errorData = await response.json();
        alert(
          "TRANSMISSION FAILED: " +
            (errorData.errors
              ? errorData.errors.map((e) => e.message).join(", ")
              : "Unknown Error"),
        );
        btn.innerText = originalText;
        btn.disabled = false;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("TRANSMISSION ERROR: Check Comms Link");
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });

  function showNotification() {
    if (notification) {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 4000); // Hide after 4 seconds
    }
  }
}

// ==========================================
// PART 1: TEXT PARTICLE DISPERSION EFFECT
// ==========================================
function initTextEffect() {
  const canvas = document.getElementById("text-canvas");
  const ctx = canvas.getContext("2d");

  // Responsive resizing
  function setCanvasSize() {
    const containerWidth = canvas.parentElement.offsetWidth;
    canvas.width = Math.min(600, containerWidth); // Max 600 or container width
    canvas.height = 150;
  }
  setCanvasSize();

  let particlesArray = [];

  const mouse = {
    x: null,
    y: null,
    radius: 50,
  };

  window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.x - rect.left;
    mouse.y = event.y - rect.top;
  });

  ctx.fillStyle = "#dcddde";
  // Adjust font size based on width
  const fontSize1 = canvas.width < 400 ? "20px" : "30px";
  const fontSize2 = canvas.width < 400 ? "30px" : "40px";

  ctx.font = `${fontSize1} "Press Start 2P"`;
  ctx.textBaseline = "middle";
  ctx.fillText("WELCOME TO", 0, 40);

  ctx.fillStyle = "#7d5fff";
  ctx.font = `${fontSize2} "Press Start 2P"`;
  ctx.fillText("PIXELDREAM", 0, 90);

  const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 2;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
      this.color = "#dcddde";
      if (this.y > 60) this.color = "#7d5fff";
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX * 5;
        this.y -= directionY * 5;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  function init() {
    particlesArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
      for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
        if (
          textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
        ) {
          if (x % 2 === 0 && y % 2 === 0) {
            let positionX = x;
            let positionY = y;
            particlesArray.push(new Particle(positionX, positionY));
          }
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].draw();
      particlesArray[i].update();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();

  // Resize listener
  window.addEventListener("resize", () => {
    setCanvasSize();
    // Redraw text to capture new coordinates
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#dcddde";
    const fontSize1 = canvas.width < 400 ? "20px" : "30px";
    const fontSize2 = canvas.width < 400 ? "30px" : "40px";

    ctx.font = `${fontSize1} "Press Start 2P"`;
    ctx.textBaseline = "middle";
    ctx.fillText("WELCOME TO", 0, 40);

    ctx.fillStyle = "#7d5fff";
    ctx.font = `${fontSize2} "Press Start 2P"`;
    ctx.fillText("PIXELDREAM", 0, 90);

    init(); // Re-init particles
  });
}

// ==========================================
// PART 2: 3D CUBE TO PLATFORMER TRANSITION
// ==========================================
function initCubeGame() {
  const canvas = document.getElementById("hero-game-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 400;

  let currentState = "CUBE";
  let transitionProgress = 0;

  // --- 3D CUBE LOGIC ---
  let angleX = 0;
  let angleY = 0;
  let cubes = [];

  // Colors
  const COLORS = {
    GRASS_TOP: "#55efc4", // Bright Mint/Green
    DIRT_SIDE: "#e17055", // Terracotta/Brown
    DIRT_DARK: "#d63031", // Darker Brown
    GOLD: "#ffeaa7",
  };

  // Initialize Cubes
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubes.push({
          x: x * 40,
          y: y * 40,
          z: z * 40,
          baseX: x * 40,
          baseY: y * 40,
          baseZ: z * 40,
          targetX: 0,
          targetY: 0,
          type: "GRASS", // Default
        });
      }
    }
  }

  // --- LEVEL DESIGN ---
  // Ground
  const levelMap = [];
  for (let i = 0; i < 10; i++)
    levelMap.push({ x: 20 + i * 40, y: 340, type: "GRASS" });
  // Platforms
  levelMap.push({ x: 60, y: 260, type: "GRASS" });
  levelMap.push({ x: 140, y: 200, type: "GRASS" });
  levelMap.push({ x: 220, y: 140, type: "GRASS" });
  // Goal Block
  levelMap.push({ x: 340, y: 80, type: "GOAL" });

  // Random filler for unused cubes to float in sky/clouds
  for (let i = levelMap.length; i < 27; i++) {
    levelMap.push({
      x: Math.random() * 380 + 10,
      y: Math.random() * 100 - 150,
      type: "CLOUD",
    }); // Off screen or high up
  }

  cubes.forEach((cube, index) => {
    if (index < levelMap.length) {
      cube.targetX = levelMap[index].x;
      cube.targetY = levelMap[index].y;
      cube.type = levelMap[index].type;
    }
  });

  // --- GAME LOGIC ---
  const player = {
    x: 20,
    y: 200,
    width: 20,
    height: 20,
    vx: 0,
    vy: 0,
    speed: 0.5,
    maxSpeed: 4,
    friction: 0.8,
    jumpForce: -14,
    color: "#ff7675", // Player Red
    grounded: false,
    won: false,
  };

  const keys = {
    right: false,
    left: false,
    up: false,
  };

  // Confetti for winning
  let confetti = [];
  function createConfetti(x, y) {
    for (let i = 0; i < 20; i++) {
      confetti.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 100,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }
  }

  document.addEventListener("keydown", (e) => {
    if (currentState !== "GAME") return;
    if (e.code === "ArrowRight") keys.right = true;
    if (e.code === "ArrowLeft") keys.left = true;
    if (e.code === "Space" || e.code === "ArrowUp") {
      if (player.grounded) {
        player.vy = player.jumpForce;
        player.grounded = false;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowRight") keys.right = false;
    if (e.code === "ArrowLeft") keys.left = false;
  });

  canvas.addEventListener("mouseenter", () => {
    if (currentState === "CUBE" || currentState === "RETURNING") {
      currentState = "TRANSITION";
      resetPlayer();
    }
  });

  canvas.addEventListener("mouseleave", () => {
    currentState = "RETURNING";
  });

  function resetPlayer() {
    player.x = 20;
    player.y = 200;
    player.vx = 0;
    player.vy = 0;
    player.won = false;
    confetti = [];
  }

  // --- DRAWING FUNCTIONS ---

  function drawCube3D(x, y, z, size, type) {
    const fl = 300;
    const scale = fl / (fl + z);
    const px = 200 + x * scale;
    const py = 200 + y * scale;
    const s = size * scale;

    // Draw 3 Visible Faces (simplified assumption: looking from top-front-right slightly)
    // We will just draw a flat square for simplicity in rotation, BUT
    // to make it look like a block, we can simulate faces if we want, OR just draw the texture.

    // Since full 3D texture mapping is hard in 2D canvas without a library,
    // let's stick to a stylized 2D projection that rotates.
    // We will draw the FRONT face primarily.

    ctx.save();
    ctx.translate(px, py);

    // Basic depth shading
    const depthAlpha = 1 - (z + 100) / 400; // Fake fog

    // Block Body (Brown)
    ctx.fillStyle = type === "GOAL" ? COLORS.GOLD : COLORS.DIRT_SIDE;
    ctx.fillRect(-s / 2, -s / 2, s, s);

    // Grass Top (Top 25% of the block)
    if (type === "GRASS") {
      ctx.fillStyle = COLORS.GRASS_TOP;
      ctx.fillRect(-s / 2, -s / 2, s, s * 0.25);
    }

    // Fake Borders
    ctx.strokeStyle = "#2d3436";
    ctx.lineWidth = 2;
    ctx.strokeRect(-s / 2, -s / 2, s, s);

    ctx.restore();
  }

  function drawBlockTexture2D(x, y, size, type) {
    if (type === "CLOUD") return; // Don't draw clouds in block style (or make them white)

    const half = size / 2;
    const startX = x - half;
    const startY = y - half;

    // Base Dirt/Brown
    ctx.fillStyle = type === "GOAL" ? COLORS.GOLD : COLORS.DIRT_SIDE;
    ctx.fillRect(startX, startY, size, size);

    // Grass Top
    if (type === "GRASS") {
      ctx.fillStyle = COLORS.GRASS_TOP;
      ctx.fillRect(startX, startY, size, size * 0.3); // Top 30%

      // Pixel Overhang Details
      ctx.fillStyle = COLORS.GRASS_TOP;
      ctx.fillRect(startX + 5, startY + size * 0.3, 4, 4);
      ctx.fillRect(startX + 15, startY + size * 0.3, 4, 4);
      ctx.fillRect(startX + 25, startY + size * 0.3, 4, 4);
    }

    // Goal Texture Details
    if (type === "GOAL") {
      ctx.fillStyle = "#fff";
      ctx.font = '20px "Press Start 2P"';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", x, y);
    }

    // Border
    ctx.strokeStyle = "#2d3436";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, size, size);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky Background
    if (currentState === "GAME" || currentState === "TRANSITION") {
      var gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "#81ecec"); // Cyan sky
      gradient.addColorStop(1, "#74b9ff"); // Blue sky
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);
    }

    if (currentState === "CUBE") {
      angleX += 0.01;
      angleY += 0.01;

      let projectedCubes = cubes.map((cube) => {
        let x1 = cube.baseX * Math.cos(angleY) - cube.baseZ * Math.sin(angleY);
        let z1 = cube.baseZ * Math.cos(angleY) + cube.baseX * Math.sin(angleY);
        let y1 = cube.baseY * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + cube.baseY * Math.sin(angleX);
        return { x: x1, y: y1, z: z2 + 100, size: 30, type: cube.type };
      });

      projectedCubes.sort((a, b) => b.z - a.z);
      projectedCubes.forEach((p) => drawCube3D(p.x, p.y, p.z, p.size, p.type));
      transitionProgress = 0;
    } else if (currentState === "TRANSITION") {
      transitionProgress += 0.03;
      if (transitionProgress >= 1) {
        transitionProgress = 1;
        currentState = "GAME";
      }

      cubes.forEach((cube) => {
        let x1 = cube.baseX * Math.cos(angleY) - cube.baseZ * Math.sin(angleY);
        let z1 = cube.baseZ * Math.cos(angleY) + cube.baseX * Math.sin(angleY);
        let y1 = cube.baseY * Math.cos(angleX) - z1 * Math.sin(angleX);

        const fl = 300;
        const zFinal = z1 + 100;
        const scale = fl / (fl + zFinal);
        const px = 200 + x1 * scale;
        const py = 200 + y1 * scale;

        const curX = px + (cube.targetX - px) * transitionProgress;
        const curY = py + (cube.targetY - py) * transitionProgress;

        drawBlockTexture2D(curX, curY, 30, cube.type);
      });
    } else if (currentState === "GAME") {
      // Draw Blocks
      cubes.forEach((cube) => {
        drawBlockTexture2D(cube.targetX, cube.targetY, 30, cube.type);
      });

      // Physics
      if (keys.right) player.vx += player.speed;
      if (keys.left) player.vx -= player.speed;

      // Friction
      player.vx *= player.friction;
      player.vy += 0.8; // Gravity

      player.x += player.vx;
      player.y += player.vy;

      // Collision
      player.grounded = false;
      cubes.forEach((cube) => {
        if (cube.type === "CLOUD") return;

        const bx = cube.targetX - 15;
        const by = cube.targetY - 15;
        const bw = 30;
        const bh = 30;

        if (
          player.x + player.width > bx &&
          player.x < bx + bw &&
          player.y + player.height > by &&
          player.y < by + bh
        ) {
          // Goal Logic
          if (cube.type === "GOAL") {
            if (!player.won) {
              player.won = true;
              createConfetti(cube.targetX, cube.targetY);
            }
          }

          // Floor detection
          if (player.vy > 0 && player.y + player.height - player.vy <= by + 5) {
            player.y = by - player.height;
            player.vy = 0;
            player.grounded = true;
          }
          // Ceiling
          else if (player.vy < 0 && player.y - player.vy >= by + bh - 5) {
            player.y = by + bh;
            player.vy = 0;
          }
          // Side collisions (simple)
          else if (player.vx > 0) {
            player.x = bx - player.width;
            player.vx = 0;
          } else if (player.vx < 0) {
            player.x = bx + bw;
            player.vx = 0;
          }
        }
      });

      // Boundaries
      if (player.y > 400) {
        // Reset on fall
        resetPlayer();
      }
      if (player.x < 0) player.x = 0;
      if (player.x > 380) player.x = 380;

      // Draw Player
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      // Player Eyes
      ctx.fillStyle = "white";
      ctx.fillRect(player.x + (keys.left ? 2 : 10), player.y + 4, 4, 4);
      ctx.fillRect(player.x + (keys.left ? 8 : 14), player.y + 4, 4, 4);

      // Draw Confetti
      confetti.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
        if (p.life <= 0) confetti.splice(index, 1);
      });

      if (player.won) {
        ctx.fillStyle = "white";
        ctx.font = '20px "Press Start 2P"';
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText("LEVEL COMPLETE!", 200, 100);
        ctx.fillText("LEVEL COMPLETE!", 200, 100);
      }
    } else if (currentState === "RETURNING") {
      transitionProgress -= 0.05;
      if (transitionProgress <= 0) {
        transitionProgress = 0;
        currentState = "CUBE";
      }

      cubes.forEach((cube) => {
        let x1 = cube.baseX * Math.cos(angleY) - cube.baseZ * Math.sin(angleY);
        let z1 = cube.baseZ * Math.cos(angleY) + cube.baseX * Math.sin(angleY);
        let y1 = cube.baseY * Math.cos(angleX) - z1 * Math.sin(angleX);

        const fl = 300;
        const zFinal = z1 + 100;
        const scale = fl / (fl + zFinal);
        const px = 200 + x1 * scale;
        const py = 200 + y1 * scale;

        const curX = px + (cube.targetX - px) * transitionProgress;
        const curY = py + (cube.targetY - py) * transitionProgress;

        drawBlockTexture2D(curX, curY, 30, cube.type);
      });
    }

    requestAnimationFrame(animate);
  }
  animate();
}

// ==========================================
// PART 3: PAGE TRANSITION (THANOS SNAP)
// ==========================================

// Configuration
const TRANSITION_PFX = {
  pixelSize: 8, // Larger pixels for better performance
  speed: 3,
  dispersion: 50,
};

// Event Listener for the Exit Trigger
const enterHubBtn = document.getElementById("btn-enter-hub");
console.log("Button found:", enterHubBtn); // DEBUG

if (enterHubBtn) {
  enterHubBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Button clicked!"); // DEBUG
    const targetUrl = enterHubBtn.getAttribute("href");
    disintegrate(targetUrl);
  });
}

// Check for Entrance Trigger
if (sessionStorage.getItem("pixelTransition") === "true") {
  console.log("Entrance trigger found"); // DEBUG
  window.addEventListener("load", () => {
    sessionStorage.removeItem("pixelTransition"); // Clear flag
    integrate();
  });
}

function disintegrate(targetUrl) {
  console.log("Starting disintegration..."); // DEBUG
  // 1. Capture the screen
  html2canvas(document.body)
    .then((canvas) => {
      console.log("Screen captured"); // DEBUG
      // ... (rest of the code)
      // 2. Create overlay canvas
      const overlay = document.createElement("canvas");
      overlay.width = window.innerWidth;
      overlay.height = window.innerHeight;
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.zIndex = "9999";
      overlay.style.pointerEvents = "none";
      document.body.appendChild(overlay);

      const ctx = overlay.getContext("2d");
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      // Draw captured image to get data
      ctx.drawImage(canvas, 0, 0, overlay.width, overlay.height);
      const imgData = ctx.getImageData(0, 0, overlay.width, overlay.height);
      ctx.clearRect(0, 0, overlay.width, overlay.height); // Clear to draw particles

      // 3. Create Particles
      let particles = [];
      for (let y = 0; y < overlay.height; y += TRANSITION_PFX.pixelSize) {
        for (let x = 0; x < overlay.width; x += TRANSITION_PFX.pixelSize) {
          // Get color at this pixel
          const i = (y * overlay.width + x) * 4;
          const r = imgData.data[i];
          const g = imgData.data[i + 1];
          const b = imgData.data[i + 2];
          const a = imgData.data[i + 3];

          if (a > 0) {
            // If not transparent
            particles.push({
              x: x,
              y: y,
              color: `rgba(${r},${g},${b},${a / 255})`,
              vx: (Math.random() - 0.5) * TRANSITION_PFX.dispersion,
              vy: (Math.random() - 0.5) * TRANSITION_PFX.dispersion,
              life: 1.0,
            });
          }
        }
      }

      // Hide original content
      document.body.style.visibility = "hidden";
      // But keep overlay visible (it's appended to body, but body visibility might affect it? No, usually children inherit. Wait.
      // If body is hidden, children are hidden. Better to hide a wrapper or all children EXCEPT overlay.)
      // Easier: Just cover body with background color and draw particles on top.
      document.body.style.visibility = "visible"; // Restore
      // Actually, let's just create a full screen colored div behind the canvas
      const bg = document.createElement("div");
      bg.style.position = "fixed";
      bg.style.top = "0";
      bg.style.left = "0";
      bg.style.width = "100%";
      bg.style.height = "100%";
      bg.style.background = getComputedStyle(document.body).background; // Match theme
      bg.style.zIndex = "9998";
      document.body.appendChild(bg);

      // 4. Animate Disintegration
      function animateExit() {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        let activeParticles = false;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.life > 0) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy -= 0.1; // Float up
            p.life -= 0.02;
            activeParticles = true;

            ctx.fillStyle = p.color;
            ctx.fillRect(
              p.x,
              p.y,
              TRANSITION_PFX.pixelSize,
              TRANSITION_PFX.pixelSize,
            );
          }
        }

        if (activeParticles) {
          requestAnimationFrame(animateExit);
        } else {
          // Done
          sessionStorage.setItem("pixelTransition", "true");
          window.location.href = targetUrl;
        }
      }
      animateExit();
    })
    .catch((err) => {
      console.error("html2canvas error:", err);
      // Fallback if transition fails
      window.location.href = targetUrl;
    });
}

function integrate() {
  // 1. Prepare page (Hidden initially)
  const content = document.querySelector("main") || document.body;
  content.style.opacity = "0"; // Hide content

  // 2. Capture what the page WOULD look like
  html2canvas(document.body).then((canvas) => {
    // Create overlay
    const overlay = document.createElement("canvas");
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);

    const ctx = overlay.getContext("2d");
    // Draw captured image to get data
    ctx.drawImage(canvas, 0, 0, overlay.width, overlay.height);
    const imgData = ctx.getImageData(0, 0, overlay.width, overlay.height);
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // 3. Create Particles (Start scattered)
    let particles = [];
    for (let y = 0; y < overlay.height; y += TRANSITION_PFX.pixelSize) {
      for (let x = 0; x < overlay.width; x += TRANSITION_PFX.pixelSize) {
        const i = (y * overlay.width + x) * 4;
        const a = imgData.data[i + 3];

        if (a > 0) {
          particles.push({
            targetX: x,
            targetY: y,
            x: x + (Math.random() - 0.5) * 200, // Start offset
            y: y + (Math.random() - 0.5) * 200,
            color: `rgba(${imgData.data[i]},${imgData.data[i + 1]},${imgData.data[i + 2]},${a / 255})`,
            val: 0, // Progress
          });
        }
      }
    }

    // 4. Animate Integration
    function animateEntrance() {
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      let stillMoving = false;

      // Easing factor
      const ease = 0.1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          p.x += dx * ease;
          p.y += dy * ease;
          stillMoving = true;
        } else {
          p.x = p.targetX;
          p.y = p.targetY;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(
          p.x,
          p.y,
          TRANSITION_PFX.pixelSize,
          TRANSITION_PFX.pixelSize,
        );
      }

      if (stillMoving) {
        requestAnimationFrame(animateEntrance);
      } else {
        // Done
        overlay.remove();
        content.style.opacity = "1";
      }
    }
    animateEntrance();
  });
}

// ==========================================
// PART 6: MEDIA LIGHTBOX (NEW)
// ==========================================
function initMediaLightbox() {
  const modal = document.getElementById("media-modal");
  if (!modal) return;

  const modalContentContainer = modal.querySelector(".modal-content-container");
  const closeBtn = modal.querySelector(".modal-close");
  const zoomableItems = document.querySelectorAll(".zoomable");

  function openModal(element) {
    // Clear previous content
    modalContentContainer.innerHTML = "";

    // Clone the element to put inside modal
    const clone = element.cloneNode(true);
    // Remove the zoomable class so it doesn't have cursor effects in modal
    clone.classList.remove("zoomable");

    // If it's a video, ensure controls are present, play it, and disable muting potentially
    if (clone.tagName.toLowerCase() === "video") {
      clone.controls = true;
      clone.autoplay = true;
      // Unmute so audio plays
      clone.muted = false; 
    }

    modalContentContainer.appendChild(clone);
    
    // Smooth transition hack: display the container first, then add the show class a frame later
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
  }

  function closeModal() {
    modal.classList.remove("show");
    
    // Stop any video from playing after close and hide modal fully
    setTimeout(() => {
        modalContentContainer.innerHTML = "";
        modal.style.display = "none";
    }, 300); // 300ms matches CSS transition time
  }

  // Add click events to all items
  zoomableItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(item);
    });
  });

  // Close on X click
  closeBtn.addEventListener("click", closeModal);

  // Close on background click (clicking outside the media element)
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target === modalContentContainer) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
}
