class UserCreator {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    increaseScore() {
        return ++this.score;
    }
}
const answerStyles = {
    correct: 'lightgreen',
    uncorrect: 'red',
};

const tl = new TimelineMax();
const startBtn = document.getElementById('start_btn');
const input = document.querySelector('input');
let player;
const panels = document.querySelectorAll('.panel');
const answerBtns = document.querySelectorAll('.game-panel button');
const playerName = document.querySelector('.game-panel h3:nth-child(1)');
const scoreText = document.querySelector('.game-panel h3:nth-child(2)');
const playerEnd = document.querySelector('.end-panel h1:nth-child(1)');
const scoreEnd = document.getElementById('score-number');
let started = false;
let questions = [];

fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
    .then((res) => res.json())
    .then((data) => {
        questions = data.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answers = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answers.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            formattedQuestion.answers = [];
            answers.forEach((choice) => {
                formattedQuestion.answers.push(choice);
            });

            return formattedQuestion;
        });
    });

const setPlayer = (playerText, score) => {
    playerText.textContent = player.name;
    score.textContent = player.score;
};

const switchPanels = (which) => {
    panels.forEach((panel) => {
        if (panel.classList.contains('visable')) {
            panel.classList.remove('visable');
            panel.classList.add('hidden');
        }
    });
    panels[which].classList.remove('hidden');
    panels[which].classList.add('visable');
};

const isCorrect = (clickedBtn) => {
    if ('good' in clickedBtn.dataset === true) {
        scoreText.textContent = player.increaseScore();
        clickedBtn.style.color = `${answerStyles.correct}`;
    } else {
        clickedBtn.style.color = `${answerStyles.uncorrect}`;
    }
};

const progresAnimation = () => {
    const circle = document.querySelector('circle');
    const offS = 472 - 472 * (player.score / questions.length);
    tl.fromTo(circle, 1.5, { strokeDashoffset: 472 }, { strokeDashoffset: offS });
};

const endGame = () => {
    switchPanels(2);
    setPlayer(playerEnd, scoreEnd);
    progresAnimation();
};

const nextQuestion = () => {
    let i = 0;
    const next = () => {
        if (i >= questions.length) {
            endGame();
            return;
        }
        const questionText = document.querySelector('.game-panel h1');
        questionText.textContent = questions[i].question;
        answerBtns.forEach((btn, x) => {
            btn.classList.remove('clickedBtn');
            btn.style.color = '#298c97';
            btn.textContent = questions[i].answers[x];
            delete btn.dataset.good;
        });
        answerBtns[questions[i].answer - 1].dataset.good = 'correct';
        i++;
    };
    return next;
};
const loadNextQuestion = nextQuestion();

const startGame = () => {
    // eslint-disable-next-line eqeqeq
    if (input.value == false) {
        input.placeholder = 'Say us your name';
        return;
    }
    player = new UserCreator(input.value);
    setPlayer(playerName, scoreText);
    switchPanels(1);
    loadNextQuestion();
};

let click = false;
function checkAnswer() {
    if (click === true) return;
    this.classList.add('clickedBtn');
    isCorrect(this);
    click = true;
    setTimeout(() => {
        click = false;
        loadNextQuestion();
    }, 1000);
}

startBtn.addEventListener('click', startGame);
window.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && started === false) {
        startGame();
        started = true;
    }
});
answerBtns.forEach((btn) => {
    btn.addEventListener('click', checkAnswer);
});
