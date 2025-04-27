/**
 * 學術發表區塊 - 超炫酷圖示動畫效果
 */
document.addEventListener('DOMContentLoaded', function() {
    // 獲取所有分類按鈕
    const filterButtons = document.querySelectorAll('.portfolio-filters li');
    
    // 創建按鈕容器包裝
    const filterList = document.querySelector('.portfolio-filters');
    if (filterList && !document.querySelector('.portfolio-filters-wrapper')) {
      // 獲取原始父元素
      const originalParent = filterList.parentNode;
      
      // 創建新的外層包裝容器
      const newWrapper = document.createElement('div');
      newWrapper.className = 'portfolio-filters-wrapper';
      
      // 創建新的內層容器
      const newContainer = document.createElement('div');
      newContainer.className = 'portfolio-filters-container';
      
      // 構建新的結構
      originalParent.insertBefore(newWrapper, filterList);
      newWrapper.appendChild(newContainer);
      newContainer.appendChild(filterList);
    }
    
    // 重構按鈕，添加圖標
    filterButtons.forEach(button => {
      // 檢查是否已經重構過
      if (!button.querySelector('.tab-icon')) {
        // 獲取按鈕文本
        const buttonText = button.textContent.trim();
        
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
        const icon = document.createElement('i');
        
        if (filterValue === '*' || buttonText.toLowerCase() === 'all') {
          icon.className = 'bi bi-grid-3x3-gap';
        } else if (filterValue === '.filter-碩博士生' || buttonText.includes('碩博士')) {
          icon.className = 'bi bi-mortarboard-fill';
        } else if (filterValue === '.filter-product' || buttonText.toLowerCase().includes('product')) {
          icon.className = 'bi bi-box-seam';
        } else if (filterValue === '.filter-branding' || buttonText.toLowerCase().includes('branding')) {
          icon.className = 'bi bi-badge-ad';
        } else if (filterValue === '.filter-books' || buttonText.toLowerCase().includes('books')) {
          icon.className = 'bi bi-book';
        } else if (buttonText.toLowerCase().includes('app')) {
          icon.className = 'bi bi-phone';
        } else {
          icon.className = 'bi bi-journal-text';
        }
        
        // 將圖標添加到容器
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
        });
        
        // 添加懸停事件，增強圖標動畫
        button.addEventListener('mouseenter', function() {
          // 添加圖標發光效果
          const icon = this.querySelector('.tab-icon i');
          icon.style.animation = 'iconGlow 1.5s ease-in-out infinite';
          
          // 創建微粒子效果
          createMiniParticles(this);
        });
        
        button.addEventListener('mouseleave', function() {
          // 移除圖標發光效果
          const icon = this.querySelector('.tab-icon i');
          icon.style.animation = '';
          
          // 如果是活動狀態，恢復浮動動畫
          if (this.classList.contains('filter-active')) {
            icon.style.animation = 'iconWave 2s ease-in-out infinite';
          }
        });
      }
    });
    
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
    
    // 為所有活動按鈕添加初始動畫
    setTimeout(() => {
      document.querySelectorAll('.portfolio-filters li.filter-active').forEach(button => {
        const icon = button.querySelector('.tab-icon i');
        if (icon) {
          icon.style.animation = 'iconWave 2s ease-in-out infinite';
        }
      });
    }, 500);
    
    // 確保 Isotope 布局正確初始化 (如果存在)
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.isotope !== 'undefined') {
      jQuery(window).on('load', function() {
        // 等待所有圖片加載完成
        var portfolioIsotope = jQuery('.isotope-container').isotope({
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });
        
        // 綁定過濾事件
        jQuery('.portfolio-filters li').on('click', function() {
          // 添加閃動效果
          const buttons = document.querySelectorAll('.portfolio-filters li');
          buttons.forEach(btn => btn.style.pointerEvents = 'none');
          
          // 執行過濾
          portfolioIsotope.isotope({
            filter: jQuery(this).data('filter')
          });
          
          // 過濾動畫結束後恢復點擊
          setTimeout(() => {
            buttons.forEach(btn => btn.style.pointerEvents = 'auto');
          }, 500);
        });
        
        // 設置默認選中第一個按鈕
        if (jQuery('.portfolio-filters li.filter-active').length === 0) {
          jQuery('.portfolio-filters li:first-child').addClass('filter-active');
        }
      });
    }
    
    // 為已加載的項目添加動畫效果
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // 檢查是否支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 添加動畫類
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, 100);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      portfolioItems.forEach(item => {
        // 添加初始樣式
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        
        // 觀察元素
        observer.observe(item);
      });
    } else {
      // 不支持 IntersectionObserver 的情況下，直接顯示所有項目
      portfolioItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    }
    
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
    .portfolio-filters li {
      transform-origin: center center;
    }
    
    /* 點擊時的縮放效果 */
    .portfolio-filters li.clicking {
      animation: buttonScale 0.3s ease-out;
    }
    
    /* 圖標發光效果 */
    @keyframes iconGlow {
      0% { filter: drop-shadow(0 0 2px rgba(106, 17, 203, 0.3)); }
      50% { filter: drop-shadow(0 0 8px rgba(106, 17, 203, 0.6)); }
      100% { filter: drop-shadow(0 0 2px rgba(106, 17, 203, 0.3)); }
    }
    
    /* 粒子飄浮效果 */
    @keyframes particleFloat {
      0% { transform: translateY(0) translateX(0); opacity: 1; }
      100% { transform: translateY(-20px) translateX(10px); opacity: 0; }
    }
    
    /* 圖標容器內光效果 */
    .portfolio-filters li .tab-icon::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
      opacity: 0;
      transition: all 0.5s ease;
      mix-blend-mode: overlay;
      z-index: 1;
    }
    
    /* 懸停時顯示內光效果 */
    .portfolio-filters li:hover .tab-icon::after {
      opacity: 0.5;
    }
    
    /* 活動狀態下的內光效果 */
    .portfolio-filters li.filter-active .tab-icon::after {
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
    .portfolio-filters li:hover {
      transform: translateY(-3px) perspective(500px) rotateX(5deg);
    }
  `;
  document.head.appendChild(styleElement);
  
  // 為活動按鈕添加初始粒子效果
  setTimeout(() => {
    document.querySelectorAll('.portfolio-filters li.filter-active').forEach(button => {
      createMiniParticles(button);
    });
  }, 1000);
});

  