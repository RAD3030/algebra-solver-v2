let expression = "";
const screen = document.getElementById("screen");

function press(val) {
    if (expression === "0") expression = "";
    expression += val;
    screen.innerText = expression;
}

function clearScreen() {
    expression = "0";
    screen.innerText = expression;
}

function evaluateExpression() {
    // EASTER EGG TRIGGER: Check for the code 1357
    if (expression === "1357") {
        launchGame();
        return;
    }
    try {
        let formattedExpr = expression.replace(/\^/g, '**');
        let result = eval(formattedExpr);
        expression = String(result);
        screen.innerText = expression;
    } catch (e) {
        screen.innerText = "Error";
        expression = "";
    }
}

function launchGame() {
    document.getElementById("calculator").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    // Call the initialization function so the game actually starts
    initMinecraftClone()
        canvas.height = window.innerHeight;
    function initMinecraftClone() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Camera perspective angles
    let angleX = 0;
    let angleY = 0;

    // 1. GENERATE THE WORLD ARRAY (Hills & Valleys)
    const worldWidth = 16;  // X grid size
    const worldDepth = 16;  // Z grid size
    let world = {};         // Format: world["x,z"] = height

    for (let x = -8; x <= 8; x++) {
        for (let z = 1; z <= 16; z++) {
            // Using Math.sin and Math.cos to generate smooth rolling terrain
            let heightMap = Math.sin(x * 0.4) * Math.cos(z * 0.3) * 2;
            // Round it to a whole number so it looks like discrete blocks
            world[`${x},${z}`] = Math.round(heightMap + 2); 
        }
    }

    // Track which block the player's crosshair is pointing at
    let selectedBlock = null;

    function draw() {
        ctx.fillStyle = "#87CEEB"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        selectedBlock = null; // Reset selection every frame
        const centerX = 0;
        const centerY = 0;

        // Render from back to front (Painters Algorithm)
        for (let z = worldDepth; z >= 1; z--) {
            for (let x = -8; x <= 8; x++) {
                
                // Get the height of the current column (default to 0 if broken)
                let blockHeight = world[`${x},${z}`] !== undefined ? world[`${x},${z}`] : -1;
                if (blockHeight < 0) continue; // Skip rendering if column is mined out

                let scale = 1 / (z * 0.15 + 1);
                let worldX = (x * 50) - (angleX * 80);
                
                // 3D Stacking Loop: Draw from the ground up to the block's height
                for (let h = 0; h <= blockHeight; h++) {
                    let worldY = 150 - (angleY * 80) - (h * 40);
                    
                    let isoX = worldX * scale;
                    let isoY = worldY * scale;
                    let size = 50 * scale;

                    // Hit detection: Check if the center crosshair is over this block
                    if (centerX >= isoX && centerX <= isoX + size &&
                        centerY >= isoY && centerY <= isoY + size * 1.4) {
                        selectedBlock = { x: x, z: z, h: h };
                    }

                    // Block colors: Top layer is grass green, lower layers are dirt brown
                    if (h === blockHeight) {
                        ctx.fillStyle = (x + z) % 2 === 0 ? "#557a2b" : "#4d6e27"; // Grass
                    } else {
                        ctx.fillStyle = "#866043"; // Dirt
                    }

                    // Highlight the block if targeted by the crosshair
                    if (selectedBlock && selectedBlock.x === x && selectedBlock.z === z && selectedBlock.h === h) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // White highlight
                    }

                    // Render Block Core
                    ctx.fillRect(isoX, isoY, size, size);
                    ctx.fillStyle = "#866043";
                    ctx.fillRect(isoX, isoY + size, size, size * 0.4);
                    
                    // Borders
                    ctx.strokeStyle = "rgba(0,0,0,0.12)";
                    ctx.strokeRect(isoX, isoY, size, size + (size * 0.4));
                }
            }
        }
        ctx.restore();

        // 2. DRAW HUD (Crosshair)
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2);
        ctx.moveTo(canvas.width / 2, canvas.height / 2 - 10);
        ctx.lineTo(canvas.width / 2, canvas.height / 2 + 10);
        ctx.stroke();

        requestAnimationFrame(draw);
    }

    // 3. KEYBOARD CONTROLS + ACTIONS
    window.addEventListener("keydown", (e) => {
        // Camera Panning
        if (e.key === "w" || e.key === "ArrowUp") angleY += 0.1;
        if (e.key === "s" || e.key === "ArrowDown") angleY -= 0.1;
        if (e.key === "a" || e.key === "ArrowLeft") angleX -= 0.1;
        if (e.key === "d" || e.key === "ArrowRight") angleX += 0.1;

        // BREAK BLOCK (Spacebar hits whatever the crosshair is targeted at)
        if (e.key === " " && selectedBlock) {
            let key = `${selectedBlock.x},${selectedBlock.z}`;
            world[key] -= 1; // Drop the height map level by 1
            e.preventDefault(); // Stop spacebar from scrolling browser window
        }

        // PLACE BLOCK (Press 'E' to build upward on targeted block)
        if ((e.key === "e" || e.key === "E") && selectedBlock) {
            let key = `${selectedBlock.x},${selectedBlock.z}`;
            if (world[key] < 6) { // Build limit ceiling
                world[key] += 1;
            }
        }
    });

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    draw();
}

