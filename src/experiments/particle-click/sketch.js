/**
 * Particle Click Experiment
 * Click anywhere to spawn colorful particles with physics-based animation
 */

// Particle storage
let particles = [];

// Configuration
const config = {
    particlesPerClick: 30,
    particleMinSize: 4,
    particleMaxSize: 12,
    gravity: 0.15,
    friction: 0.98,
    fadeSpeed: 3,
    velocityRange: 8
};

/**
 * Particle class
 */
class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        // Random velocity in all directions
        this.vel = createVector(
            random(-config.velocityRange, config.velocityRange),
            random(-config.velocityRange, config.velocityRange / 2) - 2
        );
        this.acc = createVector(0, config.gravity);

        // Random size
        this.size = random(config.particleMinSize, config.particleMaxSize);
        this.initialSize = this.size;

        // Random color using HSB
        this.hue = random(360);
        this.saturation = random(70, 100);
        this.brightness = random(80, 100);

        // Lifespan (255 = fully visible)
        this.lifespan = 255;
    }

    update() {
        // Apply physics
        this.vel.add(this.acc);
        this.vel.mult(config.friction);
        this.pos.add(this.vel);

        // Decrease lifespan
        this.lifespan -= config.fadeSpeed;

        // Shrink particle as it fades
        this.size = map(this.lifespan, 0, 255, 0, this.initialSize);
    }

    display() {
        noStroke();
        // Use alpha from lifespan
        colorMode(HSB, 360, 100, 100, 255);
        fill(this.hue, this.saturation, this.brightness, this.lifespan);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    isDead() {
        return this.lifespan <= 0;
    }
}

/**
 * P5.js Setup
 */
function setup() {
    // Create canvas that fills the container
    const container = document.getElementById('canvas-container');
    const canvas = createCanvas(windowWidth, windowHeight - 60);
    canvas.parent('canvas-container');

    // Set color mode
    colorMode(HSB, 360, 100, 100, 255);

    // Smooth rendering
    smooth();
}

/**
 * P5.js Draw Loop
 */
function draw() {
    // Dark background with slight trail effect
    colorMode(RGB);
    background(10, 10, 15, 40);

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();

        // Remove dead particles
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Draw hint text when no particles
    if (particles.length === 0) {
        fill(255, 80);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(18);
        text('Click anywhere to create particles', width / 2, height / 2);
    }
}

/**
 * Mouse click handler
 */
function mousePressed() {
    // Don't spawn particles if clicking on header
    if (mouseY < 0) return;

    // Spawn particles at click location
    for (let i = 0; i < config.particlesPerClick; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
}

/**
 * Touch handler for mobile
 */
function touchStarted() {
    if (touches.length > 0) {
        const touch = touches[0];
        if (touch.y > 60) { // Below header
            for (let i = 0; i < config.particlesPerClick; i++) {
                particles.push(new Particle(touch.x, touch.y - 60));
            }
        }
    }
    return false; // Prevent default
}

/**
 * Handle window resize
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 60);
}

// Expose p5.js functions to global scope for ES module compatibility
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.touchStarted = touchStarted;
window.windowResized = windowResized;
