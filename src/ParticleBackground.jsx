import React, { useEffect, useRef } from 'react';

class ParticleInfo {
    constructor(famIdx, x, y, vx, vy) {
        this.famIdx = famIdx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
}

const ParticleSimulation = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const forceMatrix = useRef([]);
    const settings = useRef({
        rMax: 0.3,
        sizeX: 0,
        sizeY: 0,
        dt: 0.03,
        particleVisSize: 10,
        n: 450,
        m: 40,
        friction: 0.2,
        maxDistance: 1,
        minDistance: 0.3,
        matrixShape: 4,
    });

    const initializeVariables = () => {
        const canvas = canvasRef.current;
        settings.current.sizeX = canvas.width;
        settings.current.sizeY = canvas.height;
    };

    const initializeForceMatrix = (assignRand, setVal = 0) => {
        const m = settings.current.m;
        forceMatrix.current = Array.from({ length: m }, () => Array(m).fill(0));

        if (assignRand) {
            forceMatrix.current = forceMatrix.current.map(row => row.map(() => Math.floor(Math.random() * 21 - 10) / 10));
        } else {
            forceMatrix.current.forEach(row => row.fill(setVal));
        }
    };

    const rule = () => {
        const { rMax, dt, friction, sizeY, sizeX } = settings.current;
        const ratio = sizeY / sizeX;
        for (let i = 0; i < particles.current.length; i++) {
            let fx = 0;
            let fy = 0;
            let a = particles.current[i];

            for (let j = 0; j < particles.current.length; j++) {
                let b = particles.current[j];
                if (b !== a) {
                    let dx = b.x - a.x;
                    let dy = b.y - a.y;

                    if (Math.abs(dx) > 0.5) {
                        dx -= Math.sign(dx);
                    }
                    if (Math.abs(dy) > 0.5 * ratio) {
                        dy -= Math.sign(dy) * ratio;
                    }

                    let attraction = -forceMatrix.current[a.famIdx][b.famIdx];
                    let d = Math.sqrt(dx ** 2 + dy ** 2);
                    let currentForce = 0;

                    if (d > 0 && d < rMax) {
                        currentForce = force(d / rMax, attraction);
                    }

                    fx += dx / d * currentForce;
                    fy += dy / d * currentForce;
                }
            }

            fx *= rMax;
            fy *= rMax;

            a.vx *= friction;
            a.vy *= friction;

            a.vx += fx * dt;
            a.vy += fy * dt;

            a.x = (a.x + a.vx * dt + 1) % 1;
            a.y = (a.y + a.vy * dt + ratio) % ratio;
        }

        for (let i = 0; i < particles.current.length; i++) {
            let a = particles.current[i];
            a.x += a.vx * dt;
            a.y += a.vy * dt;
        }
    };

    const force = (d, a) => {
        const { maxDistance, minDistance } = settings.current;
        if (d < maxDistance && d > minDistance) {
            return a * (1 - Math.abs(2 * d - 1 - minDistance) / (1 - minDistance));
        } else if (d < minDistance) {
            return d / minDistance - 1;
        } else {
            return 0;
        }
    };

    const generateParticles = (amount) => {
        const m = settings.current.m;
        const particleList = [];

        for (let i = 0; i < amount; i++) {
            let xPos = Math.random();
            let yPos = Math.random();
            let idx = Math.floor(Math.random() * m);
            let particle = new ParticleInfo(idx, xPos, yPos, 0, 0);
            particleList.push(particle);
        }

        return particleList;
    };

    const setForceMatrixPreset = (matrixShape) => {
        const m = settings.current.m;
        forceMatrix.current = Array.from({ length: m }, () => Array(m).fill(0));

        if (matrixShape === 1) { // Random
            forceMatrix.current = forceMatrix.current.map(row => row.map(() => Math.floor(Math.random() * 21 - 10) / 10));
        } else if (matrixShape === 2) { // Zero
            forceMatrix.current.forEach(row => row.fill(0));
        } else if (matrixShape === 3) { // Snake
            forceMatrix.current.forEach(row => row.fill(0));
            for (let i = 0; i < m; i++) {
                forceMatrix.current[i][i] = -1;
                const nextIndex = (i - 1) % m;
                forceMatrix.current[i][nextIndex] = -0.4;
            }
        } else if (matrixShape === 4) { // Lines
            forceMatrix.current.forEach(row => row.fill(0));
            for (let i = 0; i < m; i++) {
                forceMatrix.current[i][i] = -1;
                forceMatrix.current[i][i - 1] = -1;
                forceMatrix.current[i][i + 1] = -1;
            }

            forceMatrix.current[0][m - 1] = -1;
            forceMatrix.current[m - 1][0] = -1;
        } else if (matrixShape === 5) { // Symmetry
            for (let i = 0; i < m; i++) {
                for (let j = 0; j < m; j++) {
                    const thisRand = Math.floor(Math.random() * 21 - 10) / 10;
                    if (i > j) {
                        forceMatrix.current[i][j] = thisRand;
                        forceMatrix.current[j][i] = thisRand;
                    } else if (i === j) {
                        forceMatrix.current[i][j] = thisRand;
                    }
                }
            }
        } else if (matrixShape === 6) { // Multiple snakessss
            forceMatrix.current.forEach(row => row.fill(0));
            let ctr = 0;
            for (let i = 0; i < m; i++) {
                forceMatrix.current[i][i] = -1;
                const nextIndex = (i - 1) % m;

                if (ctr <= 3){
                    forceMatrix.current[i][nextIndex] = -0.4;
                    ctr++;
                }else{
                    ctr = 0;
                    forceMatrix.current[i][nextIndex] = 0;
                }
            }
        }
    };

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        settings.current.sizeX = canvas.width;
        settings.current.sizeY = canvas.height;
    };

    useEffect(() => {
        initializeVariables();
        initializeForceMatrix(false);
        setForceMatrixPreset(settings.current.matrixShape);
        particles.current = generateParticles(settings.current.n);

        const updateVisualization = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            rule();

            for (let i = 0; i < particles.current.length; i++) {
                let particle = particles.current[i];
                ctx.beginPath();
                const screenX = particle.x * settings.current.sizeX;
                const screenY = particle.y * settings.current.sizeX;
                ctx.arc(screenX, screenY, settings.current.particleVisSize, 0, 2 * Math.PI);
                // ctx.fillStyle = `hsl(${(particle.famIdx / settings.current.m) * 360}, 100%, 50%)`;
                ctx.fillStyle = `hsl(0, 0%, 100%)`;
                ctx.fill();
            }

            requestAnimationFrame(updateVisualization);
        };

        updateVisualization();

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} id="particleCanvas" />;
};

export default ParticleSimulation;
