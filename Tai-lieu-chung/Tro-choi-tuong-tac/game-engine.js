/**
 * Game Engine Module - Điều khiển logic của các trò chơi
 */

class GameEngine {
    constructor() {
        this.currentGame = null;
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = null;
        this.flashcards = [];
        this.currentFlashcard = 0;
        this.isFlipped = false;
        this.matchingPairs = [];
        this.selectedCards = [];
        this.matchingScore = 0;
        this.matchingTimer = null;
        this.fillBlankQuestions = [];
        
        this.init();
    }

    /**
     * Khởi tạo game engine
     */
    init() {
        this.loadStudentInfo();
        this.updateStats();
    }

    /**
     * Load thông tin học sinh từ storage
     */
    loadStudentInfo() {
        const data = storage.getData();
        if (data.student.name) {
            document.getElementById('studentName').value = data.student.name;
            document.getElementById('studentGrade').value = data.student.grade;
        }

        // Lắng nghe thay đổi thông tin
        document.getElementById('studentName').addEventListener('change', (e) => {
            storage.updateStudent(e.target.value, parseInt(document.getElementById('studentGrade').value));
        });

        document.getElementById('studentGrade').addEventListener('change', (e) => {
            storage.updateStudent(document.getElementById('studentName').value, parseInt(e.target.value));
        });
    }

    /**
     * Cập nhật hiển thị thống kê
     */
    updateStats() {
        const data = storage.getData();
        document.getElementById('highScore').textContent = data.stats.highScore;
        document.getElementById('playCount').textContent = data.stats.playCount;
        document.getElementById('playerLevel').textContent = data.stats.level;
    }

    /**
     * Hiển thị trang chủ
     */
    showMainMenu() {
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('quizGame').classList.add('hidden');
        document.getElementById('flashcardGame').classList.add('hidden');
        document.getElementById('matchingGame').classList.add('hidden');
        document.getElementById('fillblankGame').classList.add('hidden');
        document.getElementById('experimentGame').classList.add('hidden');
        document.getElementById('statsScreen').classList.add('hidden');
        this.updateStats();
    }

    /**
     * Bắt đầu game trắc nghiệm
     */
    startQuizGame() {
        this.currentGame = 'quiz';
        const grade = parseInt(document.getElementById('studentGrade').value);
        
        // Tạo quiz từ AI
        this.currentQuiz = aiEngine.generateQuiz(grade, 10);
        
        if (this.currentQuiz.length === 0) {
            alert('Chưa có câu hỏi cho lớp này. Vui lòng chọn lớp khác!');
            return;
        }

        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = Date.now();

        // Hiển thị màn hình quiz
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('quizGame').classList.remove('hidden');
        
        // Reset UI
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('totalQuestions').textContent = this.currentQuiz.length;
        document.getElementById('quizResult').classList.add('hidden');
        document.getElementById('questionContainer').classList.remove('hidden');
        document.getElementById('nextButtonContainer').classList.add('hidden');

        this.showQuestion();
    }

