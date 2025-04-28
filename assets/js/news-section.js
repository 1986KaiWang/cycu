// 全局變量
let newsCards = [];
let isZoomed = false;
let lastZoomCheckTime = 0;
const zoomCheckInterval = 100; // 檢查縮放的最小間隔時間（毫秒）

// 初始化函數
function initNewsGrid() {
  console.log('Initializing news grid...');
  
  // 獲取所有新聞卡片
  newsCards = document.querySelectorAll('.news-card');
  
  // 檢測是否為移動設備
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 檢測是否為 Android Chrome
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent);
  const isAndroidChrome = isAndroid && isChrome;
  
  if (isAndroidChrome) {
    document.documentElement.classList.add('android-chrome');
    console.log('Android Chrome detected');
  }
  
  if (isMobile) {
    document.documentElement.classList.add('mobile-device');
    console.log('Mobile device detected');
    
    // 在移動設備上應用特殊修復
    fixMobileCardScrolling();
  }
  
  // 設置卡片交互
  setupCardInteractions();
  
  // 設置過濾按鈕
  setupFilterButtons();
  
  // 設置卡片動畫
  setupCardAnimations();
  
  // 設置縮放檢測
  setupZoomDetection();
  
  // 創建粒子效果
  createParticles();
  
  console.log('News grid initialized');
}

