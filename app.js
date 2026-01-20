// アプリケーション状態管理
let appState = {
    currentPage: 'top-page',
    testMode: null, // 'official' or 'custom'
    selectedCategories: [],
    questionCount: 20,
    testQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    testStartTime: null,
    testEndTime: null
};

// ページ遷移
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    appState.currentPage = pageId;
}

// トップページに戻る
function goToTop() {
    appState = {
        currentPage: 'top-page',
        testMode: null,
        selectedCategories: [],
        questionCount: 20,
        testQuestions: [],
        currentQuestionIndex: 0,
        userAnswers: {},
        testStartTime: null,
        testEndTime: null
    };
    showPage('top-page');
}

// テストモード開始
function startTestMode(mode) {
    appState.testMode = mode;
    if (mode === 'official') {
        // 本番形式モード：全問題からランダムに選択（実際の試験問題数に合わせて調整）
        startOfficialTest();
    } else {
        // カスタムモード：設定画面を表示
        showPage('test-setup-page');
        initializeCategoryCheckboxes();
    }
}

// カテゴリチェックボックスの初期化
function initializeCategoryCheckboxes() {
    const container = document.getElementById('category-checkboxes');
    container.innerHTML = '';
    
    Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'category-checkbox-item';
        checkboxItem.innerHTML = `
            <input type="checkbox" id="cat-${categoryId}" value="${categoryId}" checked>
            <label for="cat-${categoryId}">${category.name}</label>
        `;
        container.appendChild(checkboxItem);
    });
}

// 本番形式モード開始
function startOfficialTest() {
    // 全カテゴリからランダムに問題を選択（実際の試験問題数に合わせて調整）
    const officialQuestionCount = 50; // 実際の試験問題数に合わせて変更可能
    appState.testQuestions = getRandomQuestions(allCategories(), officialQuestionCount);
    appState.questionCount = appState.testQuestions.length;
    appState.userAnswers = {};
    appState.currentQuestionIndex = 0;
    appState.testStartTime = new Date();
    startTest();
}

// カスタムテスト開始
function startCustomTest() {
    // 選択されたカテゴリを取得
    const selectedCheckboxes = document.querySelectorAll('#category-checkboxes input[type="checkbox"]:checked');
    appState.selectedCategories = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    if (appState.selectedCategories.length === 0) {
        alert('少なくとも1つの分野を選択してください。');
        return;
    }
    
    // 問題数を取得
    appState.questionCount = parseInt(document.getElementById('question-count').value);
    
    // 選択されたカテゴリから問題を抽出
    const availableQuestions = questions.filter(q => appState.selectedCategories.includes(q.category));
    
    if (availableQuestions.length < appState.questionCount) {
        alert(`選択した分野には${availableQuestions.length}問しかありません。問題数を調整してください。`);
        return;
    }
    
    // ランダムに問題を選択
    appState.testQuestions = getRandomQuestions(appState.selectedCategories, appState.questionCount);
    appState.userAnswers = {};
    appState.currentQuestionIndex = 0;
    appState.testStartTime = new Date();
    startTest();
}

