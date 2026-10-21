function calculate() {
const currentInput = display.value.trim();
// SECRET TRIGGER SEQUENCE CHECK
if (currentInput === '1357') {
unlockGame();
return;
}
try {
let sanitizedInput = currentInput.replace(/sqrt\(/g, 'Math.sqrt(').replace(/\^/g,
'**');
if (sanitizedInput) display.value = eval(sanitizedInput);
} catch (error) {
display.value = 'Error';
}
}