// 設置卡片交互
function setupCardInteractions() {
  console.log('Setting up card interactions');
  
  // 卡片點擊效果
  newsCards.forEach(card => {
    const cardInner = card.querySelector('.news-card-inner');
    const cardFront = card.querySelector('.news-card-front');
    const cardBack = card.querySelector('.news-card-back');
    const contentScroll = card.querySelector('.news-content-scroll');
    
    // 點擊卡片正面翻轉到背面
    if (cardFront) {
      cardFront.addEventListener('click', function(e) {
        // 添加翻轉類
        cardInner.classList.add('flipped');
        
        // 如果處於縮放狀態，使用不同的翻轉方式
        if (isZoomed && document.body.classList.contains('android-chrome-zoomed')) {
          // Android Chrome 縮放狀態下，不使用 3D 變換
          cardFront.style.display = 'none';
          cardBack.style.display = 'flex';
          cardBack.style.transform = 'none';
          cardBack.style.webkitTransform = 'none';
          cardBack.style.backfaceVisibility = 'visible';
          cardBack.style.webkitBackfaceVisibility = 'visible';
          cardBack.style.zIndex = '10';
          
          // 確保內容區域可滾動
          if (contentScroll) {
            contentScroll.style.position = 'relative';
            contentScroll.style.height = 'auto';
            contentScroll.style.maxHeight = '100%';
            contentScroll.style.flex = '1';
            contentScroll.style.overflowY = 'auto';
            contentScroll.style.webkitOverflowScrolling = 'touch';
            contentScroll.style.transform = 'none';
            contentScroll.style.webkitTransform = 'none';
            contentScroll.style.zIndex = '15';
            contentScroll.classList.add('android-zoomed-scroll');
          }
        } else {
          // 正常狀態下使用 3D 變換
          cardInner.style.transform = 'rotateY(180deg)';
        }
        
        createRippleEffect(e, card);
      });
    }
    
    // 點擊卡片背面翻轉回正面
    if (cardBack) {
      cardBack.addEventListener('click', function(e) {
        // 檢查點擊是否在內容滾動區域內
        const isInContentScroll = e.target.closest('.news-content-scroll');
        
        // 如果不是在內容滾動區域內點擊，則翻轉卡片
        if (!isInContentScroll) {
          cardInner.classList.remove('flipped');
          
          // 如果處於縮放狀態，使用不同的翻轉方式
          if (isZoomed && document.body.classList.contains('android-chrome-zoomed')) {
            // Android Chrome 縮放狀態下，不使用 3D 變換
            cardFront.style.display = '';
            cardBack.style.display = 'none';
          } else {
            // 正常狀態下使用 3D 變換
            cardInner.style.transform = '';
          }
          
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
  
  // 設置卡片滾動事件
  setupCardScrollingEvents();
}

// 設置卡片滾動事件
function setupCardScrollingEvents() {
  console.log('Setting up card scrolling events');
  
  newsCards.forEach(card => {
    setupCardScrollingEvents(card);
  });
}

// 為單個卡片設置滾動事件
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
    }
  }, { passive: true }); // 修改為被動模式提高效能
  
  // 觸摸移動
  newContentScroll.addEventListener('touchmove', function(e) {
    if (!isScrolling) return;
    
    // 在縮放狀態下的特殊處理
    if (isZoomed) {
      // 總是阻止事件冒泡，確保只有內容區域滾動
      e.stopPropagation();
      return;
    }
    
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = startY - currentY;
    const diffX = startX - currentX;
    
    // 判斷是垂直滾動還是水平滾動
    if (Math.abs(diffY) > Math.abs(diffX)) {
      // 垂直滾動
      const scrollTop = this.scrollTop;
      const scrollHeight = this.scrollHeight;
      const height = this.clientHeight;
      
      // 如果已經滾動到頂部且繼續向下拉，或者已經滾動到底部且繼續向上拉，則阻止默認行為
      if ((scrollTop <= 0 && diffY < 0) || (scrollTop + height >= scrollHeight && diffY > 0)) {
        e.preventDefault();
      }
    } else {
      // 水平滾動，阻止默認行為以防止頁面左右滑動
      e.preventDefault();
    }
    
    // 更新滾動指示器
    const scrollIndicator = card.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      const scrollPercentage = (this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100;
      scrollIndicator.style.width = `${scrollPercentage}%`;
    }
    
    // 防止事件冒泡，確保卡片不會翻轉回去
    e.stopPropagation();
  }, { passive: false });
  
  // 觸摸結束
  newContentScroll.addEventListener('touchend', function(e) {
    isScrolling = false;
    
    // 防止事件冒泡，確保卡片不會翻轉回去
    e.stopPropagation();
  }, { passive: true });
  
  // 點擊內容區域時阻止冒泡
  newContentScroll.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  // 添加滾動指示器
  if (!card.querySelector('.scroll-indicator')) {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    cardBack.appendChild(scrollIndicator);
  }
  
  // 添加拖拉指示器
  if (!card.querySelector('.drag-indicator')) {
    const dragIndicator = document.createElement('div');
    dragIndicator.className = 'drag-indicator';
    dragIndicator.innerHTML = '<span></span><span></span>';
    cardBack.appendChild(dragIndicator);
  }
  
  // 監聽滾動事件以更新滾動指示器
  newContentScroll.addEventListener('scroll', function() {
    const scrollIndicator = card.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      const scrollPercentage = (this.scrollTop / (this.scrollHeight - this.clientHeight)) * 100;
      scrollIndicator.style.width = `${scrollPercentage}%`;
    }
    
    // 當開始滾動時，隱藏拖拉指示器
    const dragIndicator = card.querySelector('.drag-indicator');
    if (dragIndicator) {
      if (this.scrollTop > 0) {
        dragIndicator.style.opacity = '0';
      } else {
        dragIndicator.style.opacity = '0.5';
      }
    }
  });
}

// 修復移動設備上的卡片滾動問題
function fixMobileCardScrolling() {
  console.log('Applying mobile card scrolling fixes');
  
  newsCards.forEach(card => {
    const cardBack = card.querySelector('.news-card-back');
    const contentScroll = card.querySelector('.news-content-scroll');
    
    if (!contentScroll || !cardBack) return;
    
    // 確保內容區域可滾動
    contentScroll.style.overflowY = 'auto';
    contentScroll.style.webkitOverflowScrolling = 'touch';
    contentScroll.style.position = 'relative';
    contentScroll.style.zIndex = '10';
    
    // 設置卡片滾動事件
    setupCardScrollingEvents(card);
  });
}

// 設置過濾按鈕
function setupFilterButtons() {
  console.log('Setting up filter buttons');
  
  const filterButtons = document.querySelectorAll('.grid-control');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按鈕的活動狀態
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // 添加當前按鈕的活動狀態
      this.classList.add('active');
      
      // 獲取過濾類別
      const filterValue = this.getAttribute('data-filter');
      
      // 過濾卡片
      filterCards(filterValue);
      
      // 創建按鈕波紋效果
      createRippleEffect(event, this);
    });
    
    // 添加觸摸效果
    button.addEventListener('touchstart', function() {
      this.classList.add('touch-effect');
    });
    
    button.addEventListener('touchend', function() {
      this.classList.remove('touch-effect');
    });
  });
}

