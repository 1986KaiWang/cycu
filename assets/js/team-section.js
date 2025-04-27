/**
 * 時尚酷炫團隊展示系統 - 整合學術發表區塊的按鈕動畫效果
 */
document.addEventListener('DOMContentLoaded', function() {
  // 獲取所有分類按鈕和成員項目
  const filterButtons = document.querySelectorAll('.member-filters li');
  const memberCards = document.querySelectorAll('.member-card');
  
  // 將按鈕容器包裹在新的容器中，實現學經歷區塊的玻璃擬態效果
  const filterWrapper = document.querySelector('.filter-wrapper');
  if (filterWrapper) {
      const filterList = filterWrapper.querySelector('.member-filters');
      if (filterList && !document.querySelector('.member-filters-container')) {
          // 創建新的容器
          const newContainer = document.createElement('div');
          newContainer.className = 'member-filters-container';
          
          // 將原有的按鈕列表移動到新容器中
          filterList.parentNode.insertBefore(newContainer, filterList);
          newContainer.appendChild(filterList);
      }
  }
  
  // 重構按鈕，添加圖標容器和波紋效果 - 與學術發表區塊一致
  filterButtons.forEach(button => {
      // 檢查是否已經重構過
      if (!button.querySelector('.tab-icon')) {
          // 獲取過濾器文本
          const filterText = button.querySelector('.filter-text');
          const buttonText = filterText ? filterText.textContent.trim() : button.textContent.trim();
          
          // 保存原有的 data-filter 屬性
          const filterValue = button.getAttribute('data-filter');
          
          // 清空按鈕內容
          button.innerHTML = '';
          
          // 添加圖標容器
          const iconContainer = document.createElement('div');
          iconContainer.className = 'tab-icon';
          
          // 添加粒子效果容器
          const particlesContainer = document.createElement('div');
          particlesContainer.className = 'icon-particles-container';
          iconContainer.appendChild(particlesContainer);
          
          // 根據過濾器類型添加不同的圖標
          let iconClass = 'bi bi-people';
          
          if (filterValue === '*') {
              iconClass = 'bi bi-people-fill'; // 全部成員
          } else if (filterValue === '.filter-master') {
              iconClass = 'bi bi-mortarboard-fill'; // 碩博士生
          } else if (filterValue === '.filter-undergrad') {
              iconClass = 'bi bi-journal-text'; // 專題研究生
          } else if (filterValue === '.filter-international') {
              iconClass = 'bi bi-globe'; // 外籍生
          } else if (filterValue === '.filter-alumni') {
              iconClass = 'bi bi-hourglass-split'; // 歷年畢業學生
          }
          
          // 添加圖標
          const icon = document.createElement('i');
          icon.className = iconClass;
          iconContainer.appendChild(icon);
          
          // 將圖標容器添加到按鈕
          button.appendChild(iconContainer);
          
          // 添加文本元素
          const textElement = document.createElement('span');
          textElement.className = 'filter-text';
          textElement.textContent = buttonText;
          button.appendChild(textElement);
          
          // 添加閃光元素
          const flashElement = document.createElement('div');
          flashElement.className = 'portfolio-flash';
          button.appendChild(flashElement);
          
          // 添加懸停背景元素
          const hoverBg = document.createElement('div');
          hoverBg.className = 'filter-hover';
          button.appendChild(hoverBg);
          
          // 添加點擊事件
          button.addEventListener('click', function(event) {
              // 移除所有按鈕的活動狀態
              filterButtons.forEach(btn => {
                  btn.classList.remove('filter-active');
                  btn.classList.remove('clicking');
              });
              
              // 添加當前按鈕的活動狀態
              this.classList.add('filter-active');
              
              // 添加點擊類，用於觸發閃爍動畫
              this.classList.add('clicking');
              
              // 創建多個波紋效果，增強閃動感
              createMultipleRipples(event, this);
              
              // 觸發閃光效果
              const flash = this.querySelector('.portfolio-flash');
              flash.style.animation = 'none';
              void flash.offsetWidth; // 觸發重繪
              flash.style.animation = 'portfolio-flash 0.5s ease-out';
              
              // 創建粒子效果
              createParticleEffect(this);
              
              // 移除點擊類
              setTimeout(() => {
                  this.classList.remove('clicking');
              }, 500);
              
              // 獲取過濾條件
              const filterValue = this.getAttribute('data-filter');
              
              // 過濾成員項目並重新初始化輪播
              filterMembers(filterValue);
          });
          
          // 添加懸停事件，增強圖標動畫
          button.addEventListener('mouseenter', function() {
              // 添加圖標發光效果
              const icon = this.querySelector('.tab-icon i');
              if (icon && !this.classList.contains('filter-active')) {
                  icon.style.animation = 'iconGlow 1.5s ease-in-out infinite';
              }
              
              // 創建微粒子效果
              createMiniParticles(this);
          });
          
          button.addEventListener('mouseleave', function() {
              // 移除圖標發光效果
              const icon = this.querySelector('.tab-icon i');
              if (icon && !this.classList.contains('filter-active')) {
                  icon.style.animation = '';
              }
              
              // 如果是活動狀態，恢復浮動動畫
              if (this.classList.contains('filter-active')) {
                  const icon = this.querySelector('.tab-icon i');
                  if (icon) {
                      icon.style.animation = 'iconWave 2s ease-in-out infinite';
                  }
              }
          });
      }
  });
  
  // 升級成員卡片樣式
  enhanceMemberCards();
  
  // 輪播控制變數
  let currentIndex = 0;
  let filteredCards = [];
  let autoplayInterval;
  const autoplayDuration = 4000; // 自動輪播間隔（毫秒）
  const transitionDuration = 500; // 過渡動畫持續時間（毫秒）
  let progressBar = document.querySelector('.progress-bar');
  let progressInterval;
  let currentProgress = 0;
  let isAnimating = false; // 防止動畫重疊
  
  // 初始化輪播指示器
  initIndicators();
  
  // 初始化輪播
  initCarousel();
  
  // 為輪播控制按鈕添加事件
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (event) => {
          if (isAnimating) return;
          showPrevItem();
          resetAutoplay();
          createRippleEffect(event, prevBtn);
      });
      
      nextBtn.addEventListener('click', (event) => {
          if (isAnimating) return;
          showNextItem();
          resetAutoplay();
          createRippleEffect(event, nextBtn);
      });
  }
  
  // 創建多重波紋效果，增強閃動感
  function createMultipleRipples(event, element) {
      // 清除現有波紋
      const existingRipples = element.querySelectorAll('.portfolio-ripple');
      existingRipples.forEach(ripple => ripple.remove());
      
      // 創建主波紋
      createRippleEffect(event, element);
      
      // 創建額外波紋，位置略有偏移，增強閃動感
      setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // 創建4個偏移波紋
          const offsets = [
              { x: centerX - 10, y: centerY - 10 },
              { x: centerX + 10, y: centerY - 10 },
              { x: centerX - 10, y: centerY + 10 },
              { x: centerX + 10, y: centerY + 10 }
          ];
          
          offsets.forEach((offset, index) => {
              setTimeout(() => {
                  const fakeEvent = { 
                      clientX: rect.left + offset.x, 
                      clientY: rect.top + offset.y 
                  };
                  createRippleEffect(fakeEvent, element, 0.5); // 較低的不透明度
              }, index * 50); // 錯開時間
          });
      }, 100);
  }
  
  // 波紋效果函數
  function createRippleEffect(event, element, opacity = 0.7) {
      const ripple = document.createElement('span');
      ripple.classList.add('portfolio-ripple');
      
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      
      // 設置不透明度
      ripple.style.opacity = opacity;
      
      element.appendChild(ripple);
      
      setTimeout(() => {
          ripple.remove();
      }, 800);
  }
  
  // 創建粒子效果
  function createParticleEffect(element) {
      const iconContainer = element.querySelector('.tab-icon');
      const particlesContainer = element.querySelector('.icon-particles-container');
      
      if (!particlesContainer) return;
      
      // 清除現有粒子
      while (particlesContainer.firstChild) {
          particlesContainer.removeChild(particlesContainer.firstChild);
      }
      
      // 創建新粒子
      const particleCount = 15;
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
  
  // 創建微粒子效果 (懸停時)
  function createMiniParticles(element) {
      const iconContainer = element.querySelector('.tab-icon');
      const particlesContainer = element.querySelector('.icon-particles-container');
      
      if (!particlesContainer) return;
      
      // 清除現有粒子
      while (particlesContainer.firstChild) {
          particlesContainer.removeChild(particlesContainer.firstChild);
      }
      
      // 創建微粒子
      const particleCount = 5;
      const rect = iconContainer.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'icon-particle';
          
          // 隨機位置
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 12 + 8;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          // 設置樣式
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.width = `${Math.random() * 2 + 1}px`;
          particle.style.height = particle.style.width;
          particle.style.opacity = '0.7';
          
          // 設置動畫
          const duration = Math.random() * 1 + 1;
          const delay = Math.random() * 0.5;
          
          particle.style.animation = `particleFloat ${duration}s ease-out ${delay}s infinite`;
          
          // 添加到容器
          particlesContainer.appendChild(particle);
      }
  }
  
  // 升級成員卡片樣式
  function enhanceMemberCards() {
      memberCards.forEach(card => {
          // 為標題添加漸變文字效果
          const title = card.querySelector('.member-info h3');
          if (title) {
              title.style.background = 'var(--gradient-primary)';
              title.style.backgroundClip = 'text';
              title.style.textFillColor = 'transparent';
          }
          
          // 為引言添加全新設計並移除引號
          const quoteContainer = card.querySelector('.member-quote');
          if (quoteContainer) {
              // 移除可能存在的舊樣式
              const quote = quoteContainer.querySelector('p');
              if (quote) {
                  // 移除邊框和填充
                  quote.style.paddingLeft = '';
                  quote.style.borderLeft = '';
                  quote.style.borderImage = '';
                  
                  // 確保文本居中
                  quote.style.textAlign = 'center';
                  
                  // 移除引號符號（包括中英文引號）
                  let quoteText = quote.innerHTML;
                  quoteText = quoteText.replace(/[""]|&ldquo;|&rdquo;|&quot;/g, '');
                  quote.innerHTML = quoteText;
              }
          }
          
          // 為關鍵詞添加時尚懸停效果
          const keywords = card.querySelectorAll('.research-keywords span');
          keywords.forEach(keyword => {
              keyword.style.transition = 'var(--transition-fast)';
              
              // 添加懸停事件
              keyword.addEventListener('mouseenter', function() {
                  this.style.transform = 'translateY(-3px)';
                  this.style.boxShadow = '0 8px 15px rgba(106, 17, 203, 0.15)';
                  this.style.background = 'var(--gradient-primary)';
                  this.style.color = 'white';
                  this.style.borderColor = 'transparent';
              });
              
              keyword.addEventListener('mouseleave', function() {
                  this.style.transform = '';
                  this.style.boxShadow = '';
                  this.style.background = '';
                  this.style.color = '';
                  this.style.borderColor = '';
              });
          });
      });
  }
  
  // 初始化輪播指示器
  function initIndicators() {
      const indicatorsContainer = document.querySelector('.carousel-indicators');
      if (!indicatorsContainer) return;
      
      indicatorsContainer.innerHTML = '';
      
      // 為每個成員卡片創建一個指示器
      memberCards.forEach((_, index) => {
          const indicator = document.createElement('div');
          indicator.classList.add('indicator');
          if (index === 0) indicator.classList.add('active');
          
          indicator.addEventListener('click', (event) => {
              if (isAnimating) return;
              goToSlide(index);
              resetAutoplay();
              createRippleEffect(event, indicator);
          });
          
          indicatorsContainer.appendChild(indicator);
      });
  }
  
  // 更新指示器狀態
  function updateIndicators() {
      const indicators = document.querySelectorAll('.indicator');
      indicators.forEach((indicator, index) => {
          if (index === currentIndex) {
              indicator.classList.add('active');
          } else {
              indicator.classList.remove('active');
          }
      });
  }
  
  // 過濾成員項目的函數
  function filterMembers(filter) {
      // 設置動畫標誌
      isAnimating = true;
      
      // 停止當前的輪播
      resetAutoplay();
      
      // 重置輪播索引
      currentIndex = 0;
      
      // 過濾項目
      filteredCards = Array.from(memberCards).filter(card => {
          if (filter === '*') {
              return true;
          } else {
              return card.classList.contains(filter.replace('.', ''));
          }
      });
      
      // 更新輪播指示器
      updateFilteredIndicators();
      
      // 隱藏所有項目
      memberCards.forEach(card => {
          card.classList.remove('active', 'animate-in');
          card.style.display = 'none';
      });
      
      // 如果有匹配的項目，顯示第一個
      if (filteredCards.length > 0) {
          filteredCards[0].classList.add('active');
          filteredCards[0].style.display = 'flex'; // 使用flex布局
          
          // 添加延遲以確保DOM更新
          setTimeout(() => {
              filteredCards[0].classList.add('animate-in');
              
              // 動畫完成後重置標誌
              setTimeout(() => {
                  isAnimating = false;
              }, transitionDuration);
          }, 50);
      } else {
          isAnimating = false;
      }
      
      // 重新啟動輪播
      startAutoplay();
      
      // 確保在過濾後移除引號
      setTimeout(removeQuotationMarks, 100);
  }
  
  // 更新過濾後的指示器
  function updateFilteredIndicators() {
      const indicatorsContainer = document.querySelector('.carousel-indicators');
      if (!indicatorsContainer) return;
      
      // 清空指示器容器
      indicatorsContainer.innerHTML = '';
      
      // 為每個過濾後的卡片創建新的指示器
      filteredCards.forEach((_, index) => {
          const indicator = document.createElement('div');
          indicator.classList.add('indicator');
          if (index === 0) indicator.classList.add('active');
          
          indicator.addEventListener('click', (event) => {
              if (isAnimating) return;
              goToSlide(index);
              resetAutoplay();
              createRippleEffect(event, indicator);
          });
          
          indicatorsContainer.appendChild(indicator);
      });
  }
  
  // 顯示下一個項目
  function showNextItem() {
      if (filteredCards.length <= 1 || isAnimating) return;
      
      // 設置動畫標誌
      isAnimating = true;
      
      // 移除動畫類
      filteredCards[currentIndex].classList.remove('animate-in');
      
      // 隱藏當前項目
      filteredCards[currentIndex].classList.remove('active');
      filteredCards[currentIndex].style.display = 'none';
      
      // 更新索引
      currentIndex = (currentIndex + 1) % filteredCards.length;
      
      // 顯示新的當前項目
      filteredCards[currentIndex].classList.add('active');
      filteredCards[currentIndex].style.display = 'flex'; // 使用flex布局
      
      // 添加延遲以確保DOM更新
      setTimeout(() => {
          filteredCards[currentIndex].classList.add('animate-in');
          
          // 動畫完成後重置標誌
          setTimeout(() => {
              isAnimating = false;
          }, transitionDuration);
      }, 50);
      
      // 更新指示器
      updateIndicators();
      
      // 重置進度條
      resetProgressBar();
  }
  
  // 顯示上一個項目
  function showPrevItem() {
      if (filteredCards.length <= 1 || isAnimating) return;
      
      // 設置動畫標誌
      isAnimating = true;
      
      // 移除動畫類
      filteredCards[currentIndex].classList.remove('animate-in');
      
      // 隱藏當前項目
      filteredCards[currentIndex].classList.remove('active');
      filteredCards[currentIndex].style.display = 'none';
      
      // 更新索引
      currentIndex = (currentIndex - 1 + filteredCards.length) % filteredCards.length;
      
      // 顯示新的當前項目
      filteredCards[currentIndex].classList.add('active');
      filteredCards[currentIndex].style.display = 'flex'; // 使用flex布局
      
      // 添加延遲以確保DOM更新
      setTimeout(() => {
          filteredCards[currentIndex].classList.add('animate-in');
          
          // 動畫完成後重置標誌
          setTimeout(() => {
              isAnimating = false;
          }, transitionDuration);
      }, 50);
      
      // 更新指示器
      updateIndicators();
      
      // 重置進度條
      resetProgressBar();
  }
  
  // 跳轉到特定幻燈片
  function goToSlide(index) {
      if (index >= filteredCards.length || index < 0 || isAnimating) return;
      
      // 設置動畫標誌
      isAnimating = true;
      
      // 移除動畫類
      filteredCards[currentIndex].classList.remove('animate-in');
      
      // 隱藏當前項目
      filteredCards[currentIndex].classList.remove('active');
      filteredCards[currentIndex].style.display = 'none';
      
      // 更新索引
      currentIndex = index;
      
      // 顯示新的當前項目
      filteredCards[currentIndex].classList.add('active');
      filteredCards[currentIndex].style.display = 'flex'; // 使用flex布局
      
      // 添加延遲以確保DOM更新
      setTimeout(() => {
          filteredCards[currentIndex].classList.add('animate-in');
          
          // 動畫完成後重置標誌
          setTimeout(() => {
              isAnimating = false;
          }, transitionDuration);
      }, 50);
      
      // 更新指示器
      updateIndicators();
      
        // 重置進度條
  resetProgressBar();
}

