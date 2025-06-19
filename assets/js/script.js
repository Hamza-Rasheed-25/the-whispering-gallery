// The Whispering Gallery Game

const phrases = [
    "Hello World",
    "This is a test",
    "Open the door",
    "Memory game",
    "Quick brown fox",
    "Stay focused",
    "Typing speed",
    "Puzzle solver",
    "Hidden message",
    "Secret code"
];

let currentPhrase = '';
let currentWhisper = '';
let score = 0;
let round = 0;
let maxRounds = 10;

const phraseDisplay = document.getElementById('phrase-display');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');

function shuffleWord(word) {
    if (word.length <= 3) return word;
    const arr = word.split('');
    for (let i = 1; i < arr.length - 1; i++) {
        const j = 1 + Math.floor(Math.random() * (arr.length - 2));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function removeLetters(word) {
    return word.split('').map((ch, i) => {
        if (ch === ' ' || Math.random() > 0.7) return ch;
        return Math.random() > 0.5 ? '_' : ch;
    }).join('');
}

function whisperPhrase(phrase, pattern) {
    const words = phrase.split(' ');
    if (pattern === 0) {
        // Shuffle each word
        return words.map(shuffleWord).join(' ');
    } else if (pattern === 1) {
        // Remove random letters
        return words.map(removeLetters).join(' ');
    } else {
        // Mix: shuffle some words, remove letters in others
        return words.map((w, i) => (i % 2 === 0 ? shuffleWord(w) : removeLetters(w))).join(' ');
    }
}

function nextRound() {
    userInput.value = '';
    feedback.textContent = '';
    if (round >= maxRounds) {
        showFinalResult();
        return;
    }
    round++;
    const pattern = round % 3; // Change whisper pattern each round
    currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    currentWhisper = whisperPhrase(currentPhrase, pattern);
    phraseDisplay.textContent = currentWhisper;
    userInput.disabled = false;
    submitBtn.disabled = false;
    userInput.focus();
}

function showFinalResult() {
    phraseDisplay.textContent = '';
    feedback.innerHTML = `<strong>Game Over!</strong><br>Your score: ${score} / ${maxRounds}`;
    userInput.disabled = true;
    submitBtn.disabled = true;
    // Add restart button if not present
    if (!document.getElementById('restart-btn')) {
        const restartBtn = document.createElement('button');
        restartBtn.id = 'restart-btn';
        restartBtn.textContent = 'Restart';
        restartBtn.onclick = restartGame;
        feedback.appendChild(document.createElement('br'));
        feedback.appendChild(restartBtn);
    }
}

function restartGame() {
    score = 0;
    round = 0;
    userInput.disabled = false;
    submitBtn.disabled = false;
    nextRound();
    feedback.textContent = '';
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.remove();
}

submitBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    if (userInput.disabled) return;
    const answer = userInput.value.trim();
    if (answer.toLowerCase() === currentPhrase.toLowerCase()) {
        score++;
        feedback.textContent = `Correct! Score: ${score}`;
        setTimeout(nextRound, 1200);
    } else {
        feedback.textContent = `Incorrect. The answer was: "${currentPhrase}". Score: ${score}`;
        setTimeout(nextRound, 1800);
    }
}

// Start the game
nextRound();