// 過濾卡片
function filterCards(category) {
  console.log('Filtering cards by category:', category);
  
  newsCards.forEach(card => {
    // 獲取卡片類別
    const cardCategory = card.getAttribute('data-category');
    
    // 如果是"all"類別或卡片類別匹配，則顯示卡片
    if (category === 'all' || cardCategory === category) {
      card.classList.remove('filtered-out');
      setTimeout(() => {
        card.style.display = '';
      }, 300);
    } else {
      // 否則隱藏卡片
      card.classList.add('filtered-out');
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

// 設置卡片動畫
function setupCardAnimations() {
  console.log('Setting up card animations');
  
  // 為每張卡片添加進入動畫
  newsCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 100);
  });
  
  // 為每張卡片添加翻轉提示
  newsCards.forEach(card => {
    const cardFront = card.querySelector('.news-card-front');
    
    if (cardFront && !card.querySelector('.flip-hint')) {
      const flipHint = document.createElement('div');
      flipHint.className = 'flip-hint';
      flipHint.innerHTML = '<span>點擊查看詳情</span><i class="fas fa-arrow-right"></i>';
      cardFront.appendChild(flipHint);
    }
  });
}

// 創建波紋效果
function createRippleEffect(e, element) {
  // 創建波紋元素
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  
  // 設置波紋位置
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  // 添加波紋到元素
  element.appendChild(ripple);
  
  // 動畫結束後移除波紋
  setTimeout(() => {
    ripple.remove();
  }, 800);
}

// 創建粒子效果
function createParticles() {
  console.log('Creating particle effects');
  
  const particlesContainer = document.querySelector('.news-grid-particles');
  
  if (!particlesContainer) return;
  
  // 創建粒子
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'news-particle';
    
    // 隨機大小
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 隨機位置
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // 隨機透明度
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    // 隨機動畫延遲
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    // 隨機動畫持續時間
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    
    // 添加浮動動畫
    particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
    
    // 添加粒子到容器
    particlesContainer.appendChild(particle);
  }
}

// 設置縮放檢測
function setupZoomDetection() {
  console.log('Setting up Android Chrome zoom detection');
  
  // 檢測是否為 Android Chrome
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent);
  const isAndroidChrome = isAndroid && isChrome;
  
  if (isAndroidChrome) {
    document.documentElement.classList.add('android-chrome');
  }
  
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
          console.log('Page is zoomed - applying Android Chrome zoom fixes');
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
          console.log('Page is zoomed - applying Android Chrome zoom fixes');
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

