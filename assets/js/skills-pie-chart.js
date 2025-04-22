document.addEventListener('DOMContentLoaded', function() {
  // 技能數據（總計100%）
  const skills = [
    { name: '水利工程與沖刷監測', percentage: 23, color: '#4361ee', icon: 'bi bi-water' },
    { name: '大地工程與樁基礎分析', percentage: 22, color: '#3a0ca3', icon: 'bi bi-geo-alt' },
    { name: '感測器開發與訊號分析', percentage: 17, color: '#7209b7', icon: 'bi bi-cpu' },
    { name: 'CFD數值模擬與應用', percentage: 15, color: '#f72585', icon: 'bi bi-grid-3x3' },
    { name: '人工智慧與機器學習', percentage: 14, color: '#4cc9f0', icon: 'bi bi-robot' },
    { name: '災害風險評估與管理', percentage: 9, color: '#4895ef', icon: 'bi bi-shield-check' }
  ];
  
  // 獲取圓餅圖容器
  const pieChart = document.getElementById('skills-pie-chart');
  const pieCenter = document.querySelector('.pie-center-content');
  
  // 初始化中心內容
  pieCenter.innerHTML = `
    <h4>專業技能</h4>
    <p>點擊查看詳情</p>
  `;
  
  // 創建SVG元素
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  
  // 繪製圓餅圖
  let startAngle = 0;
  skills.forEach((skill, index) => {
    // 計算角度
    const angle = (skill.percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    // 創建扇區路徑
    const path = document.createElementNS(svgNS, "path");
    const x1 = 50 + 48 * Math.cos(startAngle * Math.PI / 180);
    const y1 = 50 + 48 * Math.sin(startAngle * Math.PI / 180);
    const x2 = 50 + 48 * Math.cos(endAngle * Math.PI / 180);
    const y2 = 50 + 48 * Math.sin(endAngle * Math.PI / 180);
    
    // 大圓弧標誌（角度>180度時為1，否則為0）
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // 定義路徑
    const d = `
      M 50 50
      L ${x1} ${y1}
      A 48 48 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
    
    path.setAttribute("d", d);
    path.setAttribute("fill", skill.color);
    path.setAttribute("data-skill-index", index);
    path.classList.add("skill-sector");
    
    // 添加平滑的過渡效果
    path.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    
    // 添加懸停效果
    path.addEventListener('mouseover', function() {
      this.style.transform = "scale(1.03) translateY(-2px)";
      this.style.filter = "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))";
      updateCenterContent(skill);
    });
    
    path.addEventListener('mouseout', function() {
      this.style.transform = "scale(1) translateY(0)";
      this.style.filter = "brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))";
      resetCenterContent();
    });
    
    // 點擊效果
    path.addEventListener('click', function() {
      // 高亮選中的扇區
      document.querySelectorAll('.skill-sector').forEach(sector => {
        sector.style.filter = "brightness(0.7) drop-shadow(0 0 0 rgba(0,0,0,0))";
        sector.style.transform = "scale(1) translateY(0)";
      });
      this.style.filter = "brightness(1.2) drop-shadow(0 6px 12px rgba(0,0,0,0.15))";
      this.style.transform = "scale(1.05) translateY(-3px)";
      
      updateCenterContent(skill, true);
    });
    
    svg.appendChild(path);
    
    // 添加圖示到扇區
    // 計算圖示位置（在扇區中間位置）
    const iconAngle = startAngle + (angle / 2);
    const iconRadius = 32; // 圖示距離中心的距離
    const iconX = 50 + iconRadius * Math.cos(iconAngle * Math.PI / 180);
    const iconY = 50 + iconRadius * Math.sin(iconAngle * Math.PI / 180);
    
    // 創建外部圖示容器（HTML元素）
    const iconContainer = document.createElement('div');
    iconContainer.className = 'sector-icon';
    iconContainer.style.position = 'absolute';
    iconContainer.style.left = `${iconX}%`;
    iconContainer.style.top = `${iconY}%`;
    iconContainer.style.transform = 'translate(-50%, -50%)';
    iconContainer.style.color = '#ffffff';
    iconContainer.style.fontSize = '1.5rem'; // 放大圖標尺寸
    iconContainer.style.zIndex = '2';
    iconContainer.style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
    iconContainer.style.opacity = '0.95';
    iconContainer.style.transition = 'all 0.3s ease';
    iconContainer.style.cursor = 'pointer'; // 添加指針樣式
    iconContainer.setAttribute('data-skill-index', index); // 添加索引屬性
    
    // 添加圖示
    const iconElement = document.createElement('i');
    iconElement.className = skill.icon;
    iconContainer.appendChild(iconElement);
    
    // 為圖標添加事件監聽器
    iconContainer.addEventListener('mouseover', function() {
      this.style.fontSize = '1.7rem';
      this.style.textShadow = '0 2px 5px rgba(0,0,0,0.5)';
      
      const index = this.getAttribute('data-skill-index');
      const sector = document.querySelector(`.skill-sector[data-skill-index="${index}"]`);
      if (sector) {
        sector.style.transform = "scale(1.03) translateY(-2px)";
        sector.style.filter = "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))";
      }
      
      updateCenterContent(skills[index]);
    });
    
    iconContainer.addEventListener('mouseout', function() {
      this.style.fontSize = '1.5rem';
      this.style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
      
      const index = this.getAttribute('data-skill-index');
      const sector = document.querySelector(`.skill-sector[data-skill-index="${index}"]`);
      if (sector) {
        sector.style.transform = "scale(1) translateY(0)";
        sector.style.filter = "brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))";
      }
      
      resetCenterContent();
    });
    
    iconContainer.addEventListener('click', function() {
      const index = this.getAttribute('data-skill-index');
      
      // 高亮選中的扇區
      document.querySelectorAll('.skill-sector').forEach(sector => {
        sector.style.filter = "brightness(0.7) drop-shadow(0 0 0 rgba(0,0,0,0))";
        sector.style.transform = "scale(1) translateY(0)";
      });
      
      // 恢復所有圖標大小
      document.querySelectorAll('.sector-icon').forEach(icon => {
        icon.style.fontSize = '1.5rem';
        icon.style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
      });
      
      // 高亮選中的扇區和圖標
      const selectedSector = document.querySelector(`.skill-sector[data-skill-index="${index}"]`);
      if (selectedSector) {
        selectedSector.style.filter = "brightness(1.2) drop-shadow(0 6px 12px rgba(0,0,0,0.15))";
        selectedSector.style.transform = "scale(1.05) translateY(-3px)";
      }
      
      this.style.fontSize = '1.8rem';
      this.style.textShadow = '0 2px 6px rgba(0,0,0,0.6)';
      
      updateCenterContent(skills[index], true);
    });
    
    // 將圖示添加到圓餅圖容器
    pieChart.appendChild(iconContainer);
    
    // 更新起始角度
    startAngle = endAngle;
  });
  
  // 將SVG添加到圓餅圖容器
  pieChart.appendChild(svg);
  
  // 更新中心內容的函數 - 修改以防止文字溢出
  function updateCenterContent(skill, isClicked = false) {
    // 計算名稱的字符數，決定字體大小
    const nameLength = skill.name.length;
    let fontSize = '16px'; // 默認字體大小
    
    if (nameLength > 10) {
      fontSize = '14px';
    }
    
    if (nameLength > 15) {
      fontSize = '12px';
    }
    
    // 使用更安全的HTML結構和樣式
    pieCenter.innerHTML = `
      <i class="${skill.icon} mb-2" style="font-size: 1.8rem; color: ${skill.color};"></i>
      <h5 class="mb-0" style="font-size: ${fontSize}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${skill.name}</h5>
      <p class="mb-0 fw-bold">${skill.percentage}%</p>
    `;
    
    // 確保文字不會溢出
    const h5Element = pieCenter.querySelector('h5');
    if (h5Element) {
      // 檢查文字是否溢出
      if (h5Element.scrollWidth > h5Element.clientWidth) {
        h5Element.title = skill.name; // 添加title屬性，用於懸停顯示完整文字
      }
    }
    
    if (isClicked) {
      pieCenter.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      // 不要改變原本的transform屬性，因為它包含translate(-50%, -50%)
      setTimeout(() => {
        // 動畫結束後恢復原始大小，但保持居中定位
      }, 300);
    }
  }
  
  // 重置中心內容
  function resetCenterContent() {
    pieCenter.innerHTML = `
      <h4>專業技能</h4>
      <p>點擊查看詳情</p>
    `;
  }
  
  // 圖例相關代碼已被移除
});
