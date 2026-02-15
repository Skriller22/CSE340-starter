// Extended color map using CSS named colors + custom colors
const colorMap = {
  // Standard colors
  'Red': 'red',
  'Blue': 'blue',
  'Black': 'black',
  'White': 'white',
  'Silver': 'silver',
  'Green': 'green',
  'Yellow': 'yellow',
  'Orange': 'orange',
  'Purple': 'purple',
  'Brown': 'brown',
  'Gray': 'gray',
  'Beige': 'beige',
  'Gold': 'gold',
  'Maroon': 'maroon',
  'Crimson': 'crimson',
  'Scarlet': 'scarlet',
  'Navy': 'navy',
  'Teal': 'teal',
  'Turquoise': 'turquoise',
  'Cyan': 'cyan',
  'Aqua': 'aqua',
  'Lime': 'lime',
  'Olive': 'olive',
  'Salmon': 'salmon',
  'Coral': 'coral',
  'Tomato': 'tomato',
  'Khaki': 'khaki',
  'Tan': 'tan',
  'Chocolate': 'chocolate',
  'Peru': 'peru',
  'Goldenrod': 'goldenrod',
  'Sienna': 'sienna',
  'Indigo': 'indigo',
  'Violet': 'violet',
  'Plum': 'plum',
  'Orchid': 'orchid',
  'Magenta': 'magenta',
  'Fuchsia': 'fuchsia',
  'Lavender': 'lavender',
  'Pink': 'pink',
  'LightGray': 'lightgray',
  'DarkGray': 'darkgray',
  'LightBlue': 'lightblue',
  'DarkBlue': 'darkblue',
  'LightGreen': 'lightgreen',
  'DarkGreen': 'darkgreen',
  'RosyBrown': 'rosybrown',
  'SteelBlue': 'steelblue',
  'SlateBlue': 'slateblue',
  'MediumPurple': 'mediumpurple',
  'DodgerBlue': 'dodgerblue',
  'DeepSkyBlue': 'deepskyblue',
};

document.addEventListener('DOMContentLoaded', function() {
  // Handle detail page color swatch
  const detailInfo = document.getElementById('detail-info');
  
  if (detailInfo) {
    const listItems = detailInfo.querySelectorAll('ul li');
    
    listItems.forEach(item => {
      if (item.textContent.includes('Color:')) {
        const colorMatch = item.textContent.match(/Color:\s*(.+)/);
        if (colorMatch) {
          const vehicleColor = colorMatch[1].trim();
          const bgColor = colorMap[vehicleColor] || vehicleColor || '#e0e0e0';
          
          // Create a swatch element
          const swatch = document.createElement('span');
          swatch.classList.add('color-swatch');
          swatch.style.backgroundColor = bgColor;
          swatch.title = vehicleColor;
          
          item.insertBefore(swatch, item.firstChild);
        }
      }
    });
  }

  // Handle custom order card color swatches
  const colorSwatches = document.querySelectorAll('[data-color-swatch]');
  
  colorSwatches.forEach(swatch => {
    const colorName = swatch.getAttribute('data-color-swatch');
    const bgColor = colorMap[colorName] || colorName || '#e0e0e0';
    swatch.style.backgroundColor = bgColor;
    swatch.title = colorName;
  });

  // Handle color picker input on custom order form
  const colorInput = document.getElementById('order_color');
  const colorTextDisplay = document.getElementById('order_color_text');

  if (colorInput && colorTextDisplay) {
    // Update the text display when color changes
    function updateColorDisplay() {
      const hexColor = colorInput.value.toUpperCase();
      colorTextDisplay.value = hexColor;
      // Set background color to match the selected color
      colorTextDisplay.style.backgroundColor = hexColor;
      // Optional: adjust text color for readability
      colorTextDisplay.style.color = isLight(hexColor) ? '#000' : '#fff';
    }
    
    // Initial display
    updateColorDisplay();
    
    // Update on change
    colorInput.addEventListener('change', updateColorDisplay);
    colorInput.addEventListener('input', updateColorDisplay);
  }

  // Helper function to determine if a color is light or dark
  function isLight(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }
});