// ランダムに問題を取得
function getRandomQuestions(categoryList, count) {
    const availableQuestions = questions.filter(q => categoryList.includes(q.category));
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 全カテゴリを返す
function allCategories() {
    return Object.keys(categories);
}

// テスト開始
function startTest() {
    showPage('test-page');
    updateTestHeader();
    renderQuestionNavigation();
    renderQuestion();
    startTimer();
}

// テストヘッダー更新
function updateTestHeader() {
    const modeLabel = document.getElementById('test-mode-label');
    if (appState.testMode === 'official') {
        modeLabel.textContent = '本番形式モード';
    } else {
        modeLabel.textContent = 'カスタムモード';
    }
    
    document.getElementById('total-question-num').textContent = appState.testQuestions.length;
}

// タイマー開始
let timerInterval = null;
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (!appState.testStartTime) return;
        const elapsed = Math.floor((new Date() - appState.testStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('test-timer').textContent = 
            `経過時間: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// 問題ナビゲーション表示
function renderQuestionNavigation() {
    const container = document.getElementById('question-navigation');
    container.innerHTML = '';
    
    appState.testQuestions.forEach((q, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'question-nav-item';
        if (index === appState.currentQuestionIndex) {
            navItem.classList.add('current');
        }
        if (appState.userAnswers[index]) {
            navItem.classList.add('answered');
        }
        navItem.textContent = index + 1;
        navItem.onclick = () => navigateToQuestion(index);
        container.appendChild(navItem);
    });
}

// 問題表示
function renderQuestion() {
    const question = appState.testQuestions[appState.currentQuestionIndex];
    if (!question) return;
    
    document.getElementById('question-number').textContent = appState.currentQuestionIndex + 1;
    document.getElementById('current-question-num').textContent = appState.currentQuestionIndex + 1;
    document.getElementById('question-category').textContent = categories[question.category].name;
    document.getElementById('question-text').textContent = question.question;
    
    // 画像表示
    const imageContainer = document.getElementById('question-image');
    if (question.image) {
        imageContainer.innerHTML = `<img src="${question.image}" alt="問題画像">`;
    } else {
        imageContainer.innerHTML = '';
    }
    
    // 選択肢表示
    renderChoices(question);
    
    // ナビゲーションボタン更新
    updateNavigationButtons();
}

// 選択肢表示
function renderChoices(question) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    
    const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
    const inputName = `question-${appState.currentQuestionIndex}`;
    
    question.choices.forEach((choice, index) => {
        const choiceItem = document.createElement('div');
        choiceItem.className = 'choice-item';
        
        const input = document.createElement('input');
        input.type = inputType;
        input.name = inputName;
        input.id = `${inputName}-${index}`;
        input.value = choice.label;
        
        // 既存の回答を復元
        const currentAnswer = appState.userAnswers[appState.currentQuestionIndex];
        if (currentAnswer && currentAnswer.includes(choice.label)) {
            input.checked = true;
            choiceItem.classList.add('selected');
        }
        
        input.addEventListener('change', () => handleAnswerChange(question, choice.label));
        
        const label = document.createElement('label');
        label.htmlFor = `${inputName}-${index}`;
        label.innerHTML = `<strong>${choice.label}.</strong> ${choice.text}`;
        
        choiceItem.appendChild(input);
        choiceItem.appendChild(label);
        container.appendChild(choiceItem);
    });
}

// 回答変更処理
function handleAnswerChange(question, choiceLabel) {
    const questionIndex = appState.currentQuestionIndex;
    
    if (question.type === 'multiple') {
        // 複数選択
        if (!appState.userAnswers[questionIndex]) {
            appState.userAnswers[questionIndex] = [];
        }
        const index = appState.userAnswers[questionIndex].indexOf(choiceLabel);
        if (index > -1) {
            appState.userAnswers[questionIndex].splice(index, 1);
        } else {
            appState.userAnswers[questionIndex].push(choiceLabel);
        }
    } else {
        // 単一選択
        appState.userAnswers[questionIndex] = [choiceLabel];
    }
    
    // UI更新
    renderQuestionNavigation();
    updateChoiceItems();
}

// 選択肢の見た目更新
function updateChoiceItems() {
    const question = appState.testQuestions[appState.currentQuestionIndex];
    const currentAnswer = appState.userAnswers[appState.currentQuestionIndex] || [];
    
    document.querySelectorAll('.choice-item').forEach((item, index) => {
        const input = item.querySelector('input');
        if (currentAnswer.includes(input.value)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// ナビゲーションボタン更新
function updateNavigationButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnSubmit = document.getElementById('btn-submit');
    
    btnPrev.disabled = appState.currentQuestionIndex === 0;
    btnNext.style.display = appState.currentQuestionIndex < appState.testQuestions.length - 1 ? 'block' : 'none';
    btnSubmit.style.display = appState.currentQuestionIndex === appState.testQuestions.length - 1 ? 'block' : 'none';
}

// 問題ナビゲーション
function navigateQuestion(direction) {
    const newIndex = appState.currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < appState.testQuestions.length) {
        navigateToQuestion(newIndex);
    }
}

// 特定の問題に移動
function navigateToQuestion(index) {
    appState.currentQuestionIndex = index;
    renderQuestion();
    renderQuestionNavigation();
}

// テスト終了
function submitTest() {
    if (confirm('テストを終了しますか？')) {
        appState.testEndTime = new Date();
        if (timerInterval) clearInterval(timerInterval);
        calculateResults();
        showResults();
    }
}

// 結果計算
function calculateResults() {
    appState.results = {
        total: appState.testQuestions.length,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
        categoryScores: {},
        questionResults: []
    };
    
    // カテゴリ別スコア初期化
    Object.keys(categories).forEach(catId => {
        appState.results.categoryScores[catId] = { total: 0, correct: 0 };
    });
    
    // 各問題の結果を計算
    appState.testQuestions.forEach((question, index) => {
        const userAnswer = appState.userAnswers[index] || [];
        const correctAnswer = question.answer;
        
        // 回答をソートして比較
        const userAnswerSorted = [...userAnswer].sort().join(',');
        const correctAnswerSorted = [...correctAnswer].sort().join(',');
        
        const isCorrect = userAnswerSorted === correctAnswerSorted;
        
        if (userAnswer.length === 0) {
            appState.results.unanswered++;
        } else if (isCorrect) {
            appState.results.correct++;
            appState.results.categoryScores[question.category].correct++;
        } else {
            appState.results.incorrect++;
        }
        
        appState.results.categoryScores[question.category].total++;
        
        appState.results.questionResults.push({
            question: question,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        });
    });
}

// 結果表示
function showResults() {
    showPage('result-page');
    
    // 総合スコア
    const totalScore = appState.results.correct;
    const totalQuestions = appState.results.total;
    const percentage = Math.round((totalScore / totalQuestions) * 100);
    
    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    
    // 分野別スコア
    renderCategoryScores();
    
    // 問題別結果
    renderQuestionResults();
}

// 分野別スコア表示
function renderCategoryScores() {
    const container = document.getElementById('category-scores');
    container.innerHTML = '';
    
    Object.keys(appState.results.categoryScores).forEach(catId => {
        const score = appState.results.categoryScores[catId];
        if (score.total === 0) return;
        
        const percentage = Math.round((score.correct / score.total) * 100);
        const category = categories[catId];
        
        const scoreItem = document.createElement('div');
        scoreItem.className = 'category-score-item';
        scoreItem.style.borderLeft = `4px solid ${category.color}`;
        scoreItem.innerHTML = `
            <h3>${category.name}</h3>
            <div class="score">${score.correct} / ${score.total}</div>
            <div style="color: #666; margin-top: 5px;">${percentage}%</div>
        `;
        container.appendChild(scoreItem);
    });
}

// 問題別結果表示
function renderQuestionResults() {
    const container = document.getElementById('question-results');
    container.innerHTML = '';
    
    appState.results.questionResults.forEach((result, index) => {
        const question = result.question;
        const resultItem = document.createElement('div');
        resultItem.className = `question-result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        
        const userAnswerText = result.userAnswer.length > 0 
            ? result.userAnswer.join(', ') 
            : '未回答';
        
        resultItem.innerHTML = `
            <div class="question-result-header">
                <span class="question-result-number">問題 ${index + 1}</span>
                <span class="question-result-mark">${result.isCorrect ? '○' : '×'}</span>
            </div>
            <div class="question-result-text">${question.question}</div>
            <div class="question-result-answer">
                <strong>あなたの回答:</strong> ${userAnswerText}<br>
                <strong>正解:</strong> ${result.correctAnswer.join(', ')}
            </div>
            <div class="question-result-explanation">
                <strong>解説:</strong> ${question.explanation}
            </div>
        `;
        container.appendChild(resultItem);
    });
}