// 初始化輪播 (續)
function initCarousel() {
  // 初始過濾所有成員
  filterMembers('*');
  
  // 啟動自動輪播
  startAutoplay();
  
  // 添加鼠標懸停事件
  const memberShowcase = document.querySelector('.member-showcase');
  if (memberShowcase) {
      memberShowcase.addEventListener('mouseenter', pauseAutoplay);
      memberShowcase.addEventListener('mouseleave', resumeAutoplay);
  }
  
  // 添加觸摸事件支持
  initTouchEvents();
  
  // 設置第一個按鈕為活動狀態
  if (filterButtons.length > 0) {
      filterButtons[0].classList.add('filter-active');
  }
  
  // 移除所有引言區塊中的引號
  removeQuotationMarks();
  
  // 為活動按鈕添加初始動畫
  setTimeout(() => {
      document.querySelectorAll('.member-filters li.filter-active').forEach(button => {
          const icon = button.querySelector('.tab-icon i');
          if (icon) {
              icon.style.animation = 'iconWave 2s ease-in-out infinite';
          }
          createMiniParticles(button);
      });
  }, 500);
}

// 增強版引號移除函數
function removeQuotationMarks() {
  const quoteContainers = document.querySelectorAll('.member-quote');
  quoteContainers.forEach(container => {
      // 處理所有文本節點，徹底移除引號
      const walkNodes = document.createTreeWalker(
          container, 
          NodeFilter.SHOW_TEXT, 
          null, 
          false
      );
      
      let node;
      while (node = walkNodes.nextNode()) {
          // 移除所有類型的引號字符
          node.nodeValue = node.nodeValue.replace(/["'"'""„«»]/g, '');
      }
      
      // 處理 HTML 內容中的引號實體
      if (container.innerHTML) {
          container.innerHTML = container.innerHTML.replace(
              /["'"'""„«»]|&ldquo;|&rdquo;|&quot;|&lsquo;|&rsquo;/g, 
              ''
          );
      }
      
      // 處理段落元素
      const quoteParagraph = container.querySelector('p');
      if (quoteParagraph) {
          let quoteText = quoteParagraph.innerHTML;
          // 移除所有引號字符（包括中英文引號）
          quoteText = quoteText.replace(/["'"'""„«»]|&ldquo;|&rdquo;|&quot;|&lsquo;|&rsquo;|"|"/g, '');
          quoteParagraph.innerHTML = quoteText;
      }
  });
}

// 啟動自動輪播
function startAutoplay() {
  if (filteredCards.length <= 1) return;
  
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
      if (!isAnimating) {
          showNextItem();
      }
  }, autoplayDuration);
  
  // 啟動進度條
  startProgressBar();
}

// 暫停自動輪播
function pauseAutoplay() {
  clearInterval(autoplayInterval);
  
  // 暫停進度條
  pauseProgressBar();
}

// 恢復自動輪播
function resumeAutoplay() {
  if (filteredCards.length <= 1) return;
  
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
      if (!isAnimating) {
          showNextItem();
      }
  }, autoplayDuration);
  
  // 恢復進度條
  resumeProgressBar();
}

// 重置自動輪播計時器
function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// 啟動進度條
function startProgressBar() {
  if (!progressBar) return;
  
  // 重置進度條
  progressBar.style.width = '0%';
  currentProgress = 0;
  
  // 清除之前的進度條間隔
  cancelAnimationFrame(progressInterval);
  
  // 使用requestAnimationFrame替代setInterval以獲得更平滑的動畫
  const startTime = performance.now();
  
  function updateProgress(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(100, (elapsedTime / autoplayDuration) * 100);
      
      progressBar.style.width = `${progress}%`;
      currentProgress = progress;
      
      if (progress < 100) {
          progressInterval = requestAnimationFrame(updateProgress);
      }
  }
  
  progressInterval = requestAnimationFrame(updateProgress);
}

// 暫停進度條
function pauseProgressBar() {
  cancelAnimationFrame(progressInterval);
  // 當前進度已存儲在currentProgress變量中
}

// 恢復進度條
function resumeProgressBar() {
  if (!progressBar) return;
  
  cancelAnimationFrame(progressInterval);
  
  const remainingProgress = 100 - currentProgress;
  const remainingTime = (autoplayDuration * remainingProgress) / 100;
  
  const startTime = performance.now();
  
  function updateProgress(currentTime) {
      const elapsedTime = currentTime - startTime;
      const additionalProgress = Math.min(remainingProgress, (elapsedTime / remainingTime) * remainingProgress);
      const totalProgress = currentProgress + additionalProgress;
      
      progressBar.style.width = `${totalProgress}%`;
      currentProgress = totalProgress;
      
      if (totalProgress < 100) {
          progressInterval = requestAnimationFrame(updateProgress);
      }
  }
  
  progressInterval = requestAnimationFrame(updateProgress);
}

// 重置進度條
function resetProgressBar() {
  cancelAnimationFrame(progressInterval);
  startProgressBar();
}

// 初始化觸摸事件
function initTouchEvents() {
  const carousel = document.querySelector('.member-carousel');
  if (!carousel) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseAutoplay();
  }, false);
  
  carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      resumeAutoplay();
  }, false);
  
  function handleSwipe() {
      if (isAnimating) return;
      
      const swipeThreshold = 50; // 最小滑動距離
      
      if (touchEndX < touchStartX - swipeThreshold) {
          // 向左滑動，顯示下一個
          showNextItem();
          resetAutoplay();
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
          // 向右滑動，顯示上一個
          showPrevItem();
          resetAutoplay();
      }
  }
}

