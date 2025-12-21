/**
 * AI Engine Module - Mô phỏng các tính năng AI cho việc tạo nội dung học tập
 * Sử dụng thuật toán để tạo câu hỏi, đánh giá và gợi ý
 */

class AIEngine {
    constructor() {
        this.knowledgeBase = this.initKnowledgeBase();
        this.difficultyLevels = ['easy', 'medium', 'hard'];
    }

    /**
     * Khởi tạo cơ sở kiến thức về khoa học tự nhiên THCS
     */
    initKnowledgeBase() {
        return {
            biology: {
                grade6: [
                    {
                        topic: 'Tế bào',
                        concepts: [
                            { term: 'Tế bào', definition: 'Đơn vị cơ bản cấu tạo nên cơ thể sinh vật', difficulty: 'easy' },
                            { term: 'Nhân tế bào', definition: 'Bộ phận chứa vật chất di truyền của tế bào', difficulty: 'medium' },
                            { term: 'Màng tế bào', definition: 'Lớp màng bao bọc và bảo vệ tế bào', difficulty: 'easy' },
                            { term: 'Tế bào chất', definition: 'Phần nội dung bên trong tế bào, chứa các bào quan', difficulty: 'medium' }
                        ],
                        questions: [
                            {
                                question: 'Đơn vị cơ bản cấu tạo nên cơ thể sinh vật là gì?',
                                options: ['Tế bào', 'Mô', 'Cơ quan', 'Hệ cơ quan'],
                                correct: 0,
                                difficulty: 'easy'
                            },
                            {
                                question: 'Bộ phận nào của tế bào chứa vật chất di truyền?',
                                options: ['Màng tế bào', 'Nhân tế bào', 'Tế bào chất', 'Không bào'],
                                correct: 1,
                                difficulty: 'medium'
                            }
                        ]
                    },
                    {
                        topic: 'Sinh sản',
                        concepts: [
                            { term: 'Sinh sản', definition: 'Quá trình sinh vật tạo ra cá thể mới cùng loài', difficulty: 'easy' },
                            { term: 'Sinh sản hữu tính', definition: 'Sinh sản có sự kết hợp của giao tử đực và cái', difficulty: 'medium' },
                            { term: 'Sinh sản vô tính', definition: 'Sinh sản không qua sự kết hợp giao tử', difficulty: 'medium' }
                        ]
                    }
                ],
                grade7: [
                    {
                        topic: 'Quang hợp',
                        concepts: [
                            { term: 'Quang hợp', definition: 'Quá trình cây xanh tạo chất hữu cơ từ CO2 và H2O nhờ năng lượng ánh sáng', difficulty: 'medium' },
                            { term: 'Diệp lục', definition: 'Chất màu xanh trong lá cây, hấp thụ ánh sáng cho quang hợp', difficulty: 'medium' }
                        ]
                    }
                ]
            },
            physics: {
                grade6: [
                    {
                        topic: 'Chuyển động',
                        concepts: [
                            { term: 'Chuyển động cơ học', definition: 'Sự thay đổi vị trí của vật theo thời gian', difficulty: 'easy' },
                            { term: 'Vận tốc', definition: 'Độ lớn quãng đường đi được trong một đơn vị thời gian', difficulty: 'medium' },
                            { term: 'Quỹ đạo', definition: 'Đường đi của vật khi chuyển động', difficulty: 'easy' }
                        ],
                        questions: [
                            {
                                question: 'Vận tốc là đại lượng đặc trưng cho?',
                                options: ['Độ nhanh chậm của chuyển động', 'Quãng đường', 'Thời gian', 'Lực'],
                                correct: 0,
                                difficulty: 'easy'
                            }
                        ]
                    },
                    {
                        topic: 'Ánh sáng',
                        concepts: [
                            { term: 'Nguồn sáng', definition: 'Vật phát ra ánh sáng', difficulty: 'easy' },
                            { term: 'Phản xạ ánh sáng', definition: 'Hiện tượng ánh sáng bị hắt lại khi gặp bề mặt vật', difficulty: 'medium' },
                            { term: 'Khúc xạ ánh sáng', definition: 'Hiện tượng tia sáng bị gẫy khúc khi truyền qua hai môi trường', difficulty: 'hard' }
                        ]
                    }
                ],
                grade8: [
                    {
                        topic: 'Áp suất',
                        concepts: [
                            { term: 'Áp suất', definition: 'Độ lớn của áp lực trên một đơn vị diện tích', difficulty: 'medium' },
                            { term: 'Áp suất khí quyển', definition: 'Áp suất do lớp khí quyển gây ra', difficulty: 'medium' }
                        ]
                    }
                ]
            },
            chemistry: {
                grade8: [
                    {
                        topic: 'Nguyên tử phân tử',
                        concepts: [
                            { term: 'Nguyên tử', definition: 'Hạt vô cùng nhỏ, trung hòa về điện, tạo nên các chất', difficulty: 'easy' },
                            { term: 'Phân tử', definition: 'Hạt đại diện cho chất, gồm một hay nhiều nguyên tử liên kết với nhau', difficulty: 'medium' },
                            { term: 'Nguyên tố hóa học', definition: 'Tập hợp các nguyên tử cùng loại có cùng số proton', difficulty: 'hard' }
                        ],
                        questions: [
                            {
                                question: 'Nguyên tử là gì?',
                                options: ['Hạt nhỏ nhất của chất', 'Hạt mang điện dương', 'Hạt vô cùng nhỏ, trung hòa điện', 'Hạt mang điện âm'],
                                correct: 2,
                                difficulty: 'easy'
                            }
                        ]
                    },
                    {
                        topic: 'Phản ứng hóa học',
                        concepts: [
                            { term: 'Phản ứng hóa học', definition: 'Quá trình biến đổi chất này thành chất khác', difficulty: 'medium' },
                            { term: 'Chất tham gia', definition: 'Chất ban đầu trong phản ứng hóa học', difficulty: 'easy' },
                            { term: 'Sản phẩm', definition: 'Chất tạo thành sau phản ứng hóa học', difficulty: 'easy' }
                        ]
                    }
                ],
                grade9: [
                    {
                        topic: 'Kim loại',
                        concepts: [
                            { term: 'Kim loại', definition: 'Nhóm các nguyên tố có tính chất vật lý đặc trưng như ánh kim, dẫn điện, dẫn nhiệt', difficulty: 'easy' },
                            { term: 'Dãy hoạt động hóa học', definition: 'Dãy sắp xếp các kim loại theo mức độ hoạt động hóa học giảm dần', difficulty: 'hard' }
                        ]
                    }
                ]
            }
        };
    }

