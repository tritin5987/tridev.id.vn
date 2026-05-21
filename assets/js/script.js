// Standalone Fallback Templates in case of CORS or local file:// protocol
const fallbackHeader = `
<header>
    <div class="nav-container">
        <a href="#home" class="logo" id="nav-logo">
            <i class='bx bx-code-alt'></i> TriDev
        </a>
        
        <nav>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="#home" class="nav-link active" id="link-home"><span class="lang-vi">Trang chủ</span><span class="lang-en">Home</span></a></li>
                <li><a href="#about" class="nav-link" id="link-about"><span class="lang-vi">Giới thiệu</span><span class="lang-en">About</span></a></li>
                <li><a href="#skills" class="nav-link" id="link-skills"><span class="lang-vi">Kỹ năng</span><span class="lang-en">Skills</span></a></li>
                <li><a href="#experience" class="nav-link" id="link-experience"><span class="lang-vi">Kinh nghiệm</span><span class="lang-en">Experience</span></a></li>
                <li><a href="#projects" class="nav-link" id="link-projects"><span class="lang-vi">Dự án</span><span class="lang-en">Projects</span></a></li>
                <li><a href="#certs" class="nav-link" id="link-certs"><span class="lang-vi">Chứng chỉ</span><span class="lang-en">Certificates</span></a></li>
                <li><a href="#pdf-cv" class="nav-link" id="link-pdf-cv"><span class="lang-vi">Xem File CV</span><span class="lang-en">View PDF CV</span></a></li>
            </ul>
        </nav>

        <div class="header-actions">
            <button class="lang-btn" id="lang-btn" aria-label="Toggle language">
                <i class='bx bx-globe'></i> EN
            </button>
            <button class="theme-btn" id="theme-btn" aria-label="Toggle dark/light theme">
                <i class='bx bx-moon'></i>
                <i class='bx bx-sun'></i>
            </button>
            <button class="menu-toggle" id="menu-toggle" aria-label="Open navigation menu">
                <i class='bx bx-menu'></i>
            </button>
        </div>
    </div>
</header>
`;

const fallbackFooter = `
<footer>
    <p class="lang-vi">&copy; 2026 Bùi Dương Trí. Mọi quyền được bảo lưu.</p>
    <p class="lang-en">&copy; 2026 Bui Duong Tri. All rights reserved.</p>
</footer>
`;

document.addEventListener("DOMContentLoaded", () => {
    // A. Sync initial language class on body to avoid page jump
    const savedLang = localStorage.getItem("lang") || "vi";
    document.body.classList.remove("vi-mode", "en-mode");
    document.body.classList.add(savedLang + "-mode");

    // 1. Load Header & Footer components dynamically
    loadHeaderAndFooter();

    // 2. Initialize in-page dynamic features
    initTypewriter();
    initSkillsTabs();
    initPDFRenderer();
});

