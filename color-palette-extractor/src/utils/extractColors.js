// Color extraction using median cut algorithm

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function getContrastColor(r, g, b) {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function getSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function getPixels(imageData) {
  const pixels = [];
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Skip only extreme values (pure black/white)
    const brightness = (r + g + b) / 3;
    if (brightness < 5 || brightness > 250) continue;

    const saturation = getSaturation(r, g, b);

    pixels.push([r, g, b, saturation]);
  }

  return pixels;
}

function getColorRange(pixels, channel) {
  let min = 255;
  let max = 0;

  for (const pixel of pixels) {
    if (pixel[channel] < min) min = pixel[channel];
    if (pixel[channel] > max) max = pixel[channel];
  }

  return max - min;
}

function medianCut(pixels, depth) {
  if (depth === 0 || pixels.length === 0) {
    if (pixels.length === 0) return [];

    // Calculate average color and saturation
    let r = 0, g = 0, b = 0, sat = 0;
    for (const pixel of pixels) {
      r += pixel[0];
      g += pixel[1];
      b += pixel[2];
      sat += pixel[3] || 0;
    }

    const avgR = Math.round(r / pixels.length);
    const avgG = Math.round(g / pixels.length);
    const avgB = Math.round(b / pixels.length);
    const avgSat = sat / pixels.length;

    return [{
      r: avgR,
      g: avgG,
      b: avgB,
      saturation: avgSat,
      count: pixels.length
    }];
  }

  // Find channel with greatest range
  const rRange = getColorRange(pixels, 0);
  const gRange = getColorRange(pixels, 1);
  const bRange = getColorRange(pixels, 2);

  let channel;
  if (rRange >= gRange && rRange >= bRange) {
    channel = 0;
  } else if (gRange >= rRange && gRange >= bRange) {
    channel = 1;
  } else {
    channel = 2;
  }

  // Sort by that channel
  pixels.sort((a, b) => a[channel] - b[channel]);

  // Split at median
  const mid = Math.floor(pixels.length / 2);

  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1)
  ];
}

export async function extractColors(imageUrl, colorCount = 6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Scale down for performance (larger = more accurate colors)
      const maxSize = 250;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = getPixels(imageData);

      if (pixels.length === 0) {
        reject(new Error('No valid pixels found in image'));
        return;
      }

      // Use median cut to get colors
      // Use higher depth to capture more color variations, then filter down
      const depth = Math.ceil(Math.log2(colorCount)) + 2;
      let colors = medianCut(pixels, depth);

      // Sort by a combination of count and saturation (vibrant colors get priority)
      colors.sort((a, b) => {
        // Weight: saturation matters more for vibrant color detection
        const scoreA = a.count * (1 + a.saturation * 2);
        const scoreB = b.count * (1 + b.saturation * 2);
        return scoreB - scoreA;
      });

      // Take only requested number of colors
      colors = colors.slice(0, colorCount);

      // Add hex, hsl, and contrast color
      const result = colors.map(color => {
        const hex = rgbToHex(color.r, color.g, color.b);
        const hsl = rgbToHsl(color.r, color.g, color.b);
        const contrast = getContrastColor(color.r, color.g, color.b);

        return {
          r: color.r,
          g: color.g,
          b: color.b,
          hex,
          hsl,
          contrast,
          rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
          hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
        };
      });

      resolve(result);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}
