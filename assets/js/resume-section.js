/**
 * 學經歷與榮譽事蹟區塊 - 現代酷炫設計
 */
document.addEventListener('DOMContentLoaded', function() {
    // 標籤切換功能
    const resumeTabs = document.querySelectorAll('.resume-tab');
    const resumeContents = document.querySelectorAll('.resume-content');
    
    resumeTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // 移除所有標籤的活動狀態
        resumeTabs.forEach(t => t.classList.remove('active'));
        
        // 添加當前標籤的活動狀態
        this.classList.add('active');
        
        // 獲取目標內容ID
        const targetId = this.getAttribute('data-tab') + '-content';
        
        // 隱藏所有內容
        resumeContents.forEach(content => {
          content.classList.remove('active');
        });
        
        // 顯示目標內容
        document.getElementById(targetId).classList.add('active');
        
        // 添加點擊波紋效果
        createRippleEffect(event, this);
      });
    });
    
    // 波紋效果函數
    function createRippleEffect(event, element) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      
      // 添加CSS
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      
      // 添加關鍵幀動畫
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
        document.head.removeChild(style);
      }, 600);
    }
    
    // 為時間線項目添加滾動動畫
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
      // 添加初始樣式
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'all 0.5s ease';
      
      // 添加動畫類
      item.classList.add('timeline-animate');
      
      // 觀察元素
      observer.observe(item);
    });
    
    // 自定義動畫類
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .timeline-animate.animate {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(255, 255, 255, 0.3);
        }
      </style>
    `);
  });
  