// Dynamic Loader for modular HTML components with fallback handling
function loadHeaderAndFooter() {
    // Header Loader
    fetch("header.html")
        .then(response => {
            if (!response.ok) throw new Error("Could not load header.html");
            return response.text();
        })
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            initHeaderLogic();
        })
        .catch(err => {
            console.warn("Using fallback header due to CORS/local environment limits:", err.message);
            document.getElementById("header-placeholder").innerHTML = fallbackHeader;
            initHeaderLogic();
        });

    // Footer Loader
    fetch("footer.html")
        .then(response => {
            if (!response.ok) throw new Error("Could not load footer.html");
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(err => {
            console.warn("Using fallback footer due to CORS/local environment limits:", err.message);
            document.getElementById("footer-placeholder").innerHTML = fallbackFooter;
        });
}

// Header interactive behaviors (mobile toggle, theme toggle, language toggle, scrolling highlights)
function initHeaderLogic() {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");
    const themeBtn = document.getElementById("theme-btn");
    const langBtn = document.getElementById("lang-btn");

    // A. Sync initial theme attribute from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // B. Language Synchronizer & Button State updates
    const syncLanguage = (lang) => {
        document.body.classList.remove("vi-mode", "en-mode");
        document.body.classList.add(lang + "-mode");
        localStorage.setItem("lang", lang);
        
        if (langBtn) {
            if (lang === "vi") {
                langBtn.innerHTML = "<i class='bx bx-globe'></i> EN";
            } else {
                langBtn.innerHTML = "<i class='bx bx-globe'></i> VI";
            }
        }
    };

    // Initialize Active Language
    const currentLang = localStorage.getItem("lang") || "vi";
    syncLanguage(currentLang);

    // C. Language Button Click Handler
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const currentLang = localStorage.getItem("lang") || "vi";
            const newLang = currentLang === "vi" ? "en" : "vi";
            syncLanguage(newLang);
        });
    }

    // D. Mobile Menu Drawer logic
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.className = "bx bx-x";
            } else {
                icon.className = "bx bx-menu";
            }
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "bx bx-menu";
            });
        });
    }

    // E. Theme Toggle logic
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            let newTheme = theme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // F. Sticky Header and Scrollspy Active Links
    window.addEventListener("scroll", () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
}

// In-page feature: Typewriter typing animation in hero with active language switching
function initTypewriter() {
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        const wordsVi = ["Nhân viên hỗ trợ CNTT", "Kỹ sư Hỗ trợ Kỹ thuật"];
        const wordsEn = ["IT Support Specialist", "IT Technical Support Engineer"];
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let lastLang = "";

        function type() {
            const currentLang = localStorage.getItem("lang") || "vi";
            const words = currentLang === "vi" ? wordsVi : wordsEn;
            
            // Smoothly reset and adapt typing when user switches languages dynamically
            if (lastLang !== currentLang) {
                lastLang = currentLang;
                wordIndex = wordIndex % words.length;
                charIndex = 0;
                isDeleting = false;
            }

            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }
}

// In-page feature: tab navigation filter on skills section
function initSkillsTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const skillsPanes = document.querySelectorAll(".skills-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            skillsPanes.forEach(pane => pane.classList.remove("active"));

            btn.classList.add("active");

            const targetId = btn.getAttribute("data-target");
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add("active");
            }
        });
    });
}

// In-page feature: PDF preview rendering via PDF.js
function initPDFRenderer() {
    const pdfUrl = "assets/docs/Bùi Dương Trí.pdf";
    const canvas = document.getElementById("pdf-preview");
    const loader = document.getElementById("pdf-loader");

    if (canvas && typeof pdfjsLib !== "undefined") {
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const context = canvas.getContext("2d");
                const scale = window.devicePixelRatio > 1.5 ? 2.0 : 1.5;
                const viewport = page.getViewport({ scale: scale });
                
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext).promise.then(() => {
                    if (loader) loader.style.opacity = "0";
                    setTimeout(() => {
                        if (loader) loader.style.display = "none";
                        canvas.style.opacity = "1";
                    }, 300);
                });
            }).catch(err => {
                console.error("Error loading PDF page 1:", err);
                showPDFFallback();
            });
        }).catch(err => {
            console.error("Error loading PDF file:", err);
            showPDFFallback();
        });
    } else {
        showPDFFallback();
    }

    function showPDFFallback() {
        if (loader) {
            loader.innerHTML = `
                <i class='bx bx-file-blank' style='font-size: 54px; color: var(--accent-color); margin-bottom: 12px;'></i>
                <p style='font-size: 14px; font-weight: 500;'>Bản xem trước trực tiếp</p>
                <span style='font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px; line-height: 1.4; padding: 0 10px;'>
                    Sẵn sàng xem và tải xuống.
                </span>
            `;
            loader.style.opacity = "1";
        }
        if (canvas) {
            canvas.style.display = "none";
        }
    }
}

// PDF Open action (global access)
function openPDF() {
    const pdfUrl = "assets/docs/Bùi Dương Trí.pdf";
    window.open(pdfUrl, "_blank");
}
