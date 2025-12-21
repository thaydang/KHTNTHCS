/**
 * Data Storage Module - Quản lý lưu trữ dữ liệu học tập
 * Sử dụng localStorage để lưu trữ tiến độ học sinh
 */

class DataStorage {
    constructor() {
        this.storageKey = 'khtn_student_data';
        this.initStorage();
    }

    /**
     * Khởi tạo storage nếu chưa tồn tại
     */
    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                student: {
                    name: '',
                    grade: 6,
                    createdAt: new Date().toISOString()
                },
                stats: {
                    highScore: 0,
                    playCount: 0,
                    level: 1,
                    totalPoints: 0,
                    achievements: []
                },
                gameHistory: {
                    quiz: [],
                    flashcard: [],
                    matching: [],
                    fillblank: [],
                    experiment: []
                },
                progress: {
                    completedTopics: [],
                    masteredConcepts: [],
                    weakAreas: []
                },
                flashcardProgress: {},
                lastPlayed: null
            };
            this.saveData(initialData);
        }
    }

    /**
     * Lưu toàn bộ dữ liệu
     */
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Lỗi lưu dữ liệu:', error);
            return false;
        }
    }

    /**
     * Lấy toàn bộ dữ liệu
     */
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Lỗi đọc dữ liệu:', error);
            return null;
        }
    }

    /**
     * Cập nhật thông tin học sinh
     */
    updateStudent(name, grade) {
        const data = this.getData();
        data.student.name = name;
        data.student.grade = grade;
        this.saveData(data);
    }

    /**
     * Lưu kết quả game
     */
    saveGameResult(gameType, score, totalQuestions, correctAnswers, timeTaken) {
        const data = this.getData();
        
        const gameResult = {
            score,
            totalQuestions,
            correctAnswers,
            timeTaken,
            date: new Date().toISOString(),
            accuracy: (correctAnswers / totalQuestions * 100).toFixed(1)
        };

        // Lưu lịch sử game
        if (!data.gameHistory[gameType]) {
            data.gameHistory[gameType] = [];
        }
        data.gameHistory[gameType].push(gameResult);

        // Giới hạn lịch sử 50 lần chơi gần nhất
        if (data.gameHistory[gameType].length > 50) {
            data.gameHistory[gameType] = data.gameHistory[gameType].slice(-50);
        }

        // Cập nhật thống kê
        data.stats.playCount++;
        data.stats.totalPoints += score;
        
        if (score > data.stats.highScore) {
            data.stats.highScore = score;
        }

        // Cập nhật level dựa trên tổng điểm
        data.stats.level = Math.floor(data.stats.totalPoints / 500) + 1;

        // Cập nhật thành tích
        this.checkAchievements(data);

        data.lastPlayed = new Date().toISOString();
        
        this.saveData(data);
        return gameResult;
    }

    /**
     * Kiểm tra và cấp thành tích
     */
    checkAchievements(data) {
        const achievements = [];

        // Thành tích chơi lần đầu
        if (data.stats.playCount === 1 && !data.stats.achievements.includes('first_game')) {
            achievements.push({
                id: 'first_game',
                name: 'Lần đầu tiên',
                icon: '🎮',
                description: 'Chơi game lần đầu tiên'
            });
        }

        // Thành tích 10 lần chơi
        if (data.stats.playCount >= 10 && !data.stats.achievements.includes('veteran')) {
            achievements.push({
                id: 'veteran',
                name: 'Người chơi kỳ cựu',
                icon: '🏅',
                description: 'Chơi 10 lần'
            });
        }

        // Thành tích 50 lần chơi
        if (data.stats.playCount >= 50 && !data.stats.achievements.includes('master')) {
            achievements.push({
                id: 'master',
                name: 'Bậc thầy',
                icon: '🏆',
                description: 'Chơi 50 lần'
            });
        }

        // Thành tích điểm cao
        if (data.stats.highScore >= 100 && !data.stats.achievements.includes('perfect_score')) {
            achievements.push({
                id: 'perfect_score',
                name: 'Điểm tuyệt đối',
                icon: '⭐',
                description: 'Đạt 100 điểm'
            });
        }

        // Thành tích đạt level 5
        if (data.stats.level >= 5 && !data.stats.achievements.includes('level_5')) {
            achievements.push({
                id: 'level_5',
                name: 'Chuyên gia',
                icon: '🎓',
                description: 'Đạt level 5'
            });
        }

        // Thêm thành tích mới
        achievements.forEach(ach => {
            if (!data.stats.achievements.includes(ach.id)) {
                data.stats.achievements.push(ach.id);
                this.showAchievementNotification(ach);
            }
        });
    }

    /**
     * Hiển thị thông báo thành tích
     */
    showAchievementNotification(achievement) {
        // Tạo thông báo động
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-yellow-400 text-gray-800 px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-3xl">${achievement.icon}</span>
                <div>
                    <p class="font-bold">Thành tích mới!</p>
                    <p class="text-sm">${achievement.name}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Tự động xóa sau 3 giây
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Lưu tiến độ flashcard (Spaced Repetition)
     */
    saveFlashcardProgress(cardId, difficulty) {
        const data = this.getData();
        
        if (!data.flashcardProgress[cardId]) {
            data.flashcardProgress[cardId] = {
                reviewCount: 0,
                lastReview: null,
                nextReview: null,
                difficulty: [],
                mastered: false
            };
        }

        const progress = data.flashcardProgress[cardId];
        progress.reviewCount++;
        progress.lastReview = new Date().toISOString();
        progress.difficulty.push(difficulty);

        // Tính toán thời gian review tiếp theo dựa trên Spaced Repetition
        const intervals = {
            easy: 7,    // 7 ngày
            medium: 3,  // 3 ngày
            hard: 1     // 1 ngày
        };

        const nextDays = intervals[difficulty] || 1;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextDays);
        progress.nextReview = nextDate.toISOString();

        // Đánh dấu đã thành thạo nếu review >= 5 lần và chủ yếu là easy
        if (progress.reviewCount >= 5) {
            const easyCount = progress.difficulty.filter(d => d === 'easy').length;
            if (easyCount / progress.reviewCount >= 0.6) {
                progress.mastered = true;
            }
        }

        this.saveData(data);
    }

    /**
     * Lấy thẻ cần ôn tập
     */
    getCardsToReview() {
        const data = this.getData();
        const now = new Date();
        const cardsToReview = [];

        for (const [cardId, progress] of Object.entries(data.flashcardProgress)) {
            if (!progress.mastered && progress.nextReview) {
                const nextReview = new Date(progress.nextReview);
                if (nextReview <= now) {
                    cardsToReview.push(cardId);
                }
            }
        }

        return cardsToReview;
    }

    /**
     * Thêm chủ đề đã hoàn thành
     */
    addCompletedTopic(topic) {
        const data = this.getData();
        if (!data.progress.completedTopics.includes(topic)) {
            data.progress.completedTopics.push(topic);
            this.saveData(data);
        }
    }

    /**
     * Thêm khái niệm đã thành thạo
     */
    addMasteredConcept(concept) {
        const data = this.getData();
        if (!data.progress.masteredConcepts.includes(concept)) {
            data.progress.masteredConcepts.push(concept);
            this.saveData(data);
        }
    }

    /**
     * Ghi nhận điểm yếu
     */
    addWeakArea(area) {
        const data = this.getData();
        if (!data.progress.weakAreas.includes(area)) {
            data.progress.weakAreas.push(area);
            this.saveData(data);
        }
    }

    /**
     * Lấy thống kê tổng hợp
     */
    getStats() {
        const data = this.getData();
        
        // Tính toán thống kê chi tiết
        const stats = {
            student: data.student,
            general: data.stats,
            gameStats: {},
            recentGames: [],
            achievements: this.getAllAchievements(data.stats.achievements)
        };

        // Thống kê từng loại game
        for (const [gameType, history] of Object.entries(data.gameHistory)) {
            if (history.length > 0) {
                const scores = history.map(h => h.score);
                const accuracies = history.map(h => parseFloat(h.accuracy));
                
                stats.gameStats[gameType] = {
                    played: history.length,
                    avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
                    maxScore: Math.max(...scores),
                    minScore: Math.min(...scores),
                    avgAccuracy: (accuracies.reduce((a, b) => a + b, 0) / accuracies.length).toFixed(1),
                    lastPlayed: history[history.length - 1].date
                };
            }
        }

        // 10 lần chơi gần nhất
        const allGames = [];
        for (const [gameType, history] of Object.entries(data.gameHistory)) {
            history.forEach(game => {
                allGames.push({ gameType, ...game });
            });
        }
        allGames.sort((a, b) => new Date(b.date) - new Date(a.date));
        stats.recentGames = allGames.slice(0, 10);

        // Thống kê flashcard
        const flashcardStats = {
            total: Object.keys(data.flashcardProgress).length,
            mastered: Object.values(data.flashcardProgress).filter(p => p.mastered).length,
            toReview: this.getCardsToReview().length
        };
        stats.flashcardStats = flashcardStats;

        // Tiến độ học tập
        stats.progress = data.progress;

        return stats;
    }

    /**
     * Lấy tất cả thành tích với thông tin chi tiết
     */
    getAllAchievements(unlockedIds) {
        const allAchievements = [
            { id: 'first_game', name: 'Lần đầu tiên', icon: '🎮', description: 'Chơi game lần đầu tiên' },
            { id: 'veteran', name: 'Người chơi kỳ cựu', icon: '🏅', description: 'Chơi 10 lần' },
            { id: 'master', name: 'Bậc thầy', icon: '🏆', description: 'Chơi 50 lần' },
            { id: 'perfect_score', name: 'Điểm tuyệt đối', icon: '⭐', description: 'Đạt 100 điểm' },
            { id: 'level_5', name: 'Chuyên gia', icon: '🎓', description: 'Đạt level 5' }
        ];

        return allAchievements.map(ach => ({
            ...ach,
            unlocked: unlockedIds.includes(ach.id)
        }));
    }

    /**
     * Xuất dữ liệu dạng JSON
     */
    exportData() {
        const data = this.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `khtn-student-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Nhập dữ liệu từ file
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Xóa toàn bộ dữ liệu
     */
    clearData() {
        if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu học tập? Hành động này không thể hoàn tác!')) {
            localStorage.removeItem(this.storageKey);
            this.initStorage();
            location.reload();
        }
    }

    /**
     * Sao lưu dữ liệu tự động
     */
    autoBackup() {
        const data = this.getData();
        const backupKey = `${this.storageKey}_backup_${new Date().toISOString().split('T')[0]}`;
        localStorage.setItem(backupKey, JSON.stringify(data));
        
        // Xóa backup cũ hơn 7 ngày
        const keys = Object.keys(localStorage);
        const backupKeys = keys.filter(k => k.startsWith(`${this.storageKey}_backup_`));
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        backupKeys.forEach(key => {
            const dateStr = key.split('_backup_')[1];
            const backupDate = new Date(dateStr);
            if (backupDate < sevenDaysAgo) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Khởi tạo storage
const storage = new DataStorage();

// Backup tự động mỗi ngày
const lastBackupDate = localStorage.getItem('last_backup_date');
const today = new Date().toISOString().split('T')[0];

if (!lastBackupDate || lastBackupDate !== today) {
    storage.autoBackup();
    localStorage.setItem('last_backup_date', today);
}
