/**
 * Particle Click Experiment
 * Click anywhere to spawn colorful particles with physics-based animation
 */
import p5 from 'p5';

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

const sketch = (p) => {
    // Particle storage
    let particles = [];

    /**
     * Particle class
     */
    class Particle {
        constructor(x, y) {
            this.pos = p.createVector(x, y);
            // Random velocity in all directions
            this.vel = p.createVector(
                p.random(-config.velocityRange, config.velocityRange),
                p.random(-config.velocityRange, config.velocityRange / 2) - 2
            );
            this.acc = p.createVector(0, config.gravity);

            // Random size
            this.size = p.random(config.particleMinSize, config.particleMaxSize);
            this.initialSize = this.size;

            // Random color using HSB
            this.hue = p.random(360);
            this.saturation = p.random(70, 100);
            this.brightness = p.random(80, 100);

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
            this.size = p.map(this.lifespan, 0, 255, 0, this.initialSize);
        }

        display() {
            p.noStroke();
            // Use alpha from lifespan
            p.colorMode(p.HSB, 360, 100, 100, 255);
            p.fill(this.hue, this.saturation, this.brightness, this.lifespan);
            p.ellipse(this.pos.x, this.pos.y, this.size);
        }

        isDead() {
            return this.lifespan <= 0;
        }
    }

    /**
     * P5.js Setup
     */
    p.setup = () => {
        // Create canvas that fills the container
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight - 60);
        canvas.parent('canvas-container');

        // Set color mode
        p.colorMode(p.HSB, 360, 100, 100, 255);

        // Smooth rendering
        p.smooth();
    };

    /**
     * P5.js Draw Loop
     */
    p.draw = () => {
        // Dark background with slight trail effect
        p.colorMode(p.RGB);
        p.background(10, 10, 15, 40);

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
            p.fill(255, 80);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(18);
            p.text('Click anywhere to create particles', p.width / 2, p.height / 2);
        }
    };

    /**
     * Mouse click handler
     */
    p.mousePressed = () => {
        // Don't spawn particles if clicking on header
        if (p.mouseY < 0) return;

        // Spawn particles at click location
        for (let i = 0; i < config.particlesPerClick; i++) {
            particles.push(new Particle(p.mouseX, p.mouseY));
        }
    };

    /**
     * Touch handler for mobile
     */
    p.touchStarted = () => {
        if (p.touches.length > 0) {
            const touch = p.touches[0];
            if (touch.y > 60) { // Below header
                for (let i = 0; i < config.particlesPerClick; i++) {
                    particles.push(new Particle(touch.x, touch.y - 60));
                }
            }
        }
        return false; // Prevent default
    };

    /**
     * Handle window resize
     */
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight - 60);
    };
};

export default new p5(sketch);