// 應用縮放修復
function applyZoomFixes() {
  console.log('Applying Android Chrome zoom-specific fixes');
  
  // 為 body 添加縮放類
  document.body.classList.add('is-zoomed');
  document.body.classList.add('android-chrome-zoomed');
  
  // 修復所有卡片的滾動區域
  newsCards.forEach(card => {
    const cardBack = card.querySelector('.news-card-back');
    const contentScroll = card.querySelector('.news-content-scroll');
    const cardInner = card.querySelector('.news-card-inner');
    
    if (!contentScroll || !cardBack || !cardInner) return;
    
    // 重要：在 Android Chrome 中，我們需要移除 3D 變換
    if (cardInner.classList.contains('flipped')) {
      // 如果卡片已經翻轉，調整樣式
      cardBack.style.zIndex = '10';
      cardBack.style.transform = 'none';
      cardBack.style.webkitTransform = 'none';
      cardBack.style.backfaceVisibility = 'visible';
      cardBack.style.webkitBackfaceVisibility = 'visible';
      
      cardInner.style.transformStyle = 'flat';
      cardInner.style.webkitTransformStyle = 'flat';
    }
    
    // 修改滾動區域樣式
    contentScroll.style.position = 'relative';
    contentScroll.style.height = 'auto';
    contentScroll.style.maxHeight = '100%';
    contentScroll.style.flex = '1';
    contentScroll.style.overflowY = 'auto';
    contentScroll.style.webkitOverflowScrolling = 'touch';
    contentScroll.style.transform = 'none';
    contentScroll.style.webkitTransform = 'none';
    contentScroll.style.zIndex = '15';
    
    // 添加特殊類
    contentScroll.classList.add('android-zoomed-scroll');
    
    // 重新綁定觸控事件
    contentScroll.addEventListener('touchstart', function(e) {
      // 阻止事件冒泡，確保不會翻轉卡片
      e.stopPropagation();
    }, { passive: false });
    
    contentScroll.addEventListener('touchmove', function(e) {
      // 阻止事件冒泡，確保不會翻轉卡片
      e.stopPropagation();
    }, { passive: false });
    
    contentScroll.addEventListener('touchend', function(e) {
      // 阻止事件冒泡，確保不會翻轉卡片
      e.stopPropagation();
    }, { passive: false });
  });
  
  // 添加 Android Chrome 縮放特定的 CSS
  if (!document.getElementById('android-zoom-fixes-style')) {
    const zoomStyle = document.createElement('style');
    zoomStyle.id = 'android-zoom-fixes-style';
    zoomStyle.textContent = `
      /* Android Chrome 縮放狀態下的修復 */
      body.android-chrome-zoomed .news-card {
        perspective: none !important;
        -webkit-perspective: none !important;
        transform-style: flat !important;
        -webkit-transform-style: flat !important;
        height: auto !important;
        min-height: 280px !important;
      }
      
      body.android-chrome-zoomed .news-card-inner {
        transform-style: flat !important;
        -webkit-transform-style: flat !important;
      }
      
      body.android-chrome-zoomed .news-card-inner.flipped .news-card-front {
        display: none !important;
      }
      
      body.android-chrome-zoomed .news-card-inner.flipped .news-card-back {
        transform: none !important;
        -webkit-transform: none !important;
        backface-visibility: visible !important;
        -webkit-backface-visibility: visible !important;
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        z-index: 10 !important;
      }
      
      body.android-chrome-zoomed .android-zoomed-scroll {
        position: relative !important;
        height: auto !important;
        max-height: 100% !important;
        flex: 1 !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        z-index: 15 !important;
        transform: none !important;
        -webkit-transform: none !important;
        touch-action: pan-y !important;
      }
      
      body.android-chrome-zoomed .back-header {
        flex-shrink: 0 !important;
        position: relative !important;
        z-index: 16 !important;
      }
      
      /* 確保卡片翻轉後的樣式 */
      body.android-chrome-zoomed .news-card-inner.flipped {
        transform: none !important;
        -webkit-transform: none !important;
      }
    `;
    document.head.appendChild(zoomStyle);
  }
}

