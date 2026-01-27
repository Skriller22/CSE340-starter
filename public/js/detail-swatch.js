document.addEventListener('DOMContentLoaded', function() {
  const detailInfo = document.getElementById('detail-info');
  
  if (detailInfo) {
    const listItems = detailInfo.querySelectorAll('ul li');
    
    listItems.forEach(item => {
      if (item.textContent.includes('Color:')) {
        const colorMatch = item.textContent.match(/Color:\s*(.+)/);
        if (colorMatch) {
          const vehicleColor = colorMatch[1].trim();
          
          const colorMap = {
            'Red': '#ff4444',
            'Blue': '#0066ff',
            'Black': '#000000',
            'White': '#cccccc',
            'Silver': '#c0c0c0',
            'Green': '#228B22',
            'Yellow': '#ffd700',
            'Orange': '#ff8c00',
            'Purple': '#800080',
            'Brown': '#8b4513',
            'Gray': '#808080',
            'Beige': '#f5f5dc',
            'Gold': '#ffd700',
            'Maroon': '#800000',
          };
          
          const bgColor = colorMap[vehicleColor] || '#e0e0e0';
          
          // Create a swatch element
          const swatch = document.createElement('span');
          swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = bgColor;
            swatch.title = vehicleColor;
          
          item.appendChild(swatch, item.firstChild);
        }
      }
    });
  }
});