    /**
     * Tạo câu hỏi trắc nghiệm tự động dựa trên lớp học
     */
    generateQuiz(grade, numQuestions = 10) {
        const allQuestions = [];
        
        // Thu thập tất cả câu hỏi có sẵn
        for (const subject in this.knowledgeBase) {
            const gradeKey = `grade${grade}`;
            if (this.knowledgeBase[subject][gradeKey]) {
                this.knowledgeBase[subject][gradeKey].forEach(topic => {
                    if (topic.questions) {
                        topic.questions.forEach(q => {
                            allQuestions.push({
                                ...q,
                                topic: topic.topic,
                                subject
                            });
                        });
                    }
                });
            }
        }

        // Tạo thêm câu hỏi từ concepts nếu không đủ
        if (allQuestions.length < numQuestions) {
            for (const subject in this.knowledgeBase) {
                const gradeKey = `grade${grade}`;
                if (this.knowledgeBase[subject][gradeKey]) {
                    this.knowledgeBase[subject][gradeKey].forEach(topic => {
                        if (topic.concepts) {
                            topic.concepts.forEach(concept => {
                                allQuestions.push(this.generateQuestionFromConcept(concept, topic.topic, subject));
                            });
                        }
                    });
                }
            }
        }

        // Chọn ngẫu nhiên và shuffle
        const shuffled = this.shuffleArray(allQuestions);
        return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
    }

    /**
     * Tạo câu hỏi từ concept
     */
    generateQuestionFromConcept(concept, topic, subject) {
        const templates = [
            {
                question: `${concept.term} là gì?`,
                makeOptions: (correct) => {
                    const options = [correct.definition];
                    const distractors = this.generateDistractors(correct.definition, 3);
                    return this.shuffleArray([...options, ...distractors]);
                }
            },
            {
                question: `Định nghĩa nào sau đây đúng về ${concept.term}?`,
                makeOptions: (correct) => {
                    const options = [correct.definition];
                    const distractors = this.generateDistractors(correct.definition, 3);
                    return this.shuffleArray([...options, ...distractors]);
                }
            }
        ];

        const template = templates[Math.floor(Math.random() * templates.length)];
        const options = template.makeOptions(concept);
        const correctIndex = options.indexOf(concept.definition);

        return {
            question: template.question,
            options,
            correct: correctIndex,
            difficulty: concept.difficulty,
            topic,
            subject
        };
    }