// 移除縮放修復
function removeZoomFixes() {
  console.log('Removing Android Chrome zoom-specific fixes');
  
  // 移除縮放類
  document.body.classList.remove('is-zoomed');
  document.body.classList.remove('android-chrome-zoomed');
  
  // 移除縮放特定的 CSS
  const zoomStyle = document.getElementById('android-zoom-fixes-style');
  if (zoomStyle) {
    zoomStyle.remove();
  }
  
  // 重置所有卡片
  newsCards.forEach(card => {
    const cardInner = card.querySelector('.news-card-inner');
    const cardFront = card.querySelector('.news-card-front');
    const cardBack = card.querySelector('.news-card-back');
    const contentScroll = card.querySelector('.news-content-scroll');
    
    if (!cardInner || !cardFront || !cardBack || !contentScroll) return;
    
    // 重置卡片樣式
    cardFront.style.display = '';
    cardBack.style.display = '';
    
        // 重置 3D 變換
        cardInner.style.transformStyle = 'preserve-3d';
        cardInner.style.webkitTransformStyle = 'preserve-3d';
        
        // 重置卡片背面樣式
        cardBack.style.transform = 'rotateY(180deg)';
        cardBack.style.webkitTransform = 'rotateY(180deg)';
        cardBack.style.backfaceVisibility = 'hidden';
        cardBack.style.webkitBackfaceVisibility = 'hidden';
        
        // 重置內容滾動區域
        contentScroll.style.position = 'relative';
        contentScroll.style.height = '';
        contentScroll.style.maxHeight = '';
        contentScroll.style.flex = '1';
        contentScroll.style.overflowY = 'auto';
        contentScroll.style.transform = '';
        contentScroll.style.webkitTransform = '';
        contentScroll.style.zIndex = '10';
        
        // 移除特殊類
        contentScroll.classList.remove('android-zoomed-scroll');
        
        // 如果卡片已翻轉，確保正確的翻轉狀態
        if (cardInner.classList.contains('flipped')) {
          cardInner.style.transform = 'rotateY(180deg)';
        }
      });
      
      // 重新應用標準卡片滾動修復
      fixMobileCardScrolling();
    }
    
    // 檢測設備類型並應用相應的修復
    function detectDeviceAndApplyFixes() {
      // 檢測是否為移動設備
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // 檢測是否為 Android Chrome
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isChrome = /Chrome/i.test(navigator.userAgent);
      const isAndroidChrome = isAndroid && isChrome;
      
      // 根據設備類型應用相應的修復
      if (isMobile) {
        document.documentElement.classList.add('mobile-device');
        
        if (isAndroidChrome) {
          document.documentElement.classList.add('android-chrome');
          document.documentElement.classList.add('mobile-chrome');
          
          // 應用 Android Chrome 特定修復
          applyAndroidChromeFixes();
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          document.documentElement.classList.add('ios-device');
          
          // 應用 iOS 特定修復
          applyIOSFixes();
        }
        
        // 應用通用移動設備修復
        fixMobileCardScrolling();
      }
    }
    
    // 應用 Android Chrome 特定修復
    function applyAndroidChromeFixes() {
      console.log('Applying Android Chrome specific fixes');
      
      // 修復卡片翻轉問題
      newsCards.forEach(card => {
        const cardInner = card.querySelector('.news-card-inner');
        const cardFront = card.querySelector('.news-card-front');
        const cardBack = card.querySelector('.news-card-back');
        
        if (!cardInner || !cardFront || !cardBack) return;
        
        // 確保 3D 變換正常工作
        cardInner.style.webkitTransformStyle = 'preserve-3d';
        cardInner.style.transformStyle = 'preserve-3d';
        
        // 確保背面隱藏
        cardFront.style.webkitBackfaceVisibility = 'hidden';
        cardFront.style.backfaceVisibility = 'hidden';
        cardBack.style.webkitBackfaceVisibility = 'hidden';
        cardBack.style.backfaceVisibility = 'hidden';
        
        // 確保背面正確旋轉
        cardBack.style.webkitTransform = 'rotateY(180deg)';
        cardBack.style.transform = 'rotateY(180deg)';
      });
      
      // 添加 Android Chrome 特定的 CSS
      if (!document.getElementById('android-chrome-fixes-style')) {
        const chromeStyle = document.createElement('style');
        chromeStyle.id = 'android-chrome-fixes-style';
        chromeStyle.textContent = `
          /* Android Chrome 特定修復 */
          .android-chrome .news-card {
            transform-style: preserve-3d !important;
            -webkit-transform-style: preserve-3d !important;
            perspective: 1000px !important;
            -webkit-perspective: 1000px !important;
          }
          
          .android-chrome .news-card-inner {
            transform-style: preserve-3d !important;
            -webkit-transform-style: preserve-3d !important;
          }
          
          .android-chrome .news-card-front,
          .android-chrome .news-card-back {
            -webkit-backface-visibility: hidden !important;
            backface-visibility: hidden !important;
            position: absolute !important;
          }
          
          .android-chrome .news-card-back {
            transform: rotateY(180deg) !important;
            -webkit-transform: rotateY(180deg) !important;
          }
          
          .android-chrome .news-card-inner.flipped {
            transform: rotateY(180deg) !important;
            -webkit-transform: rotateY(180deg) !important;
          }
          
          /* 強制使用硬件加速 */
          .android-chrome .news-card,
          .android-chrome .news-card-inner,
          .android-chrome .news-card-front,
          .android-chrome .news-card-back {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
          }
        `;
        document.head.appendChild(chromeStyle);
      }
    }
    
    // 應用 iOS 特定修復
    function applyIOSFixes() {
      console.log('Applying iOS specific fixes');
      
      // 修復 iOS 上的滾動問題
      newsCards.forEach(card => {
        const contentScroll = card.querySelector('.news-content-scroll');
        
        if (!contentScroll) return;
        
        // 確保滾動區域使用原生滾動
        contentScroll.style.webkitOverflowScrolling = 'touch';
        contentScroll.style.overscrollBehavior = 'contain';
      });
      
      // 添加 iOS 特定的 CSS
      if (!document.getElementById('ios-fixes-style')) {
        const iosStyle = document.createElement('style');
        iosStyle.id = 'ios-fixes-style';
        iosStyle.textContent = `
          /* iOS 特定修復 */
          .ios-device .news-content-scroll {
            -webkit-overflow-scrolling: touch !important;
            overflow-y: auto !important;
            overscroll-behavior: contain !important;
          }
          
          /* 修復 iOS 上的點擊延遲 */
          .ios-device .news-card,
          .ios-device .grid-control,
          .ios-device .load-more-btn {
            cursor: pointer;
            touch-action: manipulation;
          }
        `;
        document.head.appendChild(iosStyle);
      }
    }
    
    // 加載更多新聞
    function loadMoreNews() {
      console.log('Loading more news');
      
      // 這裡可以實現加載更多新聞的邏輯
      // 例如通過 AJAX 請求獲取更多新聞數據
      
      // 模擬加載更多新聞
      const loadMoreBtn = document.querySelector('.load-more-btn');
      
      if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<span>加載中...</span><i class="fas fa-spinner fa-spin"></i>';
        
        // 模擬加載延遲
        setTimeout(() => {
          // 恢復按鈕狀態
          loadMoreBtn.innerHTML = '<span>加載更多</span><i class="fas fa-arrow-down"></i>';
          
          // 顯示加載完成提示
          const loadCompleteToast = document.createElement('div');
          loadCompleteToast.className = 'load-complete-toast';
          loadCompleteToast.textContent = '已加載全部內容';
          document.body.appendChild(loadCompleteToast);
          
          // 顯示提示一段時間後移除
          setTimeout(() => {
            loadCompleteToast.remove();
          }, 3000);
        }, 1500);
      }
    }
    
    // 當 DOM 加載完成時初始化
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM content loaded');
      
      // 初始化新聞網格
      initNewsGrid();
      
      // 檢測設備類型並應用相應的修復
      detectDeviceAndApplyFixes();
      
      // 設置加載更多按鈕
      const loadMoreBtn = document.querySelector('.load-more-btn');
      
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
          loadMoreNews();
          createRippleEffect(e, this);
        });
      }
    });
    
    // 當頁面完全加載時（包括所有資源）
    window.addEventListener('load', function() {
      console.log('Page fully loaded');
      
      // 重新檢查設備類型並應用修復
      // 這是為了確保在頁面完全加載後修復仍然有效
      detectDeviceAndApplyFixes();
      
      // 在頁面加載後延遲檢查縮放狀態
      setTimeout(function() {
        if (window.visualViewport) {
          const currentScale = window.visualViewport.scale;
          console.log('Initial page load scale:', currentScale);
          
          if (currentScale > 1.1) {
            console.log('Page is already zoomed on load - applying fixes');
            isZoomed = true;
            applyZoomFixes();
          }
        }
      }, 500);
    });
    
    // 處理方向變化事件
    window.addEventListener('orientationchange', function() {
      console.log('Orientation changed');
      
      // 延遲處理以確保 UI 已更新
      setTimeout(function() {
        // 重新應用修復
        if (isZoomed) {
          removeZoomFixes();
          applyZoomFixes();
        }
        
        // 重新檢測設備並應用修復
        detectDeviceAndApplyFixes();
      }, 300);
    });
    
    // 處理可見性變化事件（例如切換到其他應用再返回）
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible again');
        
        // 延遲處理以確保 UI 已更新
        setTimeout(function() {
          // 重新應用修復
          if (isZoomed) {
            removeZoomFixes();
            applyZoomFixes();
          }
          
          // 重新檢測設備並應用修復
          detectDeviceAndApplyFixes();
        }, 300);
      }
    });
    