// PDF出力
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    
    // ヘッダー情報
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('マンモグラフィー検定テスト結果', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const testDate = appState.testStartTime.toLocaleString('ja-JP');
    doc.text(`実施日時: ${testDate}`, margin, yPos);
    yPos += 5;
    doc.text(`テスト種別: ${appState.testMode === 'official' ? '本番形式モード' : 'カスタムモード'}`, margin, yPos);
    yPos += 5;
    if (appState.testMode === 'custom' && appState.selectedCategories.length > 0) {
        const selectedCategoryNames = appState.selectedCategories.map(cat => categories[cat].name).join(', ');
        doc.text(`選択分野: ${selectedCategoryNames}`, margin, yPos);
        yPos += 5;
    }
    yPos += 5;
    
    // スコアサマリー
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('スコアサマリー', margin, yPos);
    yPos += 8;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const totalScore = appState.results.correct;
    const totalQuestions = appState.results.total;
    const percentage = Math.round((totalScore / totalQuestions) * 100);
    doc.text(`総合得点: ${totalScore} / ${totalQuestions} (${percentage}%)`, margin, yPos);
    yPos += 6;
    
    // 分野別スコア（表形式）
    if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('分野別スコア', margin, yPos);
    yPos += 8;
    
    const categoryData = [];
    Object.keys(appState.results.categoryScores).forEach(catId => {
        const score = appState.results.categoryScores[catId];
        if (score.total > 0) {
            const catPercentage = Math.round((score.correct / score.total) * 100);
            categoryData.push([
                categories[catId].name,
                `${score.correct} / ${score.total}`,
                `${catPercentage}%`
            ]);
        }
    });
    
    if (categoryData.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['分野', '正答数', '正答率']],
            body: categoryData,
            margin: { left: margin, right: margin },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [102, 126, 234] }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // 問題別詳細
    appState.results.questionResults.forEach((result, index) => {
        if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = 20;
        }
        
        const question = result.question;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`問題 ${index + 1} ${result.isCorrect ? '○' : '×'}`, margin, yPos);
        yPos += 6;
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const questionText = doc.splitTextToSize(question.question, pageWidth - 2 * margin);
        doc.text(questionText, margin, yPos);
        yPos += questionText.length * lineHeight + 3;
        
        const userAnswerText = result.userAnswer.length > 0 
            ? result.userAnswer.join(', ') 
            : '未回答';
        doc.text(`あなたの回答: ${userAnswerText}`, margin, yPos);
        yPos += 5;
        doc.text(`正解: ${result.correctAnswer.join(', ')}`, margin, yPos);
        yPos += 5;
        
        const explanation = doc.splitTextToSize(`解説: ${question.explanation}`, pageWidth - 2 * margin);
        doc.text(explanation, margin, yPos);
        yPos += explanation.length * lineHeight + 8;
    });
    
    // フッター
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`ページ ${i} / ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // PDFダウンロード
    const fileName = `マンモグラフィーテスト結果_${testDate.replace(/[\/\s:]/g, '_')}.pdf`;
    doc.save(fileName);
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    showPage('top-page');
});