    /**
     * Tạo các đáp án nhiễu (distractors)
     */
    generateDistractors(correctAnswer, count) {
        const distractors = [
            'Quá trình tạo ra năng lượng từ ánh sáng mặt trời',
            'Đơn vị đo lường trong hệ thống quốc tế',
            'Hiện tượng xảy ra trong điều kiện nhiệt độ cao',
            'Chất có khả năng tham gia phản ứng hóa học',
            'Bộ phận quan trọng trong cấu trúc sinh học',
            'Quá trình biến đổi năng lượng từ dạng này sang dạng khác',
            'Tính chất vật lý đặc trưng của vật chất',
            'Yếu tố ảnh hưởng đến tốc độ phản ứng',
            'Đặc điểm của các hợp chất hữu cơ',
            'Hiện tượng tự nhiên thường gặp trong môi trường'
        ];

        const filtered = distractors.filter(d => d !== correctAnswer);
        return this.shuffleArray(filtered).slice(0, count);
    }

    /**
     * Tạo flashcards cho một lớp học
     */
    generateFlashcards(grade, subject = null) {
        const cards = [];
        
        for (const subj in this.knowledgeBase) {
            if (subject && subj !== subject) continue;
            
            const gradeKey = `grade${grade}`;
            if (this.knowledgeBase[subj][gradeKey]) {
                this.knowledgeBase[subj][gradeKey].forEach(topic => {
                    if (topic.concepts) {
                        topic.concepts.forEach(concept => {
                            cards.push({
                                id: `${subj}_${topic.topic}_${concept.term}`.replace(/\s/g, '_'),
                                term: concept.term,
                                definition: concept.definition,
                                topic: topic.topic,
                                subject: subj,
                                difficulty: concept.difficulty
                            });
                        });
                    }
                });
            }
        }

        return this.shuffleArray(cards);
    }

    /**
     * Tạo bài tập ghép đôi
     */
    generateMatchingPairs(grade, numPairs = 8) {
        const cards = this.generateFlashcards(grade);
        const selected = cards.slice(0, numPairs);
        
        const terms = selected.map(c => ({ type: 'term', content: c.term, id: c.id }));
        const definitions = selected.map(c => ({ type: 'definition', content: c.definition, id: c.id }));
        
        return {
            pairs: selected.map(c => ({ term: c.term, definition: c.definition, id: c.id })),
            shuffled: this.shuffleArray([...terms, ...definitions])
        };
    }

    /**
     * Tạo bài tập điền từ
     */
    generateFillBlanks(grade, numQuestions = 5) {
        const cards = this.generateFlashcards(grade);
        const questions = [];

        for (let i = 0; i < Math.min(numQuestions, cards.length); i++) {
            const card = cards[i];
            
            // Tạo câu với chỗ trống
            const sentences = [
                `_____ là ${card.definition.toLowerCase()}.`,
                `Khái niệm "${card.term}" có nghĩa là _____.`,
                `Trong khoa học, _____ được định nghĩa là ${card.definition.toLowerCase()}.`
            ];
            
            const sentence = sentences[Math.floor(Math.random() * sentences.length)];
            const answer = sentence.includes('_____')  && sentence.indexOf('_____') === 0 ? card.term : card.definition;
            
            questions.push({
                sentence,
                answer,
                topic: card.topic,
                hints: this.generateHints(answer)
            });
        }

        return questions;
    }

    /**
     * Tạo gợi ý cho câu trả lời
     */
    generateHints(answer) {
        const hints = [];
        
        // Gợi ý số chữ cái
        hints.push(`Có ${answer.length} ký tự`);
        
        // Gợi ý chữ cái đầu
        hints.push(`Bắt đầu bằng "${answer.charAt(0)}"`);
        
        // Gợi ý chữ cái cuối
        if (answer.length > 3) {
            hints.push(`Kết thúc bằng "${answer.charAt(answer.length - 1)}"`);
        }

        return hints;
    }

    /**
     * Đánh giá câu trả lời của học sinh
     */
    evaluateAnswer(userAnswer, correctAnswer) {
        const normalizedUser = this.normalizeText(userAnswer);
        const normalizedCorrect = this.normalizeText(correctAnswer);
        
        // Khớp chính xác
        if (normalizedUser === normalizedCorrect) {
            return { correct: true, similarity: 100 };
        }

        // Tính độ tương đồng
        const similarity = this.calculateSimilarity(normalizedUser, normalizedCorrect);
        
        return {
            correct: similarity > 0.8,
            similarity: Math.round(similarity * 100),
            feedback: this.generateFeedback(similarity)
        };
    }

    /**
     * Chuẩn hóa text để so sánh
     */
    normalizeText(text) {
        return text.toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
            .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
            .replace(/[íìỉĩị]/g, 'i')
            .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
            .replace(/[úùủũụưứừửữự]/g, 'u')
            .replace(/[ýỳỷỹỵ]/g, 'y')
            .replace(/đ/g, 'd');
    }