    /**
     * Hiển thị câu hỏi hiện tại
     */
    showQuestion() {
        const question = this.currentQuiz[this.currentQuestion];
        
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        document.getElementById('questionText').textContent = question.question;
        
        // Cập nhật progress bar
        const progress = ((this.currentQuestion + 1) / this.currentQuiz.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';

        // Tạo options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option bg-gray-100 hover:bg-gray-200 p-4 rounded-lg cursor-pointer transition';
            optionDiv.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionDiv.onclick = () => this.checkAnswer(index);
            optionsContainer.appendChild(optionDiv);
        });
    }

    /**
     * Kiểm tra đáp án
     */
    checkAnswer(selectedIndex) {
        const question = this.currentQuiz[this.currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        // Disable tất cả options
        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });

        // Đánh dấu đúng/sai
        if (selectedIndex === question.correct) {
            options[selectedIndex].classList.add('correct');
            this.score += 10;
            document.getElementById('currentScore').textContent = this.score;
        } else {
            options[selectedIndex].classList.add('incorrect');
            options[question.correct].classList.add('correct');
        }

        // Hiển thị nút next
        document.getElementById('nextButtonContainer').classList.remove('hidden');
    }

    /**
     * Câu hỏi tiếp theo
     */
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.currentQuiz.length) {
            document.getElementById('nextButtonContainer').classList.add('hidden');
            this.showQuestion();
        } else {
            this.endQuiz();
        }
    }

    /**
     * Kết thúc quiz
     */
    endQuiz() {
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        const correctAnswers = this.score / 10;
        
        // Lưu kết quả
        storage.saveGameResult('quiz', this.score, this.currentQuiz.length, correctAnswers, timeTaken);

        // Hiển thị kết quả
        document.getElementById('questionContainer').classList.add('hidden');
        document.getElementById('nextButtonContainer').classList.add('hidden');
        document.getElementById('quizResult').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;

        const accuracy = (correctAnswers / this.currentQuiz.length) * 100;
        let message = '';
        
        if (accuracy >= 90) {
            message = '🏆 Xuất sắc! Bạn là thiên tài khoa học!';
        } else if (accuracy >= 70) {
            message = '👍 Tốt lắm! Tiếp tục phát huy nhé!';
        } else if (accuracy >= 50) {
            message = '😊 Khá đấy! Cố gắng thêm nữa!';
        } else {
            message = '💪 Đừng nản! Hãy học thêm và thử lại!';
        }
        
        document.getElementById('resultMessage').textContent = message;
    }

    /**
     * Bắt đầu game flashcard
     */
    startFlashcardGame() {
        this.currentGame = 'flashcard';
        const grade = parseInt(document.getElementById('studentGrade').value);
        
        this.flashcards = aiEngine.generateFlashcards(grade);
        
        if (this.flashcards.length === 0) {
            alert('Chưa có flashcard cho lớp này!');
            return;
        }

        this.currentFlashcard = 0;
        this.isFlipped = false;

        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('flashcardGame').classList.remove('hidden');
        
        document.getElementById('totalFlashcards').textContent = this.flashcards.length;
        
        this.showFlashcard();
    }

    /**
     * Hiển thị flashcard
     */
    showFlashcard() {
        if (this.currentFlashcard >= this.flashcards.length) {
            alert('🎉 Bạn đã hoàn thành tất cả các thẻ!');
            this.showMainMenu();
            return;
        }

        const card = this.flashcards[this.currentFlashcard];
        
        document.getElementById('flashcardNumber').textContent = this.currentFlashcard + 1;
        document.getElementById('flashcardTerm').textContent = card.term;
        document.getElementById('flashcardDefinition').textContent = card.definition;
        
        // Reset trạng thái lật
        document.getElementById('flashcardFront').classList.remove('hidden');
        document.getElementById('flashcardBack').classList.add('hidden');
        this.isFlipped = false;
    }

    /**
     * Lật thẻ
     */
    flipFlashcard() {
        const front = document.getElementById('flashcardFront');
        const back = document.getElementById('flashcardBack');
        
        if (this.isFlipped) {
            front.classList.remove('hidden');
            back.classList.add('hidden');
        } else {
            front.classList.add('hidden');
            back.classList.remove('hidden');
        }
        
        this.isFlipped = !this.isFlipped;
    }

    /**
     * Đánh giá độ khó của flashcard
     */
    rateFlashcard(difficulty) {
        const card = this.flashcards[this.currentFlashcard];
        
        // Lưu tiến độ với spaced repetition
        storage.saveFlashcardProgress(card.id, difficulty);
        
        // Chuyển sang thẻ tiếp theo
        this.currentFlashcard++;
        this.showFlashcard();
    }

    /**
     * Bắt đầu game ghép đôi
     */
    startMatchingGame() {
        this.currentGame = 'matching';
        const grade = parseInt(document.getElementById('studentGrade').value);
        
        const matchingData = aiEngine.generateMatchingPairs(grade, 6);
        this.matchingPairs = matchingData.pairs;
        const shuffled = matchingData.shuffled;
        
        if (shuffled.length === 0) {
            alert('Chưa có nội dung cho lớp này!');
            return;
        }

        this.selectedCards = [];
        this.matchingScore = 0;
        this.matchedPairs = [];
        this.startTime = Date.now();

        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('matchingGame').classList.remove('hidden');
        
        document.getElementById('matchingScore').textContent = '0';
        document.getElementById('matchingTime').textContent = '0';

        // Tạo các thẻ
        const container = document.getElementById('matchingContainer');
        container.innerHTML = '';

        shuffled.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg cursor-pointer transition text-center';
            card.textContent = item.content;
            card.dataset.type = item.type;
            card.dataset.id = item.id;
            card.dataset.index = index;
            card.onclick = () => this.selectMatchingCard(card);
            container.appendChild(card);
        });

        // Bắt đầu đếm thời gian
        this.startMatchingTimer();
    }

    /**
     * Chọn thẻ ghép đôi
     */
    selectMatchingCard(card) {
        if (card.classList.contains('bg-green-500') || card.classList.contains('bg-gray-400')) {
            return; // Đã ghép hoặc đã chọn
        }

        if (this.selectedCards.length >= 2) {
            return; // Đã chọn đủ 2 thẻ
        }

        card.classList.remove('bg-blue-500', 'bg-blue-600');
        card.classList.add('bg-yellow-400');
        this.selectedCards.push(card);

        if (this.selectedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 500);
        }
    }

    /**
     * Kiểm tra ghép đôi
     */
    checkMatch() {
        const [card1, card2] = this.selectedCards;
        
        if (card1.dataset.id === card2.dataset.id && card1.dataset.type !== card2.dataset.type) {
            // Đúng!
            card1.classList.remove('bg-yellow-400');
            card2.classList.remove('bg-yellow-400');
            card1.classList.add('bg-green-500');
            card2.classList.add('bg-green-500');
            card1.style.pointerEvents = 'none';
            card2.style.pointerEvents = 'none';
            
            this.matchingScore += 10;
            document.getElementById('matchingScore').textContent = this.matchingScore;
            this.matchedPairs.push(card1.dataset.id);
            
            // Kiểm tra hoàn thành
            if (this.matchedPairs.length === this.matchingPairs.length) {
                this.endMatchingGame();
            }
        } else {
            // Sai
            card1.classList.remove('bg-yellow-400');
            card2.classList.remove('bg-yellow-400');
            card1.classList.add('bg-red-500');
            card2.classList.add('bg-red-500');
            
            setTimeout(() => {
                card1.classList.remove('bg-red-500');
                card2.classList.remove('bg-red-500');
                card1.classList.add('bg-blue-500');
                card2.classList.add('bg-blue-500');
            }, 1000);
        }

        this.selectedCards = [];
    }

    /**
     * Bắt đầu đồng hồ đếm
     */
    startMatchingTimer() {
        let seconds = 0;
        this.matchingTimer = setInterval(() => {
            seconds++;
            document.getElementById('matchingTime').textContent = seconds;
        }, 1000);
    }

    /**
     * Kết thúc game ghép đôi
     */
    endMatchingGame() {
        clearInterval(this.matchingTimer);
        const timeTaken = parseInt(document.getElementById('matchingTime').textContent);
        
        // Thưởng điểm cho thời gian nhanh
        const timeBonus = Math.max(0, 50 - timeTaken);
        const finalScore = this.matchingScore + timeBonus;
        
        storage.saveGameResult('matching', finalScore, this.matchingPairs.length, this.matchedPairs.length, timeTaken);
        
        setTimeout(() => {
            alert(`🎉 Hoàn thành!\nĐiểm: ${finalScore}\nThời gian: ${timeTaken}s`);
            this.showMainMenu();
        }, 1000);
    }

    /**
     * Bắt đầu game điền từ
     */
    startFillBlankGame() {
        this.currentGame = 'fillblank';
        const grade = parseInt(document.getElementById('studentGrade').value);
        
        this.fillBlankQuestions = aiEngine.generateFillBlanks(grade, 5);
        
        if (this.fillBlankQuestions.length === 0) {
            alert('Chưa có câu hỏi cho lớp này!');
            return;
        }

        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('fillblankGame').classList.remove('hidden');
        
        document.getElementById('fillblankScore').textContent = '0';

        // Tạo các câu hỏi
        const container = document.getElementById('fillblankContainer');
        container.innerHTML = '';

        this.fillBlankQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'border-2 border-gray-200 rounded-lg p-4';
            
            const sentence = q.sentence.replace('_____', '<input type="text" class="fill-blank-input border-b-2 border-blue-500 px-2 py-1 text-center mx-2" data-index="' + index + '" />');
            
            questionDiv.innerHTML = `
                <p class="text-lg mb-2">${index + 1}. ${sentence}</p>
                <div class="text-sm text-gray-600 mt-2">
                    <button class="hint-btn text-blue-600 hover:underline" onclick="gameEngine.showHint(${index})">💡 Gợi ý</button>
                    <span class="hint-text-${index} hidden ml-2"></span>
                </div>
            `;
            
            container.appendChild(questionDiv);
        });
    }

    /**
     * Hiển thị gợi ý
     */
    showHint(index) {
        const hintSpan = document.querySelector(`.hint-text-${index}`);
        const hints = this.fillBlankQuestions[index].hints;
        
        if (hintSpan.classList.contains('hidden')) {
            hintSpan.textContent = hints[0];
            hintSpan.classList.remove('hidden');
        } else {
            const currentHint = hints.indexOf(hintSpan.textContent);
            if (currentHint < hints.length - 1) {
                hintSpan.textContent = hints[currentHint + 1];
            }
        }
    }

    /**
     * Kiểm tra đáp án điền từ
     */
    checkFillBlankAnswers() {
        const inputs = document.querySelectorAll('.fill-blank-input');
        let score = 0;
        let correct = 0;

        inputs.forEach((input, index) => {
            const question = this.fillBlankQuestions[index];
            const evaluation = aiEngine.evaluateAnswer(input.value, question.answer);
            
            if (evaluation.correct) {
                input.classList.add('border-green-500', 'bg-green-50');
                input.classList.remove('border-blue-500');
                score += 20;
                correct++;
            } else {
                input.classList.add('border-red-500', 'bg-red-50');
                input.classList.remove('border-blue-500');
                
                // Hiển thị đáp án đúng
                const parent = input.parentElement;
                const answerSpan = document.createElement('span');
                answerSpan.className = 'block text-sm text-green-600 mt-1';
                answerSpan.textContent = `Đáp án: ${question.answer}`;
                parent.appendChild(answerSpan);
            }
        });

        document.getElementById('fillblankScore').textContent = score;
        
        // Lưu kết quả (thời gian không được theo dõi cho game này)
        storage.saveGameResult('fillblank', score, this.fillBlankQuestions.length, correct, 0);
        
        // Disable kiểm tra
        event.target.disabled = true;
        event.target.textContent = 'Đã kiểm tra';
        
        setTimeout(() => {
            alert(`Hoàn thành!\nĐiểm: ${score}/${this.fillBlankQuestions.length * 20}`);
        }, 500);
    }

    /**
     * Bắt đầu thí nghiệm ảo
     */
    startExperimentGame() {
        this.currentGame = 'experiment';
        const grade = parseInt(document.getElementById('studentGrade').value);
        
        const experiment = aiEngine.generateExperiment(grade);
        
        if (!experiment) {
            alert('Chưa có thí nghiệm cho lớp này!');
            return;
        }

        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('experimentGame').classList.remove('hidden');

        // Hiển thị dụng cụ
        const toolsContainer = document.getElementById('experimentTools');
        toolsContainer.innerHTML = `
            <h4 class="font-bold mb-2">${experiment.name}</h4>
            <p class="text-sm text-gray-600 mb-4">${experiment.description}</p>
            ${experiment.tools.map(tool => `
                <div class="bg-blue-100 p-2 rounded mb-2">✓ ${tool}</div>
            `).join('')}
            <button onclick="gameEngine.runExperiment()" class="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full">
                🔬 Tiến hành thí nghiệm
            </button>
        `;

        this.currentExperiment = experiment;
    }

    /**
     * Chạy thí nghiệm
     */
    runExperiment() {
        const resultContainer = document.getElementById('experimentResult');
        const exp = this.currentExperiment;
        
        resultContainer.innerHTML = `
            <h4 class="font-bold mb-4">Các bước tiến hành:</h4>
            <ol class="text-left list-decimal list-inside space-y-2 mb-4">
                ${exp.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <div class="bg-green-100 p-4 rounded-lg mt-4">
                <h4 class="font-bold mb-2">Kết quả:</h4>
                <p>${exp.result}</p>
            </div>
        `;
    }

    /**
     * Hiển thị thống kê
     */
    showStatsScreen() {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('statsScreen').classList.remove('hidden');

        const stats = storage.getStats();
        const container = document.getElementById('statsContent');
        
        container.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                <h3 class="text-2xl font-bold mb-2">${stats.student.name || 'Học sinh'}</h3>
                <p class="opacity-90">Lớp ${stats.student.grade}</p>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <p class="text-3xl font-bold text-blue-600">${stats.general.highScore}</p>
                    <p class="text-sm text-gray-600">Điểm cao nhất</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                    <p class="text-3xl font-bold text-green-600">${stats.general.playCount}</p>
                    <p class="text-sm text-gray-600">Lần chơi</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg text-center">
                    <p class="text-3xl font-bold text-purple-600">${stats.general.level}</p>
                    <p class="text-sm text-gray-600">Cấp độ</p>
                </div>
            </div>

            ${Object.keys(stats.gameStats).length > 0 ? `
                <div class="border-2 border-gray-200 rounded-lg p-4">
                    <h3 class="text-xl font-bold mb-4">Thống kê theo game</h3>
                    ${Object.entries(stats.gameStats).map(([game, data]) => `
                        <div class="mb-4 pb-4 border-b border-gray-200 last:border-0">
                            <h4 class="font-bold capitalize mb-2">${this.getGameName(game)}</h4>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div>Đã chơi: ${data.played} lần</div>
                                <div>Điểm TB: ${data.avgScore}</div>
                                <div>Độ chính xác: ${data.avgAccuracy}%</div>
                                <div>Điểm cao: ${data.maxScore}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-gray-600 text-center">Chưa có dữ liệu thống kê</p>'}

            <div class="border-2 border-gray-200 rounded-lg p-4">
                <h3 class="text-xl font-bold mb-4">🏆 Thành tích</h3>
                <div class="grid grid-cols-2 gap-4">
                    ${stats.achievements.map(ach => `
                        <div class="p-3 rounded-lg ${ach.unlocked ? 'bg-yellow-100' : 'bg-gray-100 opacity-50'}">
                            <span class="text-3xl">${ach.icon}</span>
                            <p class="font-bold text-sm mt-1">${ach.name}</p>
                            <p class="text-xs text-gray-600">${ach.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Lấy tên game tiếng Việt
     */
    getGameName(gameType) {
        const names = {
            quiz: 'Trắc nghiệm',
            flashcard: 'Thẻ ghi nhớ',
            matching: 'Ghép đôi',
            fillblank: 'Điền từ',
            experiment: 'Thí nghiệm'
        };
        return names[gameType] || gameType;
    }

    /**
     * Xuất dữ liệu
     */
    exportStudentData() {
        storage.exportData();
    }

    /**
     * Xóa dữ liệu
     */
    clearStudentData() {
        storage.clearData();
    }
}

// Khởi tạo game engine
const gameEngine = new GameEngine();

// Global functions cho HTML onclick
function startGame(gameType) {
    const name = document.getElementById('studentName').value;
    if (!name) {
        alert('Vui lòng nhập tên của bạn trước khi chơi!');
        document.getElementById('studentName').focus();
        return;
    }

    switch(gameType) {
        case 'quiz':
            gameEngine.startQuizGame();
            break;
        case 'flashcard':
            gameEngine.startFlashcardGame();
            break;
        case 'matching':
            gameEngine.startMatchingGame();
            break;
        case 'fillblank':
            gameEngine.startFillBlankGame();
            break;
        case 'experiment':
            gameEngine.startExperimentGame();
            break;
    }
}

function backToMenu() {
    gameEngine.showMainMenu();
}

function nextQuestion() {
    gameEngine.nextQuestion();
}

function flipCard() {
    gameEngine.flipFlashcard();
}

function rateCard(difficulty) {
    gameEngine.rateFlashcard(difficulty);
}

function checkFillBlank() {
    gameEngine.checkFillBlankAnswers();
}

function showStats() {
    gameEngine.showStatsScreen();
}

function exportData() {
    gameEngine.exportStudentData();
}

function clearData() {
    gameEngine.clearStudentData();
}
