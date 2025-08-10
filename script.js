document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
    let chatHistory = [];

    // --- Main Initialization ---
    function initializeApp() {
        window.scrollTo(0, 0);
        initTheme();
        initLoading();
        initCursor();
        initParticles();
        initNavigation();
        initScrollAnimations();
        initTiltEffect();
        initDataViz();
        initAILab();
        initGames();
        initBlog();
        initContactForm();
        initBackToTop();
    }

    // --- Core Modules ---
    function initTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let isDark = localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && prefersDark);
        
        const applyTheme = () => {
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
        };
        
        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyTheme();
        });
        applyTheme();
    }

    function initLoading() {
        const loadingScreen = document.getElementById('loading');
        if (!loadingScreen) return;
        const progress = document.querySelector('.progress');
        let progressValue = 0;
        const interval = setInterval(() => {
            progressValue += Math.random() * 15;
            if (progressValue >= 100) {
                progressValue = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hide');
                    setTimeout(() => loadingScreen.remove(), 800);
                }, 500);
            }
            if(progress) progress.style.width = progressValue + '%';
        }, 150);
    }

    function initCursor() {
        if (!matchMedia('(pointer:fine)').matches) return;
        const cursor = document.querySelector('.cursor');
        const trail = document.querySelector('.cursor-trail');
        let mouseX = -100, mouseY = -100, trailX = -100, trailY = -100;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            cursor.style.transform = `translate(${mouseX - cursor.offsetWidth / 2}px, ${mouseY - cursor.offsetHeight / 2}px)`;
            trailX += (mouseX - trailX) * 0.2;
            trailY += (mouseY - trailY) * 0.2;
            trail.style.transform = `translate(${trailX - trail.offsetWidth / 2}px, ${trailY - trail.offsetHeight / 2}px)`;
            requestAnimationFrame(animate);
        };
        animate();
    }

    function initParticles() {
        const canvas = document.getElementById('particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', event => { mouse.x = event.x; mouse.y = event.y; });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.fillStyle = `${primaryColor}33`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            connect();
            requestAnimationFrame(animate);
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = Math.sqrt(Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2));
                    if (distance < 100) {
                        let opacity = 1 - (distance / 100);
                        ctx.strokeStyle = `rgba(0, 255, 136, ${opacity * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        window.addEventListener('resize', debounce(resize, 250));
        resize();
        animate();
    }
    
    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                    });
                }
            });
        }, { rootMargin: "-40% 0px -60% 0px" });

        document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

        navMenu.addEventListener('click', e => {
            if (e.target.closest('.nav-link')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    if (entry.target.matches('.hero-stats')) animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    }

    function initTiltEffect() {
        if (!matchMedia('(pointer:fine)').matches) return;
        document.querySelectorAll('[data-tilt]').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                el.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale3d(1.03, 1.03, 1.03)`;
            });
            el.addEventListener('mouseleave', () => el.style.transform = '');
        });
    }

    function animateCounters(container) {
        container.querySelectorAll('[data-count]').forEach(counter => {
            const target = +counter.dataset.count;
            let current = 0;
            const update = () => {
                const increment = Math.ceil((target - current) / 20);
                current += increment;
                if (current < target) {
                    counter.textContent = current;
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            update();
        });
    }

    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', () => btn.style.display = window.pageYOffset > 300 ? 'flex' : 'none');
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const status = document.getElementById('form-status');
            status.textContent = 'Mesajınız gönderiliyor...';
            status.className = 'form-status success';
            status.style.display = 'block';
            setTimeout(() => {
                status.textContent = 'Mesajınız başarıyla gönderildi!';
                form.reset();
                setTimeout(() => status.style.display = 'none', 3000);
            }, 1500);
        });
    }
    
    // --- Data Visualization ---
    function initDataViz() {
        const container = document.getElementById('chart-container');
        if (!container || typeof d3 === 'undefined') return;

        const data = [
            { month: 'Ocak', units: 65, efficiency: 91 },
            { month: 'Şubat', units: 59, efficiency: 92 },
            { month: 'Mart', units: 80, efficiency: 88 },
            { month: 'Nisan', units: 81, efficiency: 89 },
            { month: 'Mayıs', units: 56, efficiency: 93 },
            { month: 'Haziran', units: 55, efficiency: 95 },
            { month: 'Temmuz', units: 40, efficiency: 94 }
        ];

        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#chart-container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.month))
            .padding(0.2);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("fill", "var(--text-secondary)");

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "var(--text-secondary)");

        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.month))
            .attr("y", d => y(d.units))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.units))
            .attr("fill", "var(--primary-color)")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "var(--secondary-color)");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("fill", "var(--primary-color)");
            });
    }

    // --- AI LAB (GEMINI API INTEGRATION) ---
    function initAILab() {
        const lab = document.getElementById('ai-lab');
        if (!lab) return;
        initTabSwitching();
        initGeminiChatbot();
        initGeminiSummarizer();
        initImageGenerator();
    }

    function initTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        if (!tabBtns.length) return;
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.lab-panel').forEach(panel => {
                    panel.classList.toggle('active', panel.id === btn.dataset.tab);
                });
            });
        });
    }

    async function callGeminiAPI(prompt) {
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Gemini API call failed:", error);
            return "Üzgünüm, AI ile iletişim kurarken bir sorun oluştu.";
        }
    }

    function initGeminiChatbot() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message');
        if (!chatInput) return;

        const addMessage = (content, type) => {
            const chatMessages = document.getElementById('chat-messages');
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${type}-message`;
            msgDiv.innerHTML = `<div class="avatar">${type.startsWith('bot') ? '🤖' : '👤'}</div><div class="message-content">${content}</div>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return msgDiv;
        };

        const sendMessage = async () => {
            const message = chatInput.value.trim();
            if (!message) return;
            
            addMessage(message, 'user');
            chatInput.value = '';
            chatInput.disabled = true;
            sendBtn.disabled = true;

            const loadingMsg = addMessage("...", 'bot-loading');
            let loadingDots = setInterval(() => { loadingMsg.querySelector('.message-content').textContent += '.'; }, 500);

            const prompt = `Sen Okan Yaldız'ın kişisel portfolyo sitesindeki bir AI asistanısın. Okan, Manisa Celal Bayar Üniversitesi'nde Endüstri Mühendisliği öğrencisi ve veri bilimi/makine öğrenmesi ile ilgileniyor. Sitede AI deneyleri (sohbet, metin özetleyici, görüntü üretici) ve oyunlar (hafıza, XOX, kod kırıcı) bulunuyor. Kullanıcının sorusuna bu bağlamda, kısa, samimi ve yardımsever bir dille cevap ver. Önceki konuşma: ${JSON.stringify(chatHistory.slice(-4))}. Yeni soru: "${message}"`;
            const response = await callGeminiAPI(prompt);
            
            clearInterval(loadingDots);
            loadingMsg.remove();
            addMessage(response, 'bot');

            chatHistory.push({ user: message, bot: response });
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
    }

    function initGeminiSummarizer() {
        const summarizeBtn = document.getElementById('summarize-text');
        const input = document.getElementById('summarizer-input');
        const resultContainer = document.getElementById('summarizer-result');
        if (!summarizeBtn) return;

        summarizeBtn.addEventListener('click', async () => {
            const text = input.value.trim();
            if (text.length < 50) {
                resultContainer.innerHTML = `<div class="result-placeholder" style="color: var(--accent-color);">Lütfen özetlemek için daha uzun bir metin girin.</div>`;
                return;
            }
            
            summarizeBtn.disabled = true;
            summarizeBtn.textContent = "Özetleniyor...";
            resultContainer.innerHTML = `<div class="result-placeholder">AI metni analiz ediyor ve özetliyor...</div>`;

            const prompt = `Aşağıdaki Türkçe metni, anahtar noktalarını koruyarak madde işaretleri (bullet points) kullanarak özetle. Metin: "${text}"`;
            const response = await callGeminiAPI(prompt);
            
            resultContainer.innerHTML = `<p>${response.replace(/\* /g, '• ')}</p>`;
            summarizeBtn.disabled = false;
            summarizeBtn.textContent = "Özetle";
        });
    }

    async function initImageGenerator() {
        const generateBtn = document.getElementById('generate-image');
        const input = document.getElementById('image-prompt-input');
        const resultContainer = document.getElementById('image-generator-result');
        if (!generateBtn) return;

        generateBtn.addEventListener('click', async () => {
            const prompt = input.value.trim();
            if (!prompt) {
                resultContainer.innerHTML = `<div class="result-placeholder" style="color: var(--accent-color);">Lütfen bir görsel açıklaması girin.</div>`;
                return;
            }

            generateBtn.disabled = true;
            generateBtn.textContent = "Oluşturuluyor...";
            resultContainer.innerHTML = `<div class="result-placeholder">AI hayalinizdeki görseli çiziyor... Bu işlem biraz zaman alabilir.</div>`;

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
            const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
                const result = await response.json();

                if (result.predictions && result.predictions[0].bytesBase64Encoded) {
                    const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                    resultContainer.innerHTML = `<img src="${imageUrl}" alt="${prompt}">`;
                } else {
                    throw new Error("Görsel verisi alınamadı.");
                }
            } catch (error) {
                console.error("Image generation failed:", error);
                resultContainer.innerHTML = `<div class="result-placeholder" style="color: var(--accent-color);">Görsel oluşturulamadı. Lütfen tekrar deneyin.</div>`;
            }

            generateBtn.disabled = false;
            generateBtn.textContent = "Oluştur";
        });
    }


    // --- GAMES MODULE ---
    function initGames() {
        const gamesSection = document.getElementById('games');
        if (!gamesSection) return;
        initMemoryGame();
        initTicTacToeGame();
        initCodeBreakerGame();
    }

    function initMemoryGame() {
        const startBtn = document.getElementById('start-memory');
        const grid = document.getElementById('memory-grid');
        const status = document.getElementById('memory-status');
        const levelDisplay = document.getElementById('memory-level');
        const scoreDisplay = document.getElementById('memory-score');
        if (!startBtn) return;

        let sequence = [], playerSequence = [], level = 1, score = 0, canClick = false;

        const startGame = () => {
            sequence = [], level = 1, score = 0;
            startBtn.style.display = 'none';
            updateDisplay();
            nextLevel();
        };

        const nextLevel = () => {
            canClick = false;
            playerSequence = [];
            status.textContent = "Sırayı izle...";
            sequence.push(Math.floor(Math.random() * 16));
            
            let i = 0;
            const interval = setInterval(() => {
                const cell = grid.children[sequence[i]];
                cell.classList.add('active');
                setTimeout(() => cell.classList.remove('active'), 400);
                i++;
                if (i >= sequence.length) {
                    clearInterval(interval);
                    canClick = true;
                    status.textContent = "Sıra sende!";
                }
            }, 600);
        };

        const handleCellClick = (index) => {
            if (!canClick) return;
            playerSequence.push(index);
            const cell = grid.children[index];
            
            if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
                cell.classList.add('wrong');
                status.textContent = `Oyun bitti! Skor: ${score}. Tekrar başlamak için butona tıkla.`;
                startBtn.style.display = 'inline-block';
                canClick = false;
                setTimeout(() => cell.classList.remove('wrong'), 500);
                return;
            }
            
            cell.classList.add('correct');
            setTimeout(() => cell.classList.remove('correct'), 300);

            if (playerSequence.length === sequence.length) {
                score += level * 10;
                level++;
                updateDisplay();
                setTimeout(nextLevel, 1000);
            }
        };
        
        const updateDisplay = () => {
            levelDisplay.textContent = level;
            scoreDisplay.textContent = score;
        };

        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('memory-cell');
            cell.addEventListener('click', () => handleCellClick(i));
            grid.appendChild(cell);
        }
        startBtn.addEventListener('click', startGame);
    }

    function initTicTacToeGame() {
        const boardElement = document.getElementById('tictactoe-board');
        const statusElement = document.getElementById('tictactoe-status');
        const resetBtn = document.getElementById('reset-tictactoe');
        if (!boardElement) return;

        let board = Array(9).fill(null);
        let currentPlayer = 'X';
        let isGameActive = true;

        const winningConditions = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];

        const checkWinner = (currentBoard) => {
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                    return currentBoard[a];
                }
            }
            return currentBoard.includes(null) ? null : 'Tie';
        };

        const minimax = (newBoard, player) => {
            const availableSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            const winner = checkWinner(newBoard);
            if (winner === 'X') return { score: -10 };
            if (winner === 'O') return { score: 10 };
            if (winner === 'Tie') return { score: 0 };

            let moves = [];
            for (let i = 0; i < availableSpots.length; i++) {
                let move = {};
                move.index = availableSpots[i];
                newBoard[availableSpots[i]] = player;

                if (player === 'O') {
                    let result = minimax(newBoard, 'X');
                    move.score = result.score;
                } else {
                    let result = minimax(newBoard, 'O');
                    move.score = result.score;
                }
                newBoard[availableSpots[i]] = null;
                moves.push(move);
            }

            let bestMove;
            if (player === 'O') {
                let bestScore = -Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        };

        const aiMove = () => {
            if (!isGameActive) return;
            const bestMove = minimax(board, 'O');
            board[bestMove.index] = 'O';
            currentPlayer = 'X';
            renderBoard();
            checkEnd();
        };

        const handleCellClick = (index) => {
            if (board[index] !== null || !isGameActive || currentPlayer !== 'X') return;
            board[index] = 'X';
            renderBoard();
            if (checkEnd()) return;
            currentPlayer = 'O';
            statusElement.textContent = `AI'nin sırası (O)...`;
            setTimeout(aiMove, 500);
        };

        const checkEnd = () => {
            const winner = checkWinner(board);
            if (winner) {
                isGameActive = false;
                statusElement.textContent = winner === 'Tie' ? "Berabere!" : `${winner} kazandı!`;
                return true;
            }
            return false;
        };

        const renderBoard = () => {
            boardElement.innerHTML = '';
            board.forEach((value, index) => {
                const cell = document.createElement('div');
                cell.classList.add('tictactoe-cell');
                if(value) cell.classList.add(value);
                cell.textContent = value;
                cell.addEventListener('click', () => handleCellClick(index));
                boardElement.appendChild(cell);
            });
            if (isGameActive) statusElement.textContent = `${currentPlayer}'nin sırası.`;
        };

        const resetGame = () => {
            board = Array(9).fill(null);
            currentPlayer = 'X';
            isGameActive = true;
            statusElement.textContent = "Senin sıran (X)!";
            renderBoard();
        };

        resetBtn.addEventListener('click', resetGame);
        resetGame();
    }

    function initCodeBreakerGame() {
        const boardElement = document.getElementById('code-breaker-board');
        const paletteElement = document.getElementById('color-palette');
        const checkBtn = document.getElementById('check-guess');
        const resetBtn = document.getElementById('reset-code-breaker');
        const statusElement = document.getElementById('code-breaker-status');
        if (!boardElement) return;

        const colors = ['#ff3366', '#0066ff', '#00ff88', '#ffd700', '#9933ff', '#ff6b35'];
        const codeLength = 4;
        const maxGuesses = 8;
        let secretCode = [];
        let currentGuess = [];
        let currentRow = 0;

        const startGame = () => {
            secretCode = Array.from({ length: codeLength }, () => colors[Math.floor(Math.random() * colors.length)]);
            currentRow = 0;
            currentGuess = Array(codeLength).fill(null);
            statusElement.textContent = "Renkleri seç ve tahminini kontrol et.";
            checkBtn.disabled = false;
            renderBoard();
        };

        const renderBoard = () => {
            boardElement.innerHTML = '';
            for (let i = 0; i < maxGuesses; i++) {
                const row = document.createElement('div');
                row.className = 'guess-row';
                let pegsHTML = '';
                for (let j = 0; j < codeLength; j++) {
                    pegsHTML += `<div class="guess-peg" data-row="${i}" data-col="${j}"></div>`;
                }
                row.innerHTML = `${pegsHTML}<div class="feedback-pegs" id="feedback-${i}"></div>`;
                boardElement.appendChild(row);
            }
        };

        const renderPalette = () => {
            paletteElement.innerHTML = '';
            colors.forEach(color => {
                const peg = document.createElement('div');
                peg.className = 'color-peg';
                peg.style.backgroundColor = color;
                peg.addEventListener('click', () => {
                    const firstEmpty = currentGuess.indexOf(null);
                    if (firstEmpty !== -1) {
                        currentGuess[firstEmpty] = color;
                        updateCurrentGuessRow();
                    }
                });
                paletteElement.appendChild(peg);
            });
        };
        
        const updateCurrentGuessRow = () => {
            const pegs = document.querySelectorAll(`.guess-peg[data-row="${currentRow}"]`);
            pegs.forEach((peg, i) => {
                peg.style.backgroundColor = currentGuess[i] || 'var(--background-dark)';
            });
        };

        checkBtn.addEventListener('click', () => {
            if (currentGuess.includes(null)) {
                statusElement.textContent = "Lütfen 4 renk seçin.";
                return;
            }

            let correctPosition = 0;
            let correctColor = 0;
            let secretCopy = [...secretCode];
            let guessCopy = [...currentGuess];

            for (let i = 0; i < codeLength; i++) {
                if (guessCopy[i] === secretCopy[i]) {
                    correctPosition++;
                    secretCopy[i] = null;
                    guessCopy[i] = null;
                }
            }
            
            for (let i = 0; i < codeLength; i++) {
                if (guessCopy[i] !== null) {
                    const indexInSecret = secretCopy.indexOf(guessCopy[i]);
                    if (indexInSecret !== -1) {
                        correctColor++;
                        secretCopy[indexInSecret] = null;
                    }
                }
            }

            const feedbackContainer = document.getElementById(`feedback-${currentRow}`);
            feedbackContainer.innerHTML = '';
            for(let i=0; i<correctPosition; i++) feedbackContainer.innerHTML += `<div class="feedback-peg correct"></div>`;
            for(let i=0; i<correctColor; i++) feedbackContainer.innerHTML += `<div class="feedback-peg misplaced"></div>`;

            if (correctPosition === codeLength) {
                statusElement.textContent = `Tebrikler! Kodu ${currentRow + 1} denemede çözdün!`;
                checkBtn.disabled = true;
            } else if (currentRow === maxGuesses - 1) {
                statusElement.textContent = `Oyun bitti! Doğru kod buydu.`;
                checkBtn.disabled = true;
                const secretRow = document.createElement('div');
                secretRow.className = 'guess-row';
                secretCode.forEach(color => {
                    secretRow.innerHTML += `<div class="guess-peg" style="background-color: ${color}; border-color: var(--primary-color);"></div>`;
                });
                boardElement.appendChild(secretRow);
            } else {
                currentRow++;
                currentGuess.fill(null);
            }
        });

        resetBtn.addEventListener('click', startGame);
        
        renderPalette();
        startGame();
    }
    
    // --- Blog ---
    function initBlog() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;
        const posts = [
            { date: '10 AĞU 2025', readTime: '7 dk okuma', title: "Endüstri 4.0'da Bir Mühendisin Yol Haritası", summary: "Endüstri 4.0 devrimi, mühendislik disiplinlerini kökten değiştiriyor. Bu yazıda, bir endüstri mühendisi adayı olarak..." },
            { date: '02 AĞU 2025', readTime: '5 dk okuma', title: "Python ile Süreç Simülasyonu: SimPy'a Giriş", summary: "Üretim hatlarındaki verimliliği artırmanın en etkili yollarından biri, gerçek dünyayı dijital ortamda modellemektir..." },
            { date: '25 TEM 2025', readTime: '6 dk okuma', title: "İlk Makine Öğrenmesi Projem: Nereden Başlamalı?", summary: "Makine öğrenmesi dünyasına adım atmak heyecan verici ama bir o kadar da göz korkutucu olabilir. İşte ilk projeniz için..." }
        ];

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <div class="post-content">
                    <div class="post-meta">
                        <span>${post.date}</span>
                        <span class="read-time">${post.readTime}</span>
                    </div>
                    <h4>${post.title}</h4>
                    <p>${post.summary}</p>
                    <a href="#" class="read-more">Devamını Oku →</a>
                </div>
            `;
            blogGrid.appendChild(postElement);
        });
    }

    // --- Utility: Debounce ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // --- Start the App ---
    initializeApp();
});
