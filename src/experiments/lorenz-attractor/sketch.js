/**
 * Lorenz Attractor Experiment
 * A 3D visualization of the famous "butterfly effect" strange attractor
 * Drag to rotate the view
 */

// Lorenz system variables
let x = 0.01;
let y = 0;
let z = 0;

// Lorenz constants
const sigma = 10;
const rho = 28;
const beta = 8.0 / 3.0;

// Store path history
let points = [];

function setup() {
    // Use WEBGL for 3D rendering
    const canvas = createCanvas(windowWidth, windowHeight - 60, WEBGL);
    canvas.parent('canvas-container');
    colorMode(HSB, 255, 255, 255);
}

function draw() {
    background(0);

    // Calculate differentials (Lorenz equations)
    const dt = 0.01;
    const dx = (sigma * (y - x)) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    // Update position
    x += dx;
    y += dy;
    z += dz;

    // Add to path history
    points.push(createVector(x, y, z));

    // Keep array manageable for performance
    if (points.length > 3000) {
        points.shift();
    }

    // Enable mouse drag rotation
    orbitControl();

    // Scale up (raw values are small)
    scale(5);

    // Draw the attractor path
    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        // Color gradient based on index
        stroke(i % 255, 255, 255);
        strokeWeight(0.5);
        vertex(v.x, v.y, v.z);
    }
    endShape();

    // Draw hint text
    if (points.length < 100) {
        push();
        resetMatrix();
        fill(255, 150);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text('Drag to rotate the view', 0, height / 2 - 80);
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 60);
}

// Expose p5.js functions to global scope for ES module compatibility
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
