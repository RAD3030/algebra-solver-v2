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
    initMinecraftClone();
}

function initMinecraftClone() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angleX = 0;
    let angleY = 0;

    function draw() {
        // Clear screen with a sky-blue color
        ctx.fillStyle = "#87CEEB"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        // Centers the grid and drops it slightly down the screen
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Render from back-to-front (Z goes from 8 down to 1) 
        // This stops closer blocks from being drawn over by far blocks
        for (let z = 8; z >= 1; z--) {
            for (let x = -4; x <= 4; x++) {
                
                // Calculate perspective scaling factor
                let scale = 1 / (z * 0.2 + 1);
                
                // Offset block coordinates by player camera movement variables (angleX, angleY)
                let worldX = (x * 60) - (angleX * 80);
                let worldY = 100 - (angleY * 80);
                
                // Project 3D coordinates onto a 2D screen surface
                let isoX = worldX * scale;
                let isoY = worldY * scale - (z * 15 * scale); // Adjusted block stacking height multiplier
                let size = 60 * scale;

                // Draw Grass Top Layer
                ctx.fillStyle = (x + z) % 2 === 0 ? "#557a2b" : "#4d6e27";
                ctx.fillRect(isoX, isoY, size, size);

                // Draw Dirt Side Layer
                ctx.fillStyle = "#866043";
                ctx.fillRect(isoX, isoY + size, size, size * 0.4);
                
                // Optional: Draw fine grid lines around blocks to give depth texture definition
                ctx.strokeStyle = "rgba(0,0,0,0.15)";
                ctx.strokeRect(isoX, isoY, size, size + (size * 0.4));
            }
        }
        ctx.restore();
        requestAnimationFrame(draw);
    }

    window.addEventListener("keydown", (e) => {
        // Smooth camera movement boundaries
        if (e.key === "w" || e.key === "ArrowUp") angleY += 0.1;
        if (e.key === "s" || e.key === "ArrowDown") angleY -= 0.1;
        if (e.key === "a" || e.key === "ArrowLeft") angleX -= 0.1;
        if (e.key === "d" || e.key === "ArrowRight") angleX += 0.1;
    });

    // Make canvas automatically fit the window if resized
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    draw();
}
