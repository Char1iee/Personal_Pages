const canvas = document.querySelector('#bouquet');
const context = canvas.getContext('2d');
const leaf = ['#4c7b5a', '#77966a', '#a9ae73', '#e0ce8b'];
const particles = [];
const started = performance.now();

const rand = (min, max) => min + Math.random() * (max - min);

function addRose(cx, cy, radius, amount, palette) {
  for (let layer = 0; layer < 5; layer += 1) {
    const petals = 5 + layer * 4;
    const pointsPerPetal = Math.ceil(amount / 5 / petals);
    const length = radius * (.25 + layer * .105);
    const width = radius * (.075 + layer * .022);
    const base = radius * layer * .055;
    for (let petal = 0; petal < petals; petal += 1) {
      const theta = petal * Math.PI * 2 / petals + (layer % 2) * .18;
      for (let point = 0; point < pointsPerPetal; point += 1) {
        const u = Math.pow(Math.random(), .86);
        const side = rand(-1, 1) * width * Math.pow(Math.sin(u * Math.PI), .55);
        const radial = base + u * length;
        particles.push({
          x: cx + Math.cos(theta) * radial - Math.sin(theta) * side,
          y: cy + Math.sin(theta) * radial * .78 + Math.cos(theta) * side * .78,
          z: Math.pow(u, 1.8) * (.055 + layer * .014) + Math.pow(Math.abs(side) / width, 2) * .028 - layer * .018 + rand(-.018, .018),
          color: palette[Math.min(layer, palette.length - 1)], size: rand(.55, 1.8), phase: rand(0, Math.PI * 2), orbit: rand(.008, .075),
        });
      }
    }
  }
}

function addPetalContours(cx, cy, radius) {
  for (let ring = 0; ring < 3; ring += 1) {
    const petals = 6 + ring * 5;
    const inner = radius * (.06 + ring * .18);
    const outer = radius * (.36 + ring * .22);
    const width = radius * (.075 + ring * .022);
    for (let petal = 0; petal < petals; petal += 1) {
      const theta = petal * Math.PI * 2 / petals + ring * .22;
      for (const side of [-1, 1]) for (let step = 0; step <= 11; step += 1) {
        const t = step / 11;
        const radial = inner + (outer - inner) * t;
        const offset = side * width * Math.sin(t * Math.PI);
        particles.push({
          x: cx + Math.cos(theta) * radial - Math.sin(theta) * offset,
          y: cy + Math.sin(theta) * radial * .78 + Math.cos(theta) * offset * .78,
          z: .13 + ring * .015 + Math.pow(t, 2) * .045,
          color: ring === 2 ? '#ffd8d0' : '#ff9eaa', size: rand(.75, 1.35), phase: rand(0, 7), orbit: rand(.005, .045),
        });
      }
    }
  }
}

function addLeaf(cx, cy, width, height, angle, count) {
  for (let i = 0; i < count; i += 1) {
    const u = rand(-1, 1), v = rand(-height, height) * Math.sqrt(1 - u * u);
    particles.push({ x: cx + u * width * Math.cos(angle) - v * Math.sin(angle), y: cy + u * width * Math.sin(angle) + v * Math.cos(angle), z: rand(-.04, .04), color: leaf[i % leaf.length], size: rand(.8, 2.2), phase: rand(0, 7), orbit: rand(.02, .12) });
  }
}

function buildRose() {
  addRose(0, -.17, .65, 4500, ['#bd0928', '#eb2943', '#ff6878', '#ffabb2', '#ffe1d5']);
  addPetalContours(0, -.17, .65);
  for (let i = 0; i < 520; i += 1) {
    const t = i * .33, radius = .009 + i / 520 * .234;
    particles.push({ x: Math.cos(t) * radius, y: -.055 + Math.sin(t) * radius * .35, z: .115 + i / 520 * .02, color: i % 3 ? '#ffe1d5' : '#ff5f70', size: rand(.5, 1.25), phase: rand(0, 7), orbit: rand(.006, .045) });
  }
  for (let i = 0; i < 260; i += 1) {
    const progress = i / 260;
    particles.push({ x: rand(-.025, .025) * (1 - progress), y: .19 + progress * .48, z: rand(-.025, .025), color: leaf[i % leaf.length], size: rand(.7, 1.8), phase: rand(0, 7), orbit: rand(.02, .12) });
  }
  addLeaf(-.18, .43, .23, .09, -.35, 160);
  addLeaf(.18, .49, .23, .09, Math.PI + .35, 160);
}

function resize() {
  const ratio = Math.min(devicePixelRatio, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function draw(time) {
  const seconds = (time - started) / 1000;
  const size = Math.min(innerWidth, innerHeight) * .55;
  const cx = innerWidth * .52, cy = innerHeight * .36;
  const rotation = Math.sin(seconds * .42) * .42;
  const cos = Math.cos(rotation), sin = Math.sin(rotation);
  context.clearRect(0, 0, innerWidth, innerHeight);
  const visible = particles.map((p) => {
    const localSpin = seconds * (1.15 + p.orbit * 5) + p.phase;
    const motion = .008 + p.orbit * .045;
    const px = p.x + Math.cos(localSpin) * motion;
    const py = p.y + Math.sin(localSpin * 1.3) * motion * .72;
    const pz = p.z + Math.cos(localSpin * .8) * motion * 1.9;
    const rx = px * cos - pz * sin, rz = px * sin + pz * cos;
    const perspective = 1.45 / (1.55 - rz);
    return { x: cx + rx * size * perspective, y: cy + py * size * perspective, radius: Math.max(.7, p.size * perspective), z: rz, color: p.color };
  }).sort((a, b) => a.z - b.z);
  for (const p of visible) {
    context.fillStyle = p.color;
    context.beginPath();
    context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    context.fill();
  }
  requestAnimationFrame(draw);
}

buildRose();
resize();
addEventListener('resize', resize);
requestAnimationFrame(draw);
