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
      
      if (isChrome) {
        // 為手機版Chrome添加特殊處理
        document.documentElement.classList.add('mobile-chrome');
        console.log('Mobile Chrome detected - applying fixes');
        
        // 手動強化動畫效果
        enhanceMobileAnimations();
      }
    }
    
    // 添加調試信息
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile Chrome:', isMobileChrome);
    console.log('Mobile Chrome class added:', document.documentElement.classList.contains('mobile-chrome'));
    console.log('Dark mode preference:', window.matchMedia('(prefers-color-scheme: dark)').matches);
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
            }, { passive: true });
            
            // 觸摸移動
            contentScroll.addEventListener('touchmove', function(e) {
              if (!isScrolling) return;
              
              isTouchMove = true; // 設置為有滑動
              
              const currentY = e.touches[0].clientY;
              const currentX = e.touches[0].clientX;
              
              // 計算水平和垂直移動距離
              const deltaX = Math.abs(currentX - startX);
              const deltaY = Math.abs(currentY - startY);
              
              // 如果水平移動大於垂直移動，則阻止卡片翻轉
              if (deltaX > deltaY && deltaX > 10) {
                e.stopPropagation();
              }
            }, { passive: true });
            
            // 觸摸結束
            contentScroll.addEventListener('touchend', function() {
              isScrolling = false;
              this.classList.remove('active-scroll');
            }, { passive: true });
            
            // 滾動時隱藏滑動提示
            contentScroll.addEventListener('scroll', function() {
              const swipeHint = card.querySelector('.swipe-hint');
              if (swipeHint) swipeHint.style.opacity = '0';
            }, { passive: true });
            
            // 為卡片背面添加觸控事件
            if (cardBack) {
              cardBack.addEventListener('touchstart', function(e) {
                // 檢查點擊是否在內容滾動區域內
                const isInContentScroll = e.target.closest('.news-content-scroll');
                if (isInContentScroll) return; // 如果在滾動區域內，則不處理
                
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isTouchMove = false; // 重置滑動狀態
              }, { passive: true });
              
              cardBack.addEventListener('touchmove', function() {
                isTouchMove = true; // 設置為有滑動
              }, { passive: true });
              
              cardBack.addEventListener('touchend', function(e) {
                // 檢查點擊是否在內容滾動區域內
                const isInContentScroll = e.target.closest('.news-content-scroll');
                if (isInContentScroll) return; // 如果在滾動區域內，則不處理
                
                // 如果沒有明顯滑動，則視為點擊
                if (!isTouchMove) {
                  // 翻轉回正面
                  cardInner.classList.remove('flipped');
                  cardInner.style.transform = '';
                }
              });
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
        
        // 確保卡片保持在原位的函數
        function ensureCardPosition() {
          // 為所有卡片添加事件監聽器，確保翻轉後位置正確
          newsCards.forEach(card => {
            const cardInner = card.querySelector('.news-card-inner');
            
            // 監聽翻轉過渡結束事件
            cardInner.addEventListener('transitionend', function(e) {
              if (e.propertyName === 'transform') {
                // 確保卡片在原位
                card.style.position = 'relative';
                
                // 檢查是否處於翻轉狀態
                if (this.classList.contains('flipped')) {
                  // 確保背面卡片在視圖中
                  const cardBack = card.querySelector('.news-card-back');
                  if (cardBack) {
                    cardBack.style.zIndex = '2';
                  }
                } else {
                  // 恢復正面卡片的層級
                  const cardBack = card.querySelector('.news-card-back');
                  if (cardBack) {
                    cardBack.style.zIndex = 'auto';
                  }
                }
              }
            });
          });
        }
        
        // 強化手機版動畫效果 - 修改版
        function enhanceMobileAnimations() {
          console.log('Enhancing mobile animations');
          
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
              }, { passive: false }); // 設置為非被動模式
            }
            
            // 確保背面點擊事件正常工作
            if (cardBack) {
              cardBack.addEventListener('touchend', function(e) {
                // 檢查點擊是否在內容滾動區域內
                const isInContentScroll = e.target.closest('.news-content-scroll');
                if (isInContentScroll) return;
                
                // 翻轉回正面
                cardInner.classList.remove('flipped');
                cardInner.style.transform = '';
              }, { passive: false });
            }
          });
          
          // 強化按鈕動畫
          document.querySelectorAll('.grid-control').forEach(button => {
            // 強制設置背景為透明
            button.style.backgroundColor = 'transparent';
            
            button.addEventListener('touchstart', function() {
              // 添加觸摸效果類
              this.classList.add('touch-effect');
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
              // 移除觸摸效果類
              setTimeout(() => {
                this.classList.remove('touch-effect');
              }, 300);
            }, { passive: true });
          });
          
          // 強制設置卡片前面為白色背景
          document.querySelectorAll('.news-card-front').forEach(front => {
            front.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            front.style.color = '#1E293B';
          });
        }
        
        // 初始化所有功能
        init();
        addScrollIndicators();
        enhanceDragScrolling();
        ensureCardPosition(); // 確保卡片位置正確
        
        // 窗口調整大小時更新布局
        window.addEventListener('resize', () => {
          // 重新創建粒子以適應新尺寸
          createParticles();
          
          // 重新檢查可滾動內容
          checkScrollableContent();
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
      });
      
