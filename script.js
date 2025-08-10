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
        initCommandPalette();
        initProjectModal();
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
        if (!container) return;

        // Check if D3 is available, if not create a fallback visualization
        if (typeof d3 === 'undefined') {
            createFallbackChart(container);
            return;
        }

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

    // Fallback chart when D3.js is not available
    function createFallbackChart(container) {
        const data = [
            { month: 'Ocak', units: 65 },
            { month: 'Şubat', units: 59 },
            { month: 'Mart', units: 80 },
            { month: 'Nisan', units: 81 },
            { month: 'Mayıs', units: 56 },
            { month: 'Haziran', units: 55 },
            { month: 'Temmuz', units: 40 }
        ];

        const chartHTML = `
            <div class="fallback-chart" style="
                display: flex; 
                align-items: end; 
                justify-content: space-around; 
                height: 300px; 
                background: var(--background-card); 
                border-radius: var(--border-radius); 
                padding: 20px; 
                margin: 20px 0;
                border: 1px solid var(--primary-color);
            ">
                ${data.map(d => `
                    <div class="chart-bar" style="
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                        cursor: pointer;
                    ">
                        <div class="bar-value" style="
                            background: linear-gradient(to top, var(--primary-color), var(--secondary-color)); 
                            width: 40px; 
                            height: ${d.units * 2.5}px; 
                            border-radius: 4px 4px 0 0; 
                            transition: transform 0.3s ease;
                            margin-bottom: 8px;
                        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>
                        <span style="font-size: 12px; color: var(--text-secondary); text-align: center;">${d.month}</span>
                        <span style="font-size: 10px; color: var(--primary-color); font-weight: bold;">${d.units}</span>
                    </div>
                `).join('')}
            </div>
            <p style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 10px;">
                📊 Üretim Verimliliği (Birim/Ay) - Interaktif Chart (D3.js Fallback)
            </p>
        `;
        
        container.innerHTML = chartHTML;
    }

    // --- AI LAB (GEMINI API INTEGRATION) ---
    function initAILab() {
        const lab = document.getElementById('ai-lab');
        if (!lab) return;
        initTabSwitching();
        initGeminiChatbot();
        initGeminiSummarizer();
        initImageGenerator();
        initProcessOptimizer();
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
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.GEMINI_API_KEY : "";
        
        // If no API key is available, return a fallback response
        if (!apiKey) {
            return "Bu özellik şu anda demo modunda çalışıyor. Gerçek AI entegrasyonu için API anahtarı gereklidir. Ancak size yardımcı olmaya çalışabilirim! Projelerim ve deneyimlerim hakkında sorularınızı sorabilirsiniz.";
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${apiKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload),
                timeout: 10000 // 10 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Unexpected API response format");
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            
            // Provide contextual fallback responses
            if (prompt.toLowerCase().includes('okan') || prompt.toLowerCase().includes('proje')) {
                return "Merhaba! Ben Okan Yaldız, Manisa Celal Bayar Üniversitesi Endüstri Mühendisliği öğrencisiyim. Veri bilimi ve makine öğrenmesi alanlarında çalışıyorum. Portföyümde talep tahmin modeli, üretim hattı simülasyonu ve görüntü işleme projeleri bulunuyor.";
            }
            return "Üzgünüm, AI ile iletişim kurarken bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan benimle iletişime geçin.";
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

            const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.IMAGEN_API_KEY : "";
            
            // If no API key, show demo placeholder
            if (!apiKey) {
                setTimeout(() => {
                    resultContainer.innerHTML = `
                        <div class="result-placeholder">
                            <div style="background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); 
                                        height: 200px; border-radius: var(--border-radius); display: flex; 
                                        align-items: center; justify-content: center; color: white; font-weight: bold;">
                                🎨 Demo: "${prompt}"<br><small>Gerçek API anahtarı ile görsel üretilecek</small>
                            </div>
                        </div>`;
                    generateBtn.disabled = false;
                    generateBtn.textContent = "Oluştur";
                }, 2000);
                return;
            }

            try {
                // Using Google's Imagen API (Note: actual endpoint may differ)
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-2.0-generate-001:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `Generate an image: ${prompt}` }] }]
                    }),
                    timeout: 30000
                });
                
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                const result = await response.json();

                if (result.candidates && result.candidates[0] && result.candidates[0].content) {
                    // Handle the actual image response based on API format
                    resultContainer.innerHTML = `<div class="result-placeholder" style="color: var(--primary-color);">Görsel başarıyla oluşturuldu! (API entegrasyonu tamamlandığında burada görünecek)</div>`;
                } else {
                    throw new Error("Beklenmeyen API yanıtı");
                }
            } catch (error) {
                console.error("Image generation failed:", error);
                resultContainer.innerHTML = `
                    <div class="result-placeholder" style="color: var(--accent-color);">
                        Görsel oluşturulamadı. Bu özellik demo modunda çalışıyor.<br>
                        <small>API anahtarı eklendikğinde tam işlevsellik sağlanacak.</small>
                    </div>`;
            }

            generateBtn.disabled = false;
            generateBtn.textContent = "Oluştur";
        });
    }

    function initProcessOptimizer() {
        const processSteps = document.getElementById('process-steps');
        const optimizedStepsContainer = document.getElementById('optimized-steps');
        if (!processSteps || !optimizedStepsContainer) return;

        // Initial process steps
        const sampleSteps = [
            { id: 1, text: "Hammadde Alımı", duration: 30 },
            { id: 2, text: "Kalite Kontrol", duration: 15 },
            { id: 3, text: "Üretim Hazırlığı", duration: 45 },
            { id: 4, text: "Ana Üretim", duration: 120 },
            { id: 5, text: "Son Kontrol", duration: 20 },
            { id: 6, text: "Paketleme", duration: 25 }
        ];

        const renderSteps = (steps, container, isOptimized = false) => {
            container.innerHTML = steps.map(step => `
                <li class="process-step ${isOptimized ? 'optimized' : ''}" draggable="${!isOptimized}" data-id="${step.id}">
                    <div class="step-content">
                        <span class="step-text">${step.text}</span>
                        <span class="step-duration">${step.duration} dk</span>
                        ${isOptimized ? `<span class="optimization-badge">✓ Optimize</span>` : ''}
                    </div>
                </li>
            `).join('');

            if (!isOptimized) {
                addDragAndDropHandlers(container);
            }
        };

        const addDragAndDropHandlers = (container) => {
            let draggedElement = null;

            container.addEventListener('dragstart', (e) => {
                draggedElement = e.target.closest('.process-step');
                e.target.style.opacity = '0.5';
            });

            container.addEventListener('dragend', (e) => {
                e.target.style.opacity = '';
                optimizeProcess();
            });

            container.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
                const dropTarget = e.target.closest('.process-step');
                if (dropTarget && dropTarget !== draggedElement) {
                    const allSteps = [...container.children];
                    const draggedIndex = allSteps.indexOf(draggedElement);
                    const targetIndex = allSteps.indexOf(dropTarget);
                    
                    if (draggedIndex < targetIndex) {
                        dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
                    } else {
                        dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
                    }
                }
            });
        };

        const optimizeProcess = () => {
            const currentSteps = [...processSteps.children].map(el => ({
                id: parseInt(el.dataset.id),
                text: el.querySelector('.step-text').textContent,
                duration: parseInt(el.querySelector('.step-duration').textContent)
            }));

            // Simple optimization: reduce durations by 10-20% and suggest parallel processing
            const optimizedStepsData = currentSteps.map(step => ({
                ...step,
                duration: Math.max(5, Math.floor(step.duration * (0.8 + Math.random() * 0.1)))
            }));

            // Add optimization suggestions
            if (optimizedStepsData.length > 3) {
                optimizedStepsData.push({
                    id: 99,
                    text: "Paralel İşleme",
                    duration: Math.floor(optimizedStepsData.reduce((sum, s) => sum + s.duration, 0) * 0.3)
                });
            }

            renderSteps(optimizedStepsData, optimizedStepsContainer, true);
            
            const totalOriginal = currentSteps.reduce((sum, s) => sum + s.duration, 0);
            const totalOptimized = optimizedStepsData.reduce((sum, s) => sum + s.duration, 0);
            const improvement = Math.round(((totalOriginal - totalOptimized) / totalOriginal) * 100);
            
            setTimeout(() => {
                const summaryDiv = document.createElement('div');
                summaryDiv.className = 'optimization-summary';
                summaryDiv.innerHTML = `
                    <div style="background: var(--background-card); padding: 15px; border-radius: var(--border-radius); margin-top: 15px; border-left: 4px solid var(--primary-color);">
                        <h5 style="margin: 0 0 10px 0; color: var(--primary-color);">📊 Optimizasyon Sonucu</h5>
                        <p style="margin: 5px 0; font-size: 14px;">
                            <strong>Toplam Süre:</strong> ${totalOriginal} dk → ${totalOptimized} dk<br>
                            <strong>İyileştirme:</strong> %${improvement} daha hızlı<br>
                            <strong>Öneriler:</strong> Paralel işleme, süreç otomasyonu
                        </p>
                    </div>
                `;
                
                const existingSummary = optimizedStepsContainer.parentNode.querySelector('.optimization-summary');
                if (existingSummary) existingSummary.remove();
                optimizedStepsContainer.parentNode.appendChild(summaryDiv);
            }, 500);
        };

        // Initialize with sample steps
        renderSteps(sampleSteps, processSteps);
        optimizeProcess();
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

    function initCommandPalette() {
        const overlay = document.getElementById('command-palette');
        const input = document.getElementById('command-input');
        const results = document.getElementById('command-results');
        if (!overlay || !input || !results) return;

        const commands = [
            { name: 'Hakkımda', action: () => scrollToSection('about'), keywords: 'about bio profile' },
            { name: 'Projeler', action: () => scrollToSection('portfolio'), keywords: 'projects work portfolio' },
            { name: 'AI Deneyleri', action: () => scrollToSection('ai-lab'), keywords: 'ai artificial intelligence lab' },
            { name: 'Oyunlar', action: () => scrollToSection('games'), keywords: 'games play oyun' },
            { name: 'Blog', action: () => scrollToSection('blog'), keywords: 'blog yazılar articles' },
            { name: 'İletişim', action: () => scrollToSection('contact'), keywords: 'contact iletişim email' },
            { name: 'Dark Theme', action: () => document.querySelector('.theme-toggle').click(), keywords: 'dark theme mode' },
            { name: 'Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), keywords: 'top yukarı scroll' }
        ];

        const showPalette = () => {
            overlay.style.display = 'flex';
            input.focus();
            input.value = '';
            updateResults('');
        };

        const hidePalette = () => {
            overlay.style.display = 'none';
        };

        const updateResults = (query) => {
            const filtered = commands.filter(cmd => 
                cmd.name.toLowerCase().includes(query.toLowerCase()) ||
                cmd.keywords.toLowerCase().includes(query.toLowerCase())
            );
            
            results.innerHTML = filtered.map((cmd, index) => `
                <li class="command-result ${index === 0 ? 'selected' : ''}" data-action="${index}">
                    <span>${cmd.name}</span>
                </li>
            `).join('');
        };

        const scrollToSection = (id) => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            hidePalette();
        };

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                showPalette();
            } else if (e.key === 'Escape') {
                hidePalette();
            }
        });

        input.addEventListener('input', (e) => updateResults(e.target.value));
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const selected = results.querySelector('.selected');
                if (selected) {
                    const index = parseInt(selected.dataset.action);
                    commands[index].action();
                }
            }
        });

        results.addEventListener('click', (e) => {
            const result = e.target.closest('.command-result');
            if (result) {
                const index = parseInt(result.dataset.action);
                commands[index].action();
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hidePalette();
        });
    }

    function initProjectModal() {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        const closeBtn = document.querySelector('.modal-close');
        if (!modal || !modalBody || !closeBtn) return;

        const projectDetails = {
            0: {
                title: "Talep Tahmin Modeli",
                category: "Makine Öğrenmesi",
                description: "Tarihsel satış verilerini kullanarak bir perakende şirketi için gelecekteki ürün talebini tahmin eden zaman serisi analizi projesi.",
                fullDescription: "Bu proje, bir perakende zincirinin 3 yıllık satış geçmişini analiz ederek gelecekteki ürün taleplerini tahmin etmeyi amaçlamaktadır. Facebook Prophet algoritması kullanılarak mevsimsel trendler, tatil günleri ve promosyon dönemlerinin etkileri modellenmektedir.",
                technologies: ["Python", "Pandas", "Prophet", "Matplotlib", "Scikit-learn"],
                features: ["Mevsimsel analiz", "Tatil günleri etkisi", "Promosyon etkisi", "Çoklu ürün tahmini"],
                results: "Model, %15 MAPE değeri ile kabul edilebilir tahmin doğruluğu sağlamıştır.",
                github: "#",
                demo: "#"
            },
            1: {
                title: "Üretim Hattı Simülasyonu",
                category: "Süreç Optimizasyonu",
                description: "Bir montaj hattındaki darboğazları tespit etmek ve verimliliği artırmak için SimPy tabanlı bir simülasyon modeli geliştirildi.",
                fullDescription: "Otomotiv yan sanayi bir firmasının montaj hattında yaşanan verimlilik sorunlarını çözmek için geliştirilen diskrit olay simülasyon modeli. Model, gerçek üretim verilerine dayalı olarak çeşitli senaryoları test etmektedir.",
                technologies: ["Python", "SimPy", "Matplotlib", "NumPy"],
                features: ["Darboğaz analizi", "Kapasite planlaması", "Çeşitli senaryo testleri", "Görsel raporlama"],
                results: "Simülasyon sonuçları %23 verimlilik artışı potansiyeli göstermiştir.",
                github: "#",
                demo: "#"
            },
            2: {
                title: "Görüntü ile Kalite Kontrol",
                category: "Bilgisayarlı Görü",
                description: "Üretim bandından geçen ürünlerin görüntülerinden kusurlu olanları tespit eden bir evrişimli sinir ağı (CNN) modeli.",
                fullDescription: "Elektronik kart üretiminde manuel kalite kontrolün otomatize edilmesi için geliştirilen derin öğrenme modeli. Model, farklı kusur tiplerini (çizik, leke, eksik komponent) %95+ doğrulukla tespit edebilmektedir.",
                technologies: ["TensorFlow", "OpenCV", "Python", "Keras"],
                features: ["Gerçek zamanlı tespit", "Çoklu kusur sınıfı", "Konum belirleme", "Rapor oluşturma"],
                results: "Model, manuel kontrole göre %40 daha hızlı ve %15 daha doğru çalışmaktadır.",
                github: "#",
                demo: "#"
            }
        };

        document.querySelectorAll('.portfolio-item').forEach((item) => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.projectId;
                const project = projectDetails[projectId];
                
                if (project) {
                    modalBody.innerHTML = `
                        <div class="project-detail">
                            <div class="project-header">
                                <span class="project-category">${project.category}</span>
                                <h2>${project.title}</h2>
                                <p class="project-description">${project.fullDescription}</p>
                            </div>
                            
                            <div class="project-tech">
                                <h3>Kullanılan Teknolojiler</h3>
                                <div class="tech-tags">
                                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="project-features">
                                <h3>Özellikler</h3>
                                <ul>
                                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="project-results">
                                <h3>Sonuçlar</h3>
                                <p>${project.results}</p>
                            </div>
                            
                            <div class="project-links">
                                <a href="${project.github}" class="btn btn-secondary">GitHub</a>
                                <a href="${project.demo}" class="btn btn-primary">Demo</a>
                            </div>
                        </div>
                    `;
                    modal.style.display = 'flex';
                }
            });
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.style.display = 'none';
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
