// custom-section.js - 完整修正版
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // 確保頁面載入時側邊欄隱藏（手機版）
    initializeSidebar();
    
    // 添加滾動指示器
    addScrollIndicator();
    
    // 為所有導航菜單項添加粒子效果
    document.querySelectorAll('.navmenu a').forEach(link => {
        // 添加 data-text 屬性用於發光效果
        link.setAttribute('data-text', link.textContent);
        
        // 添加鼠標懸停粒子效果
        link.addEventListener('mouseenter', function(e) {
            createParticles(e, this);
        });
    });

    // 創建粒子的函數
    function createParticles(e, element) {
        const x = e.clientX - element.getBoundingClientRect().left;
        const y = e.clientY - element.getBoundingClientRect().top;
        
        // 創建多個粒子
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('span');
            particle.className = 'nav-particle';
            
            // 隨機粒子大小
            const size = Math.random() * 4 + 2;
            
            // 隨機移動方向和距離
            const destinationX = (Math.random() - 0.5) * 50;
            const destinationY = (Math.random() - 0.5) * 50;
            
            // 隨機旋轉
            const rotation = Math.random() * 360;
            
            // 設置粒子初始位置和大小
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // 將粒子添加到元素中
            element.appendChild(particle);
            
            // 設置粒子動畫
            setTimeout(() => {
                particle.style.transform = `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`;
                particle.style.opacity = '0';
                
                // 動畫結束後移除粒子
                setTimeout(() => {
                    particle.remove();
                }, 600);
            }, 10);
        }
    }
    
    // 為側邊欄添加星星背景和光暈效果
    const sidebar = document.querySelector('#header');
    if (sidebar) {
        // 添加光暈元素
        const glow = document.createElement('div');
        glow.className = 'sidebar-glow';
        sidebar.appendChild(glow);
        
        // 創建星星
        for (let i = 0; i < 30; i++) {
            createStar(sidebar);
        }
        
        // 增強側邊欄背景動畫
        enhanceSidebarAnimation(sidebar);
    }
    
    // 增強側邊欄背景動畫
    function enhanceSidebarAnimation(sidebar) {
        // 檢查是否已經有動畫樣式
        const computedStyle = window.getComputedStyle(sidebar);
        const hasAnimation = computedStyle.getPropertyValue('animation') !== 'none';
        
        // 如果沒有動畫，強制添加
        if (!hasAnimation) {
            console.log("Adding forced sidebar animation");
            
            // 創建動畫層
            const animationLayer = document.createElement('div');
            animationLayer.style.position = 'absolute';
            animationLayer.style.top = '0';
            animationLayer.style.left = '0';
            animationLayer.style.width = '100%';
            animationLayer.style.height = '100%';
            animationLayer.style.background = `linear-gradient(to bottom, 
                #5B8FB9 0%,
                #4C3A80 30%,
                #301E67 70%,
                #03001C 100%)`;
            animationLayer.style.backgroundSize = '400% 400%';
            animationLayer.style.zIndex = '0'; // 確保在內容下方但在背景上方
            animationLayer.style.opacity = '1';
            
            // 添加內聯動畫
            animationLayer.style.animation = 'sidebarAnimation 15s ease infinite';
            
            // 添加到側邊欄 - 確保在最底層
            sidebar.insertBefore(animationLayer, sidebar.firstChild);
            
            // 動態添加動畫關鍵幀
            if (!document.getElementById('sidebar-animation-keyframes')) {
                const style = document.createElement('style');
                style.id = 'sidebar-animation-keyframes';
                style.textContent = `
                    @keyframes sidebarAnimation {
                        0% { background-position: 50% 0%; }
                        50% { background-position: 50% 100%; }
                        100% { background-position: 50% 0%; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // 創建星星的函數
    function createStar(container) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 隨機大小
        const size = Math.random() * 3 + 1;
        
        // 隨機位置
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // 隨機動畫持續時間和延遲
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        
        // 隨機不透明度
        const opacity = Math.random() * 0.5 + 0.3;
        
        // 設置星星樣式
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);
        star.style.setProperty('--opacity', opacity);
        
        // 添加到容器
        container.appendChild(star);
    }
    
    /**
     * 創建並添加滾動指示器
     */
    function addScrollIndicator() {
        // 檢查是否已存在
        if (document.querySelector('.scroll-indicator')) return;
        
        // 創建滾動指示器元素
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        
        // 添加到頁面頂部
        document.body.appendChild(scrollIndicator);
        
        // 監聽滾動事件，更新指示器寬度
        window.addEventListener('scroll', updateScrollIndicator);
        
        // 初始更新
        updateScrollIndicator();
    }

    /**
     * 更新滾動指示器的寬度
     */
    function updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;
        
        // 計算滾動百分比
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // 更新指示器寬度
        scrollIndicator.style.width = scrolled + '%';
    }
    
    // 添加側邊欄切換按鈕
    addMobileNavToggle();
    
    // 添加遮罩層
    addMobileNavOverlay();
    
    // 設置移動端導航功能
    setupMobileNav();
    
    // 初始化時檢查並設置側邊欄狀態
    checkMobileNavState();
    
    // 確保側邊欄不可滾動
    const header = document.getElementById('header');
    if (header) {
        header.style.overflowY = 'hidden';
    }
    
    // 處理導航鏈接，防止 URL 中出現 hash
    handleNavLinks();
    
    // 設置滾動監聽 - 新增功能
    setupScrollSpy();
    
    // 監聽窗口大小變化，調整側邊欄位置和狀態
    window.addEventListener('resize', function() {
        checkMobileNavState();
    });
});

/**
 * 初始化側邊欄狀態 - 修正版
 */
function initializeSidebar() {
    console.log("Initializing sidebar");
    
    const isMobile = window.innerWidth <= 1199;
    const header = document.getElementById('header');
    
    if (isMobile && header) {
        // 確保手機版載入時側邊欄隱藏
        header.style.left = '-100%'; // 使用百分比確保完全隱藏
        
        // 設置適當的寬度
        const screenWidth = window.innerWidth;
        const sidebarWidth = Math.min(screenWidth * 0.8, 300); // 80%的螢幕寬度，最大300px
        header.style.width = sidebarWidth + 'px';
        
        document.body.classList.remove('mobile-nav-active');
    } else if (header) {
        // 桌面版顯示側邊欄
        header.style.left = '0';
        header.style.width = '300px';
        
        // 調整主內容區域
        const mainContent = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = '300px';
            mainContent.style.width = 'calc(100% - 300px)';
        }
    }
}

/**
 * 添加移動端導航切換按鈕
 */
function addMobileNavToggle() {
    // 檢查是否已存在切換按鈕
    if (document.querySelector('.mobile-nav-toggle')) return;
    
    console.log("Adding mobile nav toggle button");
    
    // 創建切換按鈕
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-nav-toggle';
    toggleButton.setAttribute('aria-label', '切換側邊欄');
    
    // 添加圖標
    const icon = document.createElement('i');
    icon.className = 'bi bi-list';
    toggleButton.appendChild(icon);
    
    // 添加到頁面
    document.body.appendChild(toggleButton);
    
    // 確保按鈕可點擊
    toggleButton.addEventListener('click', function(e) {
        console.log("Toggle button clicked");
        e.preventDefault();
        toggleMobileNav();
    });
}

/**
 * 添加遮罩層
 */
function addMobileNavOverlay() {
    // 檢查是否已存在遮罩層
    if (document.querySelector('.mobile-nav-overlay')) return;
    
    console.log("Adding mobile nav overlay");
    
    // 創建遮罩層
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    
    // 添加到頁面
    document.body.appendChild(overlay);
    
    // 點擊遮罩層關閉側邊欄
    overlay.addEventListener('click', function() {
        console.log("Overlay clicked");
        toggleMobileNav(false); // 強制關閉側邊欄
    });
}

/**
 * 切換移動端導航 - 修正版
 * @param {boolean|undefined} forceState - 強制設置狀態，true 為打開，false 為關閉，undefined 為切換
 */
function toggleMobileNav(forceState) {
    console.log("Toggling mobile nav, force state:", forceState);
    
    const header = document.getElementById('header');
    if (!header) {
        console.error("Header element not found");
        return;
    }
    
    // 獲取當前狀態
    const isActive = document.body.classList.contains('mobile-nav-active');
    
    // 決定新狀態
    const newState = forceState !== undefined ? forceState : !isActive;
    
    console.log("Current state:", isActive, "New state:", newState);
    
    if (newState) {
        // 打開側邊欄
        document.body.classList.add('mobile-nav-active');
        
        // 確保側邊欄完全顯示在螢幕上
        const screenWidth = window.innerWidth;
        const sidebarWidth = Math.min(screenWidth * 0.8, 300); // 80%的螢幕寬度，最大300px
        
        header.style.left = '0';
        header.style.width = sidebarWidth + 'px';
        
        // 更新按鈕圖標
        const icon = document.querySelector('.mobile-nav-toggle i');
        if (icon) {
            icon.classList.remove('bi-list');
            icon.classList.add('bi-x');
        }
        
        // 顯示遮罩層
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            // 使用 setTimeout 確保過渡效果生效
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
        }
    } else {
        // 關閉側邊欄
        document.body.classList.remove('mobile-nav-active');
        header.style.left = '-100%'; // 使用百分比確保完全隱藏
        
        // 更新按鈕圖標
        const icon = document.querySelector('.mobile-nav-toggle i');
        if (icon) {
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        }
        
        // 隱藏遮罩層
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            // 使用 setTimeout 確保過渡效果完成後再隱藏
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
}

/**
 * 設置移動端導航功能
 */
function setupMobileNav() {
    console.log("Setting up mobile nav");
    
    // 獲取切換按鈕
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    if (!toggleButton) {
        console.warn('側邊欄切換按鈕未找到');
        return;
    }
    
    // 確保按鈕可點擊 - 添加多個事件處理器以確保點擊被捕獲
    toggleButton.onclick = function(e) {
        console.log("Toggle button onclick triggered");
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNav();
    };
    
    // 添加額外的點擊事件處理器
    toggleButton.addEventListener('click', function(e) {
        console.log("Toggle button click event triggered");
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNav();
    }, true); // 使用捕獲階段
    
    // 點擊導航菜單項時自動關閉側邊欄（僅在移動端）
    const navLinks = document.querySelectorAll('#header .navmenu a, #header .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log("Nav link clicked");
            if (window.innerWidth <= 1199) {
                // 允許默認行為發生後再關閉側邊欄
                setTimeout(() => {
                    toggleMobileNav(false);
                }, 100);
            }
        });
    });
    
    // 點擊頁面主內容區域時關閉側邊欄
    const mainContent = document.querySelector('main') || document.querySelector('#main');
    if (mainContent) {
        mainContent.addEventListener('click', function() {
            console.log("Main content clicked");
            if (window.innerWidth <= 1199 && document.body.classList.contains('mobile-nav-active')) {
                toggleMobileNav(false);
            }
        });
    }
}

/**
 * 檢查並設置移動端導航狀態 - 修正版
 */
function checkMobileNavState() {
    console.log("Checking mobile nav state");
    
    const isMobile = window.innerWidth <= 1199;
    const header = document.getElementById('header');
    
    if (!header) {
        console.error("Header element not found");
        return;
    }
    
    if (isMobile) {
        console.log("Mobile view detected");
        
        // 確保切換按鈕可見
        const toggleButton = document.querySelector('.mobile-nav-toggle');
        if (toggleButton) {
            toggleButton.style.display = 'flex';
        }
        
        // 設置適當的寬度
        const screenWidth = window.innerWidth;
        const sidebarWidth = Math.min(screenWidth * 0.8, 300); // 80%的螢幕寬度，最大300px
        header.style.width = sidebarWidth + 'px';
        
        // 如果側邊欄未激活，確保它是隱藏的
        if (!document.body.classList.contains('mobile-nav-active')) {
            header.style.left = '-100%'; // 使用百分比確保完全隱藏
        } else {
            header.style.left = '0';
        }
        
        // 重置主內容區域
        const mainContent = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
        }
    } else {
        console.log("Desktop view detected");
        
        // 桌面版隱藏切換按鈕
        const toggleButton = document.querySelector('.mobile-nav-toggle');
        if (toggleButton) {
            toggleButton.style.display = 'none';
        }
        
        // 桌面版始終顯示側邊欄
        header.style.left = '0';
        header.style.width = '300px';
        document.body.classList.remove('mobile-nav-active');
        
        // 調整主內容區域
        const mainContent = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = '300px';
            mainContent.style.width = 'calc(100% - 300px)';
        }
        
        // 隱藏遮罩層
        const overlay = document.querySelector('.mobile-nav-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.style.opacity = '0';
        }
    }
}

/**
 * 處理導航鏈接，防止在 URL 中顯示 hash 並隱藏狀態欄 URL
 */
function handleNavLinks() {
    // 獲取所有導航鏈接
    const navLinks = document.querySelectorAll('#navmenu a');
    
    navLinks.forEach(link => {
        // 保存原始 href 到自定義屬性
        const originalHref = link.getAttribute('href');
        link.setAttribute('data-target', originalHref);
        
        // 移除 href 屬性，改用 JavaScript 處理點擊
        link.removeAttribute('href');
        
        // 添加適當的樣式，使其看起來仍像鏈接
        link.style.cursor = 'pointer';
        
        // 處理點擊事件
        link.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默認行為
            
            // 獲取目標區域的 ID（從自定義屬性中獲取，去掉 # 符號）
            const targetId = this.getAttribute('data-target').substring(1);
            
            // 獲取目標元素
            const targetElement = document.getElementById(targetId);
            
            // 如果找到目標元素，滾動到該位置
            if (targetElement) {
                // 計算目標元素的位置
                const offsetTop = targetElement.offsetTop;
                
                // 平滑滾動到目標位置
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 更新活動狀態
                updateActiveNavItem(this);
            }
        });
    });
}

/**
 * 更新導航項目的活動狀態
 * @param {HTMLElement} activeLink - 當前活動的導航鏈接
 */
function updateActiveNavItem(activeLink) {
    // 移除所有導航項目的活動狀態
    const navLinks = document.querySelectorAll('#navmenu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 為當前點擊的項目添加活動狀態
    activeLink.classList.add('active');
}

/**
 * 設置滾動監聽（Scroll Spy）功能 - 新增功能
 * 當滾動到對應區塊時，自動更新側邊欄活動狀態
 */
function setupScrollSpy() {
    console.log("Setting up scroll spy");
    
    // 獲取所有導航鏈接
    const navLinks = document.querySelectorAll('.navmenu a');
    
    // 獲取所有區塊（使用ID選擇器）
    const sections = [];
    navLinks.forEach(link => {
        // 獲取目標區塊ID（從data-target屬性）
        const targetId = link.getAttribute('data-target')?.substring(1);
        
        if (targetId) {
            const section = document.getElementById(targetId);
            if (section) {
                sections.push(section);
            }
        }
    });
    
    console.log(`Found ${sections.length} sections for scroll spy`);
    
    // 監聽滾動事件
    window.addEventListener('scroll', function() {
        // 獲取當前滾動位置
        const scrollPosition = window.scrollY + 100; // 添加偏移量以提前激活
        
        // 檢查每個區塊的位置
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // 如果當前滾動位置在該區塊範圍內
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        // 更新側邊欄活動狀態
        if (currentSection) {
            const currentId = currentSection.getAttribute('id');
            
            // 移除所有活動狀態
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // 為當前區塊對應的導航項添加活動狀態
            navLinks.forEach(link => {
                const linkTarget = link.getAttribute('data-target')?.substring(1);
                
                if (linkTarget === currentId) {
                    link.classList.add('active');
                    console.log(`Activated nav item for section: ${currentId}`);
                }
            });
        }
    });
    
    // 初始觸發一次滾動事件，以設置初始狀態
    window.dispatchEvent(new Event('scroll'));
}
