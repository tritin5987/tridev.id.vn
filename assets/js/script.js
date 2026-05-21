document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

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

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "bx bx-menu";
            });
        });
    }

    // 2. Sticky Header & Active Link Highlighting on Scroll
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Active link highlighting
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

    // 3. Dynamic Typewriter Effect for Hero
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        const words = ["Nhân viên hỗ trợ CNTT", "Kỹ sư Hỗ trợ Kỹ thuật IT", "Đam mê Lập trình Web"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
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
                // Pause at the end of the word
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing
        setTimeout(type, 1000);
    }

    // 4. Light/Dark Theme Toggle
    const themeBtn = document.getElementById("theme-btn");
    const currentTheme = localStorage.getItem("theme") || "dark";

    // Set initial theme
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            let newTheme = "dark";
            
            if (theme === "dark") {
                newTheme = "light";
            }
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // 5. Skills Tab Switcher
    const tabBtns = document.querySelectorAll(".tab-btn");
    const skillsPanes = document.querySelectorAll(".skills-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove("active"));
            skillsPanes.forEach(pane => pane.classList.remove("active"));

            // Add active to clicked button
            btn.classList.add("active");

            // Add active to target pane
            const targetId = btn.getAttribute("data-target");
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add("active");
            }
        });
    });

    // 6. PDF Rendering via PDF.js with fallback
    const pdfUrl = "assets/docs/Bùi Dương Trí.pdf";
    const canvas = document.getElementById("pdf-preview");
    const loader = document.getElementById("pdf-loader");

    if (canvas && typeof pdfjsLib !== "undefined") {
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const context = canvas.getContext("2d");
                
                // Set scale high enough for sharp rendering, will size down with CSS max-width
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
});

// PDF Open action
function openPDF() {
    const pdfUrl = "assets/docs/Bùi Dương Trí.pdf";
    window.open(pdfUrl, "_blank");
}
