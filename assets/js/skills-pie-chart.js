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
  
  // 清除現有的圖例（如果存在）
  const existingLegend = document.querySelector('.skills-legend');
  if (existingLegend) {
    existingLegend.remove();
  }
  
  // 創建技能圖例容器 - 使用更靈活的布局
  const legendContainer = document.createElement('div');
  legendContainer.className = 'skills-legend';
  legendContainer.style.display = 'grid';
  legendContainer.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 3列
  legendContainer.style.gridTemplateRows = 'repeat(2, auto)';   // 2行
  legendContainer.style.gap = '25px 30px'; // 增加行列間距
  legendContainer.style.marginTop = '40px';
  legendContainer.style.maxWidth = '1000px'; // 增加最大寬度
  legendContainer.style.marginLeft = 'auto';
  legendContainer.style.marginRight = 'auto';
  legendContainer.style.padding = '0 15px'; // 添加左右內邊距
  
  // 創建六個技能項目
  skills.forEach((skill, index) => {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.setAttribute('data-skill-index', index);
    
    // 添加平滑過渡效果
    skillItem.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    skillItem.style.display = 'flex';
    skillItem.style.alignItems = 'center'; // 恢復為居中對齊
    skillItem.style.padding = '10px 12px';
    skillItem.style.borderRadius = '8px';
    skillItem.style.cursor = 'pointer';
    // 移除外框和背景
    skillItem.style.backgroundColor = 'transparent';
    skillItem.style.border = 'none';
    skillItem.style.boxShadow = 'none';
    skillItem.style.position = 'relative';
    skillItem.style.width = '100%'; 
    skillItem.style.boxSizing = 'border-box';
    skillItem.style.minHeight = '50px';
    
    const skillColor = document.createElement('div');
    skillColor.className = 'skill-color';
    skillColor.style.width = '36px';
    skillColor.style.height = '36px';
    skillColor.style.borderRadius = '50%';
    skillColor.style.marginRight = '12px';
    skillColor.style.display = 'flex';
    skillColor.style.alignItems = 'center';
    skillColor.style.justifyContent = 'center';
    skillColor.style.color = 'white';
    skillColor.style.flexShrink = '0';
    skillColor.style.fontSize = '16px';
    skillColor.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
    skillColor.style.backgroundColor = skill.color;
    skillColor.style.transition = 'all 0.3s ease';
    
    // 添加圖標到顏色圓圈中
    const skillIcon = document.createElement('i');
    skillIcon.className = skill.icon;
    skillColor.appendChild(skillIcon);
    
    // 創建一個新的容器來包裝文字和百分比
    const skillTextContainer = document.createElement('div');
    skillTextContainer.style.flexGrow = '1';
    skillTextContainer.style.display = 'flex';
    skillTextContainer.style.flexDirection = 'column';
    skillTextContainer.style.minWidth = '0'; // 允許容器收縮
    
    const skillName = document.createElement('div');
    skillName.className = 'skill-name';
    skillName.style.fontWeight = '600';
    skillName.style.color = '#333';
    skillName.style.fontSize = '14px';
    skillName.style.transition = 'all 0.3s ease';
    skillName.style.lineHeight = '1.3';
    skillName.style.marginBottom = '4px';
    // 確保文字完整顯示
    skillName.style.whiteSpace = 'normal';
    skillName.style.wordBreak = 'break-word';
    skillName.style.width = '100%';
    skillName.textContent = skill.name;
    
    const skillPercentage = document.createElement('div');
    skillPercentage.className = 'skill-percentage';
    skillPercentage.style.fontWeight = '700';
    skillPercentage.style.color = '#4e73df';
    skillPercentage.style.fontSize = '16px';
    skillPercentage.style.transition = 'all 0.3s ease';
    skillPercentage.textContent = `${skill.percentage}%`;
    
    skillTextContainer.appendChild(skillName);
    skillTextContainer.appendChild(skillPercentage);
    
    skillItem.appendChild(skillColor);
    skillItem.appendChild(skillTextContainer);
    
    // 添加交互效果
    skillItem.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
      
      const index = this.getAttribute('data-skill-index');
      const sector = document.querySelector(`.skill-sector[data-skill-index="${index}"]`);
      if (sector) {
        sector.style.transform = "scale(1.03) translateY(-2px)";
        sector.style.filter = "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))";
      }
      
      // 高亮相應的扇區圖標
      const icons = document.querySelectorAll('.sector-icon');
      if (icons[index]) {
        icons[index].style.fontSize = '1.7rem';
        icons[index].style.textShadow = '0 2px 5px rgba(0,0,0,0.5)';
      }
      
      updateCenterContent(skills[index]);
    });
    
    skillItem.addEventListener('mouseout', function() {
      this.style.transform = 'translateY(0)';
      this.style.backgroundColor = 'transparent';
      this.style.boxShadow = 'none';
      
      const index = this.getAttribute('data-skill-index');
      const sector = document.querySelector(`.skill-sector[data-skill-index="${index}"]`);
      if (sector) {
        sector.style.transform = "scale(1) translateY(0)";
        sector.style.filter = "brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))";
      }
      
      // 恢復扇區圖標大小
      const icons = document.querySelectorAll('.sector-icon');
      if (icons[index]) {
        icons[index].style.fontSize = '1.5rem';
        icons[index].style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
      }
      
      resetCenterContent();
    });
    
    skillItem.addEventListener('click', function() {
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
      
      const icons = document.querySelectorAll('.sector-icon');
      if (icons[index]) {
        icons[index].style.fontSize = '1.8rem';
        icons[index].style.textShadow = '0 2px 6px rgba(0,0,0,0.6)';
      }
      
      updateCenterContent(skills[index], true);
    });
    
    legendContainer.appendChild(skillItem);
  });
  
  // 將圖例添加到圓餅圖容器之後
  // pieChart.parentNode.insertBefore(legendContainer, pieChart.nextSibling);*/
});
