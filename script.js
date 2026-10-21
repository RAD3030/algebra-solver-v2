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
        // Replace algebraic power shorthand for evaluation
        let formattedExpr = expression.replace(/\^/g, '**');
        let result = eval(formattedExpr);
        expression = String(result);
        screen.innerText = expression;
    } catch (e) {
        screen.innerText = "Error";
        expression = "";
    }
}

// MINECRAFT ENGINE CONTEXT
function launchGame() {
    // Hide Calculator, show 3D Game Area
    document.getElementById("calculator").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    
    initMinecraftClone();
}

function initMinecraftClone() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    // Set layout dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angleX = 0;
    let angleY = 0;

    // Simple pseudo-3D math block rendering loop
    function draw() {
        ctx.fillStyle = "#87CEEB"; // Sky Blue background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 + 100);
        
        // Simple matrix projection for rendering a grid of cubes
        for (let x = -4; x <= 4; x++) {
            for (let z = 1; z <= 8; z++) {
                // Apply look angle transformations
                let isoX = (x * 60 - angleX * 50) / (z * 0.2 + 1);
                let isoY = (200 - angleY * 50) / (z * 0.2 + 1) - (z * 30);
                let size = 50 / (z * 0.2 + 1);

                // Draw dirt block tops
                ctx.fillStyle = (x + z) % 2 === 0 ? "#557a2b" : "#4d6e27";
                ctx.fillRect(isoX, isoY, size, size);

                // Draw dirt block side depth
                ctx.fillStyle = "#866043";
                ctx.fillRect(isoX, isoY + size, size, size * 0.4);
            }
        }
        ctx.restore();
        requestAnimationFrame(draw);
    }

    // Capture standard camera movement keys
    window.addEventListener("keydown", (e) => {
        if (e.key === "w" || e.key === "ArrowUp") angleY += 0.1;
        if (e.key === "s" || e.key === "ArrowDown") angleY -= 0.1;
        if (e.key === "a" || e.key === "ArrowLeft") angleX -= 0.1;
        if (e.key === "d" || e.key === "ArrowRight") angleX += 0.1;
    });

    draw();
}
