/**
 * Lorenz Attractor Experiment
 * A 3D visualization of the famous "butterfly effect" strange attractor
 * Drag to rotate the view
 */
import p5 from 'p5';

const sketch = (p: p5): void => {
    // Lorenz system variables
    let x: number = 0.01;
    let y: number = 0;
    let z: number = 0;

    // Lorenz constants
    const sigma: number = 10;
    const rho: number = 28;
    const beta: number = 8.0 / 3.0;

    // Store path history
    let points: p5.Vector[] = [];

    p.setup = (): void => {
        // Use WEBGL for 3D rendering
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight - 60, p.WEBGL);
        canvas.parent('canvas-container');
        p.colorMode(p.HSB, 255, 255, 255);
    };

    p.draw = (): void => {
        p.background(0);

        // Calculate differentials (Lorenz equations)
        const dt: number = 0.01;
        const dx: number = (sigma * (y - x)) * dt;
        const dy: number = (x * (rho - z) - y) * dt;
        const dz: number = (x * y - beta * z) * dt;

        // Update position
        x += dx;
        y += dy;
        z += dz;

        // Add to path history
        points.push(p.createVector(x, y, z));

        // Keep array manageable for performance
        if (points.length > 3000) {
            points.shift();
        }

        // Enable mouse drag rotation
        p.orbitControl();

        // Scale up (raw values are small)
        p.scale(5);

        // Draw the attractor path
        p.noFill();
        p.beginShape();
        for (let i = 0; i < points.length; i++) {
            const v = points[i];
            // Color gradient based on index
            p.stroke(i % 255, 255, 255);
            p.strokeWeight(0.5);
            p.vertex(v.x, v.y, v.z);
        }
        p.endShape();

        // Draw hint text
        if (points.length < 100) {
            p.push();
            p.resetMatrix();
            p.fill(255, 150);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.text('Drag to rotate the view', 0, p.height / 2 - 80);
            p.pop();
        }
    };

    p.windowResized = (): void => {
        p.resizeCanvas(p.windowWidth, p.windowHeight - 60);
    };
};

export default new p5(sketch);