    /**
     * Tính độ tương đồng giữa hai chuỗi (Levenshtein distance)
     */
    calculateSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = [];

        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        const distance = matrix[len1][len2];
        const maxLen = Math.max(len1, len2);
        return 1 - distance / maxLen;
    }

    /**
     * Tạo phản hồi dựa trên độ tương đồng
     */
    generateFeedback(similarity) {
        if (similarity >= 0.9) {
            return 'Gần đúng! Kiểm tra lại chính tả.';
        } else if (similarity >= 0.7) {
            return 'Câu trả lời chưa chính xác. Hãy thử lại!';
        } else {
            return 'Câu trả lời chưa đúng. Xem gợi ý nhé!';
        }
    }

    /**
     * Đề xuất chủ đề cần học dựa trên hiệu suất
     */
    recommendTopics(stats) {
        const recommendations = [];
        
        // Phân tích điểm yếu
        if (stats.progress && stats.progress.weakAreas) {
            stats.progress.weakAreas.forEach(area => {
                recommendations.push({
                    topic: area,
                    reason: 'Cần cải thiện',
                    priority: 'high'
                });
            });
        }

        // Đề xuất chủ đề tiếp theo dựa trên level
        const grade = stats.student.grade;
        const completedCount = stats.progress ? stats.progress.completedTopics.length : 0;
        
        // Lấy chủ đề chưa hoàn thành
        const allTopics = [];
        for (const subject in this.knowledgeBase) {
            const gradeKey = `grade${grade}`;
            if (this.knowledgeBase[subject][gradeKey]) {
                this.knowledgeBase[subject][gradeKey].forEach(topic => {
                    if (stats.progress && !stats.progress.completedTopics.includes(topic.topic)) {
                        allTopics.push({
                            topic: topic.topic,
                            subject,
                            reason: 'Chủ đề mới',
                            priority: 'medium'
                        });
                    }
                });
            }
        }

        recommendations.push(...allTopics.slice(0, 3));

        return recommendations;
    }

    /**
     * Điều chỉnh độ khó dựa trên hiệu suất
     */
    adaptiveDifficulty(accuracy, currentDifficulty) {
        const difficultyIndex = this.difficultyLevels.indexOf(currentDifficulty);
        
        if (accuracy >= 0.8 && difficultyIndex < 2) {
            return this.difficultyLevels[difficultyIndex + 1];
        } else if (accuracy < 0.5 && difficultyIndex > 0) {
            return this.difficultyLevels[difficultyIndex - 1];
        }
        
        return currentDifficulty;
    }

    /**
     * Xáo trộn mảng (Fisher-Yates shuffle)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Tạo thí nghiệm ảo
     */
    generateExperiment(grade, topic = null) {
        const experiments = {
            6: [
                {
                    name: 'Quan sát tế bào hành',
                    description: 'Quan sát cấu trúc tế bào thực vật',
                    tools: ['Kính hiển vi', 'Lam kính', 'Hành tây', 'Dung dịch iốt'],
                    steps: [
                        'Lấy một lớp vảy hành mỏng',
                        'Đặt lên lam kính',
                        'Nhỏ vài giọt dung dịch iốt',
                        'Quan sát dưới kính hiển vi'
                    ],
                    result: 'Quan sát thấy các tế bào hình chữ nhật với màng, nhân và tế bào chất được nhuộm màu'
                }
            ],
            7: [
                {
                    name: 'Thí nghiệm quang hợp',
                    description: 'Chứng minh cây xanh tạo ra oxy khi quang hợp',
                    tools: ['Cây thủy sinh', 'Ống nghiệm', 'Đèn chiếu sáng', 'Nước'],
                    steps: [
                        'Đặt cây thủy sinh trong nước',
                        'Đậy ống nghiệm úp ngược lên cây',
                        'Chiếu đèn vào cây',
                        'Quan sát bọt khí thoát ra'
                    ],
                    result: 'Có bọt khí oxy thoát ra, tập trung ở đỉnh ống nghiệm'
                }
            ],
            8: [
                {
                    name: 'Đo áp suất khí quyển',
                    description: 'Thí nghiệm Torricelli',
                    tools: ['Ống thủy tinh', 'Thủy ngân', 'Chậu thủy ngân'],
                    steps: [
                        'Đổ đầy thủy ngân vào ống',
                        'Úp ngược ống vào chậu thủy ngân',
                        'Đo chiều cao cột thủy ngân',
                        'Ghi nhận kết quả'
                    ],
                    result: 'Cột thủy ngân cao khoảng 76cm, tương ứng áp suất khí quyển'
                }
            ]
        };

        const gradeExperiments = experiments[grade] || [];
        return gradeExperiments[Math.floor(Math.random() * gradeExperiments.length)];
    }
}

// Khởi tạo AI Engine
const aiEngine = new AIEngine();
