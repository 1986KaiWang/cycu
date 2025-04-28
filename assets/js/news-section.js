/**
 * 現代化3D翻轉卡片新聞系統 - JavaScript
 * 
 * 功能：
 * 1. 卡片3D翻轉效果（添加背面點擊返回功能）
 * 2. 分類過濾功能
 * 3. 卡片動畫效果
 * 4. 加載更多功能
 * 5. 粒子背景效果
 * 6. 響應式設計
 * 7. 可拖拉滑動查看內文
 * 8. 手機版 Chrome 動畫修復
 * 9. 修復手機版 Chrome 放大後卡片背面滾動問題
 */
document.addEventListener('DOMContentLoaded', function() {
  // 獲取主要元素
  const newsCards = document.querySelectorAll('.news-card');
  const filterButtons = document.querySelectorAll('.grid-control');
  const loadMoreBtn = document.querySelector('.load-more-btn');
  const newsGrid = document.querySelector('.news-grid');
  const particlesContainer = document.querySelector('.news-grid-particles');
  
  // 初始可見卡片數量
  let visibleCards = 6;
  let totalCards = newsCards.length;
  
  // 追蹤縮放狀態
  let isZoomed = false;
  let lastZoomCheckTime = 0;
  const zoomCheckInterval = 500; // 檢查縮放的間隔時間（毫秒）
  
  // 初始化
  function init() {
    // 顯示初始卡片
    updateVisibleCards();
    
    // 創建粒子效果
    createParticles();
    
    // 添加卡片進入動畫
    newsCards.forEach((card, index) => {
      if (index < visibleCards) {
        setTimeout(() => {
          card.classList.add('animate-in');
        }, index * 100);
      }
    });
    
    // 為每個卡片添加點擊和懸停事件
    setupCardInteractions();
    
    // 為按鈕添加波紋效果
    setupButtonRippleEffects();
    
    // 為卡片添加鍵盤支持
    setupKeyboardSupport();
    
    // 檢查卡片內容是否需要滾動
    checkScrollableContent();
    
    // 設置滑動觸控事件
    setupTouchEvents();
    
    // 檢測是否為手機版Chrome
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent) || /CriOS/i.test(navigator.userAgent);
    const isMobileChrome = isMobile && isChrome;
    
    if (isMobile) {
      // 為所有移動設備添加移動類
      document.documentElement.classList.add('mobile-device');
      
      // 立即應用修復，不等待其他事件
      document.querySelectorAll('.news-card-front').forEach(front => {
        front.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        front.style.color = '#1E293B';
        front.style.border = '1px solid rgba(106, 17, 203, 0.1)';
      });
      
      document.querySelectorAll('.grid-control').forEach(btn => {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#1E293B';
        
        if (btn.classList.contains('active')) {
          btn.style.color = 'white';
        }
      });
      
      if (isChrome) {
        // 為手機版Chrome添加特殊處理
        document.documentElement.classList.add('mobile-chrome');
        console.log('Mobile Chrome detected - applying fixes');
        
        // 手動強化動畫效果
        enhanceMobileAnimations();
        
        // 修復卡片背面滾動問題
        fixMobileCardScrolling();
        
        // 設置縮放檢測
        setupZoomDetection();
      }
    }
    
    // 添加調試信息
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile Chrome:', isMobileChrome);
    console.log('Mobile Chrome class added:', document.documentElement.classList.contains('mobile-chrome'));
    console.log('Dark mode preference:', window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // 專門修復卡片和按鈕背景
    fixCardAndButtonBackgrounds();
  }
  
  // 設置縮放檢測 - 新增函數
  function setupZoomDetection() {
    console.log('Setting up zoom detection');
    
    // 初始視口寬度
    const initialViewportWidth = window.innerWidth;
    const initialScale = window.visualViewport ? window.visualViewport.scale : 1;
    
    console.log('Initial viewport width:', initialViewportWidth);
    console.log('Initial scale:', initialScale);
    
    // 定期檢查縮放狀態
    function checkZoom() {
      // 限制檢查頻率
      const now = Date.now();
      if (now - lastZoomCheckTime < zoomCheckInterval) return;
      lastZoomCheckTime = now;
      
      // 使用 visualViewport API 檢查縮放
      if (window.visualViewport) {
        const currentScale = window.visualViewport.scale;
        const wasZoomed = isZoomed;
        isZoomed = currentScale > 1.1; // 縮放比例大於 1.1 視為放大
        
        // 如果縮放狀態改變，應用相應的修復
        if (wasZoomed !== isZoomed) {
          console.log('Zoom state changed. Is zoomed:', isZoomed, 'Scale:', currentScale);
          
          if (isZoomed) {
            console.log('Page is zoomed - applying zoom fixes');
            applyZoomFixes();
          } else {
            console.log('Page is not zoomed - removing zoom fixes');
            removeZoomFixes();
          }
        }
      } else {
        // 備用方法：比較當前視口寬度與初始寬度
        const currentWidth = window.innerWidth;
        const wasZoomed = isZoomed;
        isZoomed = currentWidth < initialViewportWidth * 0.9; // 寬度減少 10% 以上視為放大
        
        if (wasZoomed !== isZoomed) {
          console.log('Zoom state changed (fallback). Is zoomed:', isZoomed);
          
          if (isZoomed) {
            console.log('Page is zoomed - applying zoom fixes');
            applyZoomFixes();
          } else {
            console.log('Page is not zoomed - removing zoom fixes');
            removeZoomFixes();
          }
        }
      }
    }
    
    // 監聽視口變化
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', checkZoom);
      window.visualViewport.addEventListener('scroll', checkZoom);
    }
    
    // 監聽窗口大小變化
    window.addEventListener('resize', checkZoom);
    
    // 監聽滾動事件
    window.addEventListener('scroll', checkZoom);
    
    // 監聽觸摸事件，可能表示用戶正在縮放
    document.addEventListener('touchstart', function() {
      setTimeout(checkZoom, 300);
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
      setTimeout(checkZoom, 300);
    }, { passive: true });
    
    // 初始檢查
    checkZoom();
    
    // 定期檢查縮放狀態，以防其他事件未捕獲
    setInterval(checkZoom, 2000);
  }
  
  // 應用縮放修復 - 新增函數
  function applyZoomFixes() {
    console.log('Applying zoom-specific fixes');
    
    // 為 body 添加縮放類
    document.body.classList.add('is-zoomed');
    
    // 修復所有卡片的滾動區域
    newsCards.forEach(card => {
      const cardBack = card.querySelector('.news-card-back');
      const contentScroll = card.querySelector('.news-content-scroll');
      
      if (!contentScroll || !cardBack) return;
      
      // 移除現有的觸控事件
      const newContentScroll = contentScroll.cloneNode(true);
      contentScroll.parentNode.replaceChild(newContentScroll, contentScroll);
      
      // 設置縮放時的樣式
      newContentScroll.style.position = 'absolute';
      newContentScroll.style.top = '0';
      newContentScroll.style.left = '0';
      newContentScroll.style.right = '0';
      newContentScroll.style.bottom = '0';
      newContentScroll.style.overflowY = 'scroll';
      newContentScroll.style.webkitOverflowScrolling = 'touch';
      newContentScroll.style.touchAction = 'pan-y';
      newContentScroll.style.zIndex = '100';
      
      // 使用絕對定位確保滾動區域獨立
      newContentScroll.style.position = 'absolute';
      
      // 為縮放狀態添加特殊類
      newContentScroll.classList.add('zoomed-scroll');
      
      // 特殊處理：使用 position:fixed 和 transform:none 來解決縮放時的滾動問題
      const zoomScrollHandler = function(e) {
        // 阻止事件冒泡，確保不會翻轉卡片
        e.stopPropagation();
      };
      
      // 添加所有觸控事件監聽器
      newContentScroll.addEventListener('touchstart', zoomScrollHandler, { passive: false });
      newContentScroll.addEventListener('touchmove', zoomScrollHandler, { passive: false });
      newContentScroll.addEventListener('touchend', zoomScrollHandler, { passive: false });
      
      // 點擊事件也阻止冒泡
      newContentScroll.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      // 使用 iScroll 或類似庫來處理縮放時的滾動
      if (typeof IScroll !== 'undefined') {
        // 如果頁面已加載 iScroll 庫
        new IScroll(newContentScroll, {
          scrollbars: true,
          mouseWheel: true,
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
          fadeScrollbars: true,
          click: true
        });
      } else {
        // 如果沒有 iScroll，使用原生滾動但添加特殊處理
        newContentScroll.addEventListener('scroll', function(e) {
          // 防止滾動事件冒泡
          e.stopPropagation();
        }, { passive: true });
      }
    });
    
    // 添加縮放特定的 CSS
    const zoomStyle = document.createElement('style');
    zoomStyle.id = 'zoom-fixes-style';
    zoomStyle.textContent = `
      /* 縮放狀態下的修復 */
      body.is-zoomed .news-card-back {
        overflow: hidden !important;
      }
      
      body.is-zoomed .news-content-scroll {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        overflow-y: scroll !important;
        -webkit-overflow-scrolling: touch !important;
        z-index: 100 !important;
        transform: none !important;
        -webkit-transform: none !important;
      }
      
      body.is-zoomed .news-card-inner.flipped .news-content-scroll {
        pointer-events: auto !important;
      }
      
      /* 使用絕對定位來修復縮放時的滾動問題 */
      body.is-zoomed .zoomed-scroll {
        position: absolute !important;
        height: 100% !important;
        width: 100% !important;
        overflow-y: scroll !important;
        -webkit-overflow-scrolling: touch !important;
        touch-action: pan-y !important;
        z-index: 100 !important;
      }
      
      /* 確保卡片背面內容區域可滾動 */
      body.is-zoomed .news-card-back {
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        transform: rotateY(180deg) !important;
        -webkit-transform: rotateY(180deg) !important;
      }
      
      /* 修復卡片頭部樣式 */
      body.is-zoomed .back-header {
        flex-shrink: 0 !important;
        position: relative !important;
        z-index: 101 !important;
      }
    `;
    document.head.appendChild(zoomStyle);
    
    // 重新應用卡片滾動修復
    fixMobileCardScrolling();
  }
  
  // 移除縮放修復 - 新增函數
  function removeZoomFixes() {
    console.log('Removing zoom-specific fixes');
    
    // 移除縮放類
    document.body.classList.remove('is-zoomed');
    
    // 移除縮放特定的 CSS
    const zoomStyle = document.getElementById('zoom-fixes-style');
    if (zoomStyle) {
      zoomStyle.remove();
    }
    
    // 重新應用標準卡片滾動修復
    fixMobileCardScrolling();
  }
  
  // 修復手機版 Chrome 卡片背面滾動問題 - 修改函數
  function fixMobileCardScrolling() {
    console.log('Fixing mobile card scrolling issues');
    
    newsCards.forEach(card => {
      const cardInner = card.querySelector('.news-card-inner');
      const cardBack = card.querySelector('.news-card-back');
      const contentScroll = card.querySelector('.news-content-scroll');
      
      if (!contentScroll || !cardBack || !cardInner) return;
      
      // 修復卡片高度，確保足夠空間顯示內容
      card.style.height = 'auto';
      card.style.minHeight = '280px';
      
      // 確保卡片背面可見
      cardBack.style.height = '100%';
      cardBack.style.display = 'flex';
      cardBack.style.flexDirection = 'column';
      cardBack.style.overflow = 'hidden';
      
      // 確保內容區域可滾動
      contentScroll.style.flex = '1';
      contentScroll.style.overflowY = 'auto';
      contentScroll.style.webkitOverflowScrolling = 'touch';
      contentScroll.style.position = 'relative';
      contentScroll.style.zIndex = '10';
      
      // 使用硬件加速
      contentScroll.style.transform = 'translateZ(0)';
      contentScroll.style.webkitTransform = 'translateZ(0)';
      contentScroll.style.willChange = 'transform';
      
      // 設置觸控行為
      contentScroll.style.touchAction = 'pan-y';
      contentScroll.style.overscrollBehavior = 'contain';
      
      // 確保在縮放狀態下有特殊處理
      if (isZoomed) {
        contentScroll.style.position = 'absolute';
        contentScroll.style.top = '0';
        contentScroll.style.left = '0';
        contentScroll.style.right = '0';
        contentScroll.style.bottom = '0';
        contentScroll.style.transform = 'none';
        contentScroll.style.webkitTransform = 'none';
        contentScroll.classList.add('zoomed-scroll');
      }
      
      // 移除現有的觸控事件監聽器，重新設置
      setupCardScrollingEvents(card);
      
      // 監聽卡片翻轉完成事件
      cardInner.addEventListener('transitionend', function(e) {
        if (e.propertyName === 'transform') {
          if (this.classList.contains('flipped')) {
            // 卡片翻轉到背面
            cardBack.style.zIndex = '2';
            cardBack.style.pointerEvents = 'auto';
            contentScroll.style.pointerEvents = 'auto';
            
            // 延遲一下，確保樣式已應用
            setTimeout(() => {
              // 確保可滾動
              contentScroll.style.overflowY = 'auto';
              contentScroll.style.webkitOverflowScrolling = 'touch';
              
              // 縮放狀態下的特殊處理
              if (isZoomed) {
                contentScroll.style.position = 'absolute';
                contentScroll.style.transform = 'none';
                contentScroll.style.webkitTransform = 'none';
              }
            }, 50);
          } else {
            // 卡片翻轉回正面
            cardBack.style.zIndex = '1';
          }
        }
      });
    });
  }
  
  // 設置卡片滾動事件 - 修改函數
  function setupCardScrollingEvents(card) {
    const cardInner = card.querySelector('.news-card-inner');
    const cardBack = card.querySelector('.news-card-back');
    const contentScroll = card.querySelector('.news-content-scroll');
    
    if (!contentScroll || !cardBack || !cardInner) return;
    
    // 移除現有的觸控事件
    const newContentScroll = contentScroll.cloneNode(true);
    contentScroll.parentNode.replaceChild(newContentScroll, contentScroll);
    
    // 為內容滾動區域添加專門的觸控處理
    let startY, startX;
    let isScrolling = false;
    let lastTouchTime = 0;
    
    // 觸摸開始
    newContentScroll.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isScrolling = true;
      lastTouchTime = Date.now();
      
      // 防止事件冒泡，確保卡片不會翻轉回去
      e.stopPropagation();
      
      // 在縮放狀態下的特殊處理
      if (isZoomed) {
        // 確保滾動區域可以接收觸控事件
        this.style.pointerEvents = 'auto';
        this.style.zIndex = '100';
        
        // 使用絕對定位確保滾動區域獨立
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.right = '0';
        this.style.bottom = '0';
        
        // 移除變換以避免縮放問題
        this.style.transform = 'none';
        this.style.webkitTransform = 'none';
      }
    }, { passive: false });
    
    // 觸摸移動
    newContentScroll.addEventListener('touchmove', function(e) {
      if (!isScrolling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      
      // 在縮放狀態下的特殊處理
      if (isZoomed) {
        // 總是阻止事件冒泡，確保只有內容區域滾動
        e.stopPropagation();
        return;
      }
      
      // 如果內容已經滾動到頂部且繼續下拉，或者滾動到底部且繼續上拉，則允許頁面滾動
      if ((this.scrollTop === 0 && deltaY < 0) || 
          (this.scrollHeight - this.scrollTop <= this.clientHeight && deltaY > 0)) {
        // 允許頁面滾動
      } else {
        // 防止頁面滾動，僅滾動卡片內容
        e.stopPropagation();
      }
    }, { passive: false });
    
    // 觸摸結束
    newContentScroll.addEventListener('touchend', function(e) {
      isScrolling = false;
      
      // 檢查是否為快速點擊（而非滾動）
      const isTap = Date.now() - lastTouchTime < 300;
      
      // 如果是快速點擊，則阻止冒泡以避免卡片翻轉
      if (isTap) {
        e.stopPropagation();
      } else {
        // 如果是滾動結束，也阻止冒泡
        e.stopPropagation();
      }
    }, { passive: false });
    
    // 點擊內容區域時阻止冒泡
    newContentScroll.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // 滾動事件
    newContentScroll.addEventListener('scroll', function() {
      // 隱藏滑動提示
      const swipeHint = card.querySelector('.swipe-hint');
      if (swipeHint) swipeHint.style.opacity = '0';
      
      // 更新滾動指示器
      const scrollIndicator = card.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        const scrollPercentage = (this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100;
        scrollIndicator.style.width = `${scrollPercentage}%`;
      }
    }, { passive: true });
    
    // 為背面添加點擊事件，但排除滾動區域
    cardBack.addEventListener('click', function(e) {
      // 檢查點擊是否在內容滾動區域內
      const isInContentScroll = e.target.closest('.news-content-scroll');
      
      // 如果不是在內容滾動區域內點擊，則翻轉卡片
      if (!isInContentScroll) {
        cardInner.classList.remove('flipped');
        cardInner.style.transform = '';
      }
    });
    
    // 縮放狀態下的特殊處理
    if (isZoomed) {
      newContentScroll.classList.add('zoomed-scroll');
      newContentScroll.style.position = 'absolute';
      newContentScroll.style.top = '0';
      newContentScroll.style.left = '0';
      newContentScroll.style.right = '0';
      newContentScroll.style.bottom = '0';
      newContentScroll.style.transform = 'none';
      newContentScroll.style.webkitTransform = 'none';
      newContentScroll.style.zIndex = '100';
    }
  }
  
  // 添加專門針對滾動問題的 CSS 修復 - 修改函數
  function addScrollingCSSFixes() {
    const style = document.createElement('style');
    style.id = 'scrolling-fixes-style';
    style.textContent = `
      /* 手機版 Chrome 卡片背面滾動修復 */
      @media screen and (max-width: 1000px) {
        /* 確保卡片在翻轉時保持 3D 空間 */
        .news-card {
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
          perspective: 1000px !important;
          -webkit-perspective: 1000px !important;
          height: auto !important;
          min-height: 280px !important;
        }
        
        /* 確保卡片內部元素保持 3D 空間 */
        .news-card-inner {
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
          position: relative !important;
        }
        
        /* 修復卡片背面樣式 */
        .news-card-back {
          transform: rotateY(180deg) !important;
          -webkit-transform: rotateY(180deg) !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          z-index: 1 !important;
        }
        
        /* 修復內容滾動區域 */
        .news-content-scroll {
          flex: 1 !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain !important;
          touch-action: pan-y !important;
          position: relative !important;
          z-index: 10 !important;
          transform: translateZ(0) !important;
          -webkit-transform: translateZ(0) !important;
          will-change: transform !important;
        }
        
        /* 確保翻轉後卡片背面可見且可交互 */
        .news-card-inner.flipped .news-card-back {
          z-index: 2 !important;
          pointer-events: auto !important;
        }
        
        /* 確保翻轉後內容區域可滾動 */
        .news-card-inner.flipped .news-content-scroll {
          pointer-events: auto !important;
        }
        
        /* 修復卡片頭部樣式 */
        .back-header {
          flex-shrink: 0 !important;
          z-index: 11 !important;
        }
        
        /* 使用硬件加速 */
        .news-card, 
        .news-card-inner, 
        .news-card-front, 
        .news-card-back,
        .news-content-scroll {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* 縮放狀態下的特殊處理 */
        body.is-zoomed .news-content-scroll {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch !important;
          z-index: 100 !important;
          transform: none !important;
          -webkit-transform: none !important;
        }
        
        body.is-zoomed .zoomed-scroll {
          position: absolute !important;
          height: 100% !important;
          width: 100% !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-y !important;
          z-index: 100 !important;
        }
        
        /* 禁用縮放狀態下的 3D 變換 */
        body.is-zoomed .news-card-inner.flipped .news-content-scroll {
          transform: none !important;
          -webkit-transform: none !important;
        }
      }
      
      /* 專門針對 Chrome 的修復 */
      .mobile-chrome .news-content-scroll {
        transform: translateZ(0) !important;
        -webkit-transform: translateZ(0) !important;
        will-change: transform !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
        overflow-y: auto !important;
      }
      
      .mobile-chrome .news-card-inner.flipped .news-content-scroll {
        pointer-events: auto !important;
        z-index: 10 !important;
      }
      
      .mobile-chrome .news-card-inner.flipped .news-card-back {
        z-index: 2 !important;
        pointer-events: auto !important;
      }
      
           /* 縮放狀態下的 Chrome 特殊修復 */
      .mobile-chrome.is-zoomed .news-content-scroll {
        transform: none !important;
        -webkit-transform: none !important;
        position: absolute !important;
      }
    `;
    document.head.appendChild(style);
    console.log('Added scrolling CSS fixes with zoom support');
  }
  
  // 專門修復卡片和按鈕背景
  function fixCardAndButtonBackgrounds() {
    console.log('Fixing card and button backgrounds');
    
    // 修復卡片正面背景
    document.querySelectorAll('.news-card-front').forEach(front => {
      front.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      front.style.color = '#1E293B';
      front.style.border = '1px solid rgba(106, 17, 203, 0.1)';
    });
    
    // 修復動畫按鈕背景
    document.querySelectorAll('.grid-control').forEach(btn => {
      // 設置按鈕背景為透明
      btn.style.backgroundColor = 'transparent';
      btn.style.color = '#1E293B';
      
      // 如果是活動按鈕，設置文字顏色為白色
      if (btn.classList.contains('active')) {
        btn.style.color = 'white';
      }
    });
    
    // 監聽按鈕點擊事件，確保樣式保持一致
    document.querySelectorAll('.grid-control').forEach(btn => {
      btn.addEventListener('click', function() {
        // 重置所有按鈕樣式
        document.querySelectorAll('.grid-control').forEach(b => {
          b.style.backgroundColor = 'transparent';
          b.style.color = '#1E293B';
        });
        
        // 設置當前按鈕為活動狀態
        setTimeout(() => {
          if (this.classList.contains('active')) {
            this.style.color = 'white';
          }
        }, 50);
      });
    });
  }
  
  // 檢查卡片內容是否需要滾動
  function checkScrollableContent() {
    newsCards.forEach(card => {
      const cardBack = card.querySelector('.news-card-back');
      const contentScroll = card.querySelector('.news-content-scroll');
      const cardInner = card.querySelector('.news-card-inner');
      
      if (contentScroll && cardBack) {
        // 檢查內容高度是否超過容器
        if (contentScroll.scrollHeight > contentScroll.clientHeight) {
          cardInner.setAttribute('data-scrollable', 'true');
          
          // 添加滑動提示元素
          if (!card.querySelector('.swipe-hint')) {
            const swipeHint = document.createElement('div');
            swipeHint.className = 'swipe-hint';
            cardBack.appendChild(swipeHint);
          }
          
          // 添加拖拉指示器
          if (!card.querySelector('.drag-indicator')) {
            const dragIndicator = document.createElement('div');
            dragIndicator.className = 'drag-indicator';
            
            for (let i = 0; i < 3; i++) {
              const dot = document.createElement('span');
              dragIndicator.appendChild(dot);
            }
            
            cardBack.appendChild(dragIndicator);
          }
        } else {
          cardInner.setAttribute('data-scrollable', 'false');
        }
      }
    });
  }
  
  // 創建粒子背景
  function createParticles() {
    if (!particlesContainer) return;
    
    // 清除現有粒子
    particlesContainer.innerHTML = '';
    
    // 創建新粒子
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'news-particle';
      
      // 隨機位置
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // 設置樣式
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      
      // 隨機大小
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // 隨機透明度
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      
      // 添加動畫
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;
      
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      
      // 添加到容器
      particlesContainer.appendChild(particle);
    }
  }
  
  // 更新可見卡片
  function updateVisibleCards() {
    newsCards.forEach((card, index) => {
      if (index < visibleCards) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
    
    // 如果所有卡片都已顯示，隱藏加載更多按鈕
    if (visibleCards >= totalCards) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = '';
    }
  }
  
  // 過濾卡片
  function filterCards(category) {
    // 重置可見卡片數量
    visibleCards = 6;
    
    // 添加/移除活動類
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // 過濾卡片
    newsCards.forEach((card, index) => {
      const cardCategory = card.dataset.category;
      const cardInner = card.querySelector('.news-card-inner');
      
      // 重置卡片翻轉狀態
      if (cardInner) {
        cardInner.style.transform = '';
        cardInner.classList.remove('flipped'); // 移除翻轉類
      }
      
      // 先移除所有動畫類
      card.classList.remove('animate-in', 'filtered-out');
      
      if (category === 'all' || cardCategory === category) {
        // 符合過濾條件
        if (index < visibleCards) {
          card.style.display = '';
          setTimeout(() => {
            card.classList.add('animate-in');
          }, index * 100);
        } else {
          card.style.display = 'none';
        }
      } else {
        // 不符合過濾條件
        card.classList.add('filtered-out');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // 更新加載更多按鈕顯示
    const filteredCards = [...newsCards].filter(card => {
      return category === 'all' || card.dataset.category === category;
    });
    
    totalCards = filteredCards.length;
    
    if (visibleCards >= totalCards) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = '';
    }
    
    // 重新檢查可滾動內容
    setTimeout(checkScrollableContent, 500);
    
    // 重新應用背景修復
    setTimeout(fixCardAndButtonBackgrounds, 100);
    
    // 重新修復卡片背面滾動問題
    setTimeout(fixMobileCardScrolling, 500);
    
    // 如果處於縮放狀態，應用縮放修復
    if (isZoomed) {
      setTimeout(applyZoomFixes, 600);
    }
  }
  
  // 設置卡片交互 - 修改翻轉邏輯，添加背面點擊返回功能
  function setupCardInteractions() {
    // 卡片點擊效果
    newsCards.forEach(card => {
      const cardInner = card.querySelector('.news-card-inner');
      const cardFront = card.querySelector('.news-card-front');
      const cardBack = card.querySelector('.news-card-back');
      const contentScroll = card.querySelector('.news-content-scroll');
      
      // 點擊卡片正面翻轉到背面
      if (cardFront) {
        cardFront.addEventListener('click', function(e) {
          // 添加翻轉類，而不是直接修改樣式
          cardInner.classList.add('flipped');
          cardInner.style.transform = 'rotateY(180deg)';
          createRippleEffect(e, card);
          
          // 如果處於縮放狀態，應用縮放修復
          if (isZoomed) {
            setTimeout(() => {
              const contentScroll = card.querySelector('.news-content-scroll');
              if (contentScroll) {
                contentScroll.style.position = 'absolute';
                contentScroll.style.top = '0';
                contentScroll.style.left = '0';
                contentScroll.style.right = '0';
                contentScroll.style.bottom = '0';
                contentScroll.style.transform = 'none';
                contentScroll.style.webkitTransform = 'none';
                contentScroll.style.zIndex = '100';
                contentScroll.classList.add('zoomed-scroll');
              }
            }, 300);
          }
        });
      }
      
      // 點擊卡片背面翻轉回正面 - 新增功能
      if (cardBack) {
        // 為整個背面添加點擊事件，點擊時翻轉回正面
        cardBack.addEventListener('click', function(e) {
          // 檢查點擊是否在內容滾動區域內
          const isInContentScroll = e.target.closest('.news-content-scroll');
          
          // 如果不是在內容滾動區域內點擊，則翻轉卡片
          if (!isInContentScroll) {
            cardInner.classList.remove('flipped');
            cardInner.style.transform = '';
            createRippleEffect(e, card);
          }
        });
      }
      
      // 為內容滾動區域添加點擊事件，防止翻轉
      if (contentScroll) {
        contentScroll.addEventListener('click', function(e) {
          e.stopPropagation(); // 防止事件冒泡
        });
      }
    });
  }
  
  // 設置觸控滑動事件
  function setupTouchEvents() {
    newsCards.forEach(card => {
      const contentScroll = card.querySelector('.news-content-scroll');
      const cardInner = card.querySelector('.news-card-inner');
      const cardBack = card.querySelector('.news-card-back');
      
      if (!contentScroll) return;
      
      let startY, startX;
      let isScrolling = false;
      let isTouchMove = false; // 新增變數追蹤是否有滑動
      
      // 觸摸開始
      contentScroll.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isScrolling = true;
        isTouchMove = false; // 重置滑動狀態
        
        // 添加活動類
        this.classList.add('active-scroll');
        
        // 防止事件冒泡，確保卡片不會翻轉回去
        e.stopPropagation();
        
        // 縮放狀態下的特殊處理
        if (isZoomed) {
          this.style.position = 'absolute';
          this.style.top = '0';
          this.style.left = '0';
          this.style.right = '0';
          this.style.bottom = '0';
          this.style.transform = 'none';
          this.style.webkitTransform = 'none';
          this.style.zIndex = '100';
        }
      }, { passive: false }); // 修改為非被動模式
      
      // 觸摸移動
      contentScroll.addEventListener('touchmove', function(e) {
        if (!isScrolling) return;
        
        isTouchMove = true; // 設置為有滑動
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        
        // 縮放狀態下的特殊處理
        if (isZoomed) {
          // 總是阻止事件冒泡，確保只有內容區域滾動
          e.stopPropagation();
          return;
        }
        
        // 計算水平和垂直移動距離
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        // 如果水平移動大於垂直移動，則阻止卡片翻轉
        if (deltaX > deltaY && deltaX > 10) {
          e.stopPropagation();
        }
        
        // 如果內容已經滾動到頂部且繼續下拉，或者滾動到底部且繼續上拉，則允許頁面滾動
        if ((this.scrollTop === 0 && currentY > startY) || 
            (this.scrollHeight - this.scrollTop <= this.clientHeight && currentY < startY)) {
          // 允許頁面滾動
        } else {
          // 防止頁面滾動，僅滾動卡片內容
          e.stopPropagation();
          e.preventDefault();
        }
      }, { passive: false }); // 修改為非被動模式
      
      // 觸摸結束
      contentScroll.addEventListener('touchend', function(e) {
        isScrolling = false;
        this.classList.remove('active-scroll');
        
        // 防止事件冒泡，確保卡片不會翻轉回去
        e.stopPropagation();
      }, { passive: false }); // 修改為非被動模式
      
      // 滾動時隱藏滑動提示
      contentScroll.addEventListener('scroll', function() {
        const swipeHint = card.querySelector('.swipe-hint');
        if (swipeHint) swipeHint.style.opacity = '0';
        
        // 檢查是否需要更新縮放狀態
        if (Date.now() - lastZoomCheckTime > zoomCheckInterval) {
          if (window.visualViewport) {
            const currentScale = window.visualViewport.scale;
            const wasZoomed = isZoomed;
            isZoomed = currentScale > 1.1;
            
            if (wasZoomed !== isZoomed) {
              console.log('Zoom state changed during scroll. Is zoomed:', isZoomed);
              
              if (isZoomed) {
                applyZoomFixes();
              } else {
                removeZoomFixes();
              }
            }
            
            lastZoomCheckTime = Date.now();
          }
        }
      }, { passive: true });
      
      // 為卡片背面添加觸控事件
      if (cardBack) {
        cardBack.addEventListener('touchstart', function(e) {
          // 檢查點擊是否在內容滾動區域內
          const isInContentScroll = e.target.closest('.news-content-scroll');
          if (isInContentScroll) {
            // 如果在滾動區域內，阻止事件冒泡
            e.stopPropagation();
            return;
          }
          
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isTouchMove = false; // 重置滑動狀態
        }, { passive: false }); // 修改為非被動模式
        
        cardBack.addEventListener('touchmove', function(e) {
          // 檢查點擊是否在內容滾動區域內
          const isInContentScroll = e.target.closest('.news-content-scroll');
          if (isInContentScroll) {
            // 如果在滾動區域內，阻止事件冒泡
            e.stopPropagation();
            return;
          }
          
          isTouchMove = true; // 設置為有滑動
        }, { passive: false }); // 修改為非被動模式
        
        cardBack.addEventListener('touchend', function(e) {
          // 檢查點擊是否在內容滾動區域內
          const isInContentScroll = e.target.closest('.news-content-scroll');
          if (isInContentScroll) {
            // 如果在滾動區域內，阻止事件冒泡
            e.stopPropagation();
            return;
          }
          
          // 如果沒有明顯滑動，則視為點擊
          if (!isTouchMove) {
            // 翻轉回正面
            cardInner.classList.remove('flipped');
            cardInner.style.transform = '';
          }
        }, { passive: false }); // 修改為非被動模式
      }
    });
  }
  
  // 設置按鈕波紋效果
  function setupButtonRippleEffects() {
    // 為所有按鈕添加波紋效果
    document.querySelectorAll('.grid-control, .load-more-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        createRippleEffect(e, this);
        
        // 為過濾按鈕添加額外效果
        if (this.classList.contains('grid-control')) {
          // 創建粒子效果
          createButtonParticleEffect(this);
          
          // 獲取過濾類別
          const category = this.dataset.filter;
          
          // 過濾卡片
          filterCards(category);
          
          // 確保按鈕樣式正確
          setTimeout(() => {
            document.querySelectorAll('.grid-control').forEach(btn => {
              btn.style.backgroundColor = 'transparent';
              btn.style.color = '#1E293B';
              
              if (btn.classList.contains('active')) {
                btn.style.color = 'white';
              }
            });
          }, 100);
        }
      });
    });
  }
  
  // 設置鍵盤支持
  function setupKeyboardSupport() {
    // 為卡片添加鍵盤支持
    newsCards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          const cardInner = this.querySelector('.news-card-inner');
          if (cardInner.classList.contains('flipped')) {
            cardInner.classList.remove('flipped');
            cardInner.style.transform = '';
          } else {
            cardInner.classList.add('flipped');
            cardInner.style.transform = 'rotateY(180deg)';
          }
        }
      });
    });
    
    // 為按鈕添加鍵盤支持
    document.querySelectorAll('.grid-control, .load-more-btn').forEach(button => {
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }
  
  // 創建波紋效果
  function createRippleEffect(event, element) {
    // 移除現有波紋
    const existingRipples = element.querySelectorAll('.ripple-effect');
    existingRipples.forEach(ripple => ripple.remove());
    
    // 創建新波紋
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    
    element.appendChild(ripple);
    
    // 移除波紋
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  // 創建按鈕粒子效果
  function createButtonParticleEffect(button) {
    const iconContainer = button.querySelector('.tab-icon');
    const particlesContainer = button.querySelector('.icon-particles-container');
    
    if (!particlesContainer || !iconContainer) return;
    
    // 清除現有粒子
    particlesContainer.innerHTML = '';
    
    // 創建新粒子
    const particleCount = 10;
    const rect = iconContainer.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'icon-particle';
      
      // 隨機位置
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 15 + 5;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // 設置樣式
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${Math.random() * 3 + 2}px`;
      particle.style.height = particle.style.width;
      
      // 設置動畫
      const duration = Math.random() * 0.5 + 0.5;
      const delay = Math.random() * 0.2;
      
      particle.style.animation = `particleFloat ${duration}s ease-out ${delay}s forwards`;
      
      // 添加到容器
      particlesContainer.appendChild(particle);
    }
  }
  
  // 加載更多按鈕點擊事件
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // 增加可見卡片數量
      visibleCards += 3;
      
      // 獲取當前活動的過濾器
      const activeFilter = document.querySelector('.grid-control.active');
      const category = activeFilter ? activeFilter.dataset.filter : 'all';
      
      // 更新可見卡片
      const filteredCards = [...newsCards].filter(card => {
        return category === 'all' || card.dataset.category === category;
      });
      
      filteredCards.forEach((card, index) => {
        if (index < visibleCards && index >= visibleCards - 3) {
          card.style.display = '';
          setTimeout(() => {
            card.classList.add('animate-in');
          }, (index - (visibleCards - 3)) * 100);
        }
      });
      
      // 更新加載更多按鈕顯示
      if (visibleCards >= filteredCards.length) {
        loadMoreBtn.style.display = 'none';
      }
      
      // 檢查新顯示卡片的可滾動內容
      setTimeout(checkScrollableContent, 300);
      
      // 確保新加載卡片的背景顏色正確
      setTimeout(fixCardAndButtonBackgrounds, 300);
      
      // 修復新加載卡片的背面滾動問題
      setTimeout(fixMobileCardScrolling, 500);
      
      // 如果處於縮放狀態，應用縮放修復
      if (isZoomed) {
        setTimeout(applyZoomFixes, 600);
      }
    });
  }
  
  // 添加滾動指示器
  function addScrollIndicators() {
    newsCards.forEach(card => {
      const contentScroll = card.querySelector('.news-content-scroll');
      if (!contentScroll) return;
      
      // 創建滾動指示器
      const scrollIndicator = document.createElement('div');
      scrollIndicator.className = 'scroll-indicator';
      
      card.querySelector('.news-card-back').appendChild(scrollIndicator);
      
      // 更新滾動指示器
      contentScroll.addEventListener('scroll', function() {
        const scrollPercentage = (this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100;
        scrollIndicator.style.width = `${scrollPercentage}%`;
      }, { passive: true });
    });
  }
  
  // 增強拖拉滑動效果
  function enhanceDragScrolling() {
    newsCards.forEach(card => {
      const contentScroll = card.querySelector('.news-content-scroll');
      if (!contentScroll) return;
      
      let isDown = false;
      let startY;
      let scrollTop;
      
      // 鼠標按下
      contentScroll.addEventListener('mousedown', function(e) {
        isDown = true;
        this.style.cursor = 'grabbing';
        startY = e.pageY - this.offsetTop;
        scrollTop = this.scrollTop;
        e.preventDefault();
      });
      
      // 鼠標離開
      contentScroll.addEventListener('mouseleave', function() {
        isDown = false;
        this.style.cursor = 'default';
      });
      
      // 鼠標鬆開
      contentScroll.addEventListener('mouseup', function() {
        isDown = false;
        this.style.cursor = 'default';
      });
      
      // 鼠標移動
      contentScroll.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - this.offsetTop;
        const walk = (y - startY) * 2; // 滾動速度
        this.scrollTop = scrollTop - walk;
      });
    });
  }
  
  // 強化手機版動畫效果
  function enhanceMobileAnimations() {
    console.log('Applying focused mobile animation fixes');
    
    // 強制修改所有卡片正面背景
    document.querySelectorAll('.news-card-front').forEach(front => {
      front.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      front.style.color = '#1E293B';
      front.style.border = '1px solid rgba(106, 17, 203, 0.1)';
    });
    
    // 強制修改所有動畫按鈕
    document.querySelectorAll('.grid-control').forEach(btn => {
      // 設置按鈕背景為透明
      btn.style.backgroundColor = 'transparent';
      btn.style.color = '#1E293B';
      
      // 如果是活動按鈕，設置文字顏色為白色
      if (btn.classList.contains('active')) {
        btn.style.color = 'white';
      }
    });
    
    // 強化卡片翻轉動畫
    newsCards.forEach(card => {
      const cardInner = card.querySelector('.news-card-inner');
      const cardFront = card.querySelector('.news-card-front');
      const cardBack = card.querySelector('.news-card-back');
      
      // 確保點擊事件在手機Chrome上正常工作
      if (cardFront) {
        cardFront.addEventListener('touchstart', function() {
          // 只記錄觸摸開始，不執行任何操作
        }, { passive: true });
        
        cardFront.addEventListener('touchend', function(e) {
          // 防止默認行為
          e.preventDefault();
          // 執行翻轉
          cardInner.classList.add('flipped');
          cardInner.style.transform = 'rotateY(180deg)';
          
          // 如果處於縮放狀態，應用縮放修復
          if (isZoomed) {
            setTimeout(() => {
              const contentScroll = card.querySelector('.news-content-scroll');
              if (contentScroll) {
                contentScroll.style.position = 'absolute';
                contentScroll.style.top = '0';
                contentScroll.style.left = '0';
                contentScroll.style.right = '0';
                contentScroll.style.bottom = '0';
                contentScroll.style.transform = 'none';
                contentScroll.style.webkitTransform = 'none';
                contentScroll.style.zIndex = '100';
                contentScroll.classList.add('zoomed-scroll');
              }
            }, 300);
          }
        }, { passive: false }); // 設置為非被動模式
      }
    });
  }
  
    // 添加 CSS 修復
    function addCSSFixes() {
      // 創建樣式元素
      const style = document.createElement('style');
      style.textContent = `
        /* 手機版動畫按鈕和卡片背景修復 */
        @media screen and (max-width: 1000px) {
          /* 卡片正面背景強制為白色 */
          .news-card-front {
            background-color: rgba(255, 255, 255, 0.9) !important;
            color: var(--news-dark) !important;
            border: 1px solid rgba(106, 17, 203, 0.1) !important;
          }
          
          /* 動畫按鈕背景強制為透明 */
          .grid-control {
            background-color: transparent !important;
            color: var(--news-dark) !important;
          }
          
          /* 活動按鈕文字顏色強制為白色 */
          .grid-control.active {
            color: white !important;
          }
          
          /* 活動按鈕背景強制顯示 */
          .grid-control.active::before {
            opacity: 1 !important;
            background: var(--news-gradient-primary) !important;
          }
          
          /* 禁用所有暗模式設置 */
          @media (prefers-color-scheme: dark) {
            .news-card-front {
              background-color: rgba(255, 255, 255, 0.9) !important;
              color: var(--news-dark) !important;
            }
            
            .grid-control {
              background-color: transparent !important;
              color: var(--news-dark) !important;
            }
          }
        }
        
        /* 縮放狀態下的特殊修復 */
        body.is-zoomed .news-card-back {
          overflow: hidden !important;
        }
        
        body.is-zoomed .news-content-scroll {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch !important;
          z-index: 100 !important;
          transform: none !important;
          -webkit-transform: none !important;
        }
        
        body.is-zoomed .news-card-inner.flipped .news-content-scroll {
          pointer-events: auto !important;
        }
        
        /* 使用絕對定位來修復縮放時的滾動問題 */
        body.is-zoomed .zoomed-scroll {
          position: absolute !important;
          height: 100% !important;
          width: 100% !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-y !important;
          z-index: 100 !important;
        }
        
        /* 確保卡片背面內容區域可滾動 */
        body.is-zoomed .news-card-back {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          transform: rotateY(180deg) !important;
          -webkit-transform: rotateY(180deg) !important;
        }
        
        /* 修復卡片頭部樣式 */
        body.is-zoomed .back-header {
          flex-shrink: 0 !important;
          position: relative !important;
          z-index: 101 !important;
        }
        
        /* 添加滾動指示器樣式 */
        .scroll-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 0%;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          transition: width 0.2s ease;
          z-index: 100;
        }
        
        /* 添加滑動提示樣式 */
        .swipe-hint {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(106, 17, 203, 0.7)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 13l5 5 5-5'/%3E%3Cpath d='M7 6l5 5 5-5'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.7;
          animation: swipeHint 1.5s infinite;
          pointer-events: none;
          z-index: 99;
          transition: opacity 0.3s ease;
        }
        
        /* 添加拖拉指示器樣式 */
        .drag-indicator {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 99;
        }
        
        .drag-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(106, 17, 203, 0.5);
        }
        
        /* 添加滑動提示動畫 */
        @keyframes swipeHint {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateX(-50%) translateY(10px);
            opacity: 0.3;
          }
        }
        
        /* 添加活動滾動樣式 */
        .active-scroll {
          cursor: grabbing !important;
        }
        
        /* 修復縮放後的滾動問題 */
        .zoomed-scroll {
          -webkit-overflow-scrolling: touch !important;
          overflow-y: scroll !important;
          touch-action: pan-y !important;
        }
        
        /* 確保卡片在翻轉時保持 3D 空間 */
        .news-card {
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
          perspective: 1000px !important;
          -webkit-perspective: 1000px !important;
        }
        
        .news-card-inner {
          transform-style: preserve-3d !important;
          -webkit-transform-style: preserve-3d !important;
        }
        
        /* 修復卡片背面樣式 */
        .news-card-back {
          transform: rotateY(180deg) !important;
          -webkit-transform: rotateY(180deg) !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
        }
      `;
      
      // 添加到文檔頭部
      document.head.appendChild(style);
      console.log('Added CSS fixes');
      
      // 添加專門針對滾動問題的 CSS 修復
      addScrollingCSSFixes();
    }
    
    // 初始化所有功能
    init();
    
    // 窗口調整大小時更新布局
    window.addEventListener('resize', () => {
      // 重新創建粒子以適應新尺寸
      createParticles();
      
      // 重新檢查可滾動內容
      checkScrollableContent();
      
      // 重新應用修復
      fixCardAndButtonBackgrounds();
      
      // 重新修復卡片背面滾動問題
      fixMobileCardScrolling();
      
      // 檢查縮放狀態
      if (window.visualViewport) {
        const currentScale = window.visualViewport.scale;
        const wasZoomed = isZoomed;
        isZoomed = currentScale > 1.1;
        
        if (wasZoomed !== isZoomed) {
          console.log('Zoom state changed on resize. Is zoomed:', isZoomed);
          
          if (isZoomed) {
            applyZoomFixes();
          } else {
            removeZoomFixes();
          }
        }
      }
    });
    
    // 監聽文檔點擊事件，處理卡片外部點擊
    document.addEventListener('click', function(e) {
      // 檢查點擊是否在卡片外部
      const clickedCard = e.target.closest('.news-card');
      
      // 如果點擊不在任何卡片內，則關閉所有已翻轉的卡片
      if (!clickedCard) {
        newsCards.forEach(card => {
          const cardInner = card.querySelector('.news-card-inner');
          if (cardInner && cardInner.classList.contains('flipped')) {
            cardInner.classList.remove('flipped');
            cardInner.style.transform = '';
          }
        });
      }
    });
    
    // 監聽頁面加載完成事件，確保所有樣式都已應用
    window.addEventListener('load', function() {
      // 再次應用修復，確保在所有資源加載後仍然有效
      fixCardAndButtonBackgrounds();
      
      // 修復卡片背面滾動問題
      fixMobileCardScrolling();
      
      // 添加 CSS 修復
      addCSSFixes();
      
      // 添加滾動指示器
      addScrollIndicators();
      
      // 增強拖拉滑動效果
      enhanceDragScrolling();
      
      // 設置縮放檢測
      setupZoomDetection();
      
      // 延遲檢查，確保在頁面完全渲染後樣式正確
      setTimeout(fixCardAndButtonBackgrounds, 500);
      setTimeout(fixMobileCardScrolling, 500);
      
      // 檢查初始縮放狀態
      if (window.visualViewport && window.visualViewport.scale > 1.1) {
        console.log('Page loaded in zoomed state');
        isZoomed = true;
        applyZoomFixes();
      }
    });
    
    // 監聽暗模式變化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      console.log('Color scheme changed, reapplying fixes');
      fixCardAndButtonBackgrounds();
      fixMobileCardScrolling();
    });
  });
  