// 添加鍵盤導航支持
document.addEventListener('keydown', (e) => {
  if (isAnimating) return;
  
  if (e.key === 'ArrowLeft') {
      showPrevItem();
      resetAutoplay();
  } else if (e.key === 'ArrowRight') {
      showNextItem();
      resetAutoplay();
  }
});

// 添加視窗大小變化事件處理
window.addEventListener('resize', () => {
  // 調整輪播高度或其他響應式元素
  adjustCarouselHeight();
});

// 調整輪播高度
function adjustCarouselHeight() {
  const carousel = document.querySelector('.member-carousel');
  if (!carousel) return;
  
  const windowWidth = window.innerWidth;
  
  if (windowWidth <= 576) {
      carousel.style.height = '800px';
  } else if (windowWidth <= 768) {
      carousel.style.height = '750px';
  } else if (windowWidth <= 992) {
      carousel.style.height = '700px';
  } else {
      carousel.style.height = '500px';
  }
}

// 初始調整輪播高度
adjustCarouselHeight();

// 為成員卡片添加滾動動畫
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
      }
  });
}, { threshold: 0.2 });

memberCards.forEach(card => {
  observer.observe(card);
});

// 添加圖片懸停效果
memberCards.forEach(card => {
  const image = card.querySelector('.member-image img');
  if (image) {
      card.addEventListener('mouseenter', () => {
          image.style.transform = 'scale(1.08)';
      });
      
      card.addEventListener('mouseleave', () => {
          image.style.transform = '';
      });
  }
});

// 在頁面加載時執行一次移除引號操作
window.addEventListener('load', function() {
  removeQuotationMarks();
});

// 添加全局樣式
const styleElement = document.createElement('style');
styleElement.textContent = `
  /* 按鈕點擊時的額外閃動效果 */
  @keyframes buttonScale {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
  }
  
  /* 確保動畫可以正常運行 */
  .member-filters li {
      transform-origin: center center;
  }
  
  /* 點擊時的縮放效果 */
  .member-filters li.clicking {
      animation: buttonScale 0.3s ease-out;
  }
  
  /* 活動狀態下的內光效果 */
  .member-filters li.filter-active .tab-icon::after {
      opacity: 0.7;
      animation: pulseLight 2s infinite;
  }
  
  /* 內光脈動效果 */
  @keyframes pulseLight {
      0% { opacity: 0.3; }
      50% { opacity: 0.7; }
      100% { opacity: 0.3; }
  }
  
  /* 3D 懸停效果 */
  .member-filters li:hover {
      transform: translateY(-3px) perspective(500px) rotateX(5deg);
  }
`;
document.head.appendChild(styleElement);
});

      
