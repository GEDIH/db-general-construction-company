/**
 * Image Optimizer Utility
 * Handles client-side image compression, resizing, and thumbnail generation
 */

const ImageOptimizer = {
  /**
   * Configuration for image optimization
   */
  config: {
    maxWidth: 1920,
    maxHeight: 1080,
    thumbnailWidth: 300,
    thumbnailHeight: 300,
    quality: 0.85,
    thumbnailQuality: 0.8,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },

  /**
   * Optimize an image file
   * @param {File} file - Image file to optimize
   * @param {object} options - Optional configuration overrides
   * @returns {Promise<object>} - Optimized image data with original and thumbnail
   */
  async optimizeImage(file, options = {}) {
    // Validate file
    if (!this.validateFile(file)) {
      throw new Error('Invalid file type or size');
    }

    const config = { ...this.config, ...options };

    try {
      // Read file as data URL
      const dataUrl = await this.readFileAsDataURL(file);

      // Load image
      const img = await this.loadImage(dataUrl);

      // Resize and compress main image
      const optimizedImage = await this.resizeAndCompress(
        img,
        config.maxWidth,
        config.maxHeight,
        config.quality
      );

      // Generate thumbnail
      const thumbnail = await this.resizeAndCompress(
        img,
        config.thumbnailWidth,
        config.thumbnailHeight,
        config.thumbnailQuality,
        true // crop to fit
      );

      return {
        original: {
          dataUrl: optimizedImage,
          width: Math.min(img.width, config.maxWidth),
          height: Math.min(img.height, config.maxHeight),
          size: this.getDataUrlSize(optimizedImage)
        },
        thumbnail: {
          dataUrl: thumbnail,
          width: config.thumbnailWidth,
          height: config.thumbnailHeight,
          size: this.getDataUrlSize(thumbnail)
        },
        metadata: {
          originalName: file.name,
          originalSize: file.size,
          originalWidth: img.width,
          originalHeight: img.height,
          mimeType: file.type,
          optimizedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  },

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {boolean} - True if valid
   */
  validateFile(file) {
    if (!file) {
      return false;
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${this.config.allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.config.maxFileSize / (1024 * 1024)}MB`);
    }

    return true;
  },

  /**
   * Read file as data URL
   * @param {File} file - File to read
   * @returns {Promise<string>} - Data URL
   */
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Load image from data URL
   * @param {string} dataUrl - Data URL
   * @returns {Promise<HTMLImageElement>} - Loaded image
   */
  loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  },

  /**
   * Resize and compress image
   * @param {HTMLImageElement} img - Image to resize
   * @param {number} maxWidth - Maximum width
   * @param {number} maxHeight - Maximum height
   * @param {number} quality - Compression quality (0-1)
   * @param {boolean} crop - Whether to crop to fit (for thumbnails)
   * @returns {Promise<string>} - Compressed image data URL
   */
  async resizeAndCompress(img, maxWidth, maxHeight, quality, crop = false) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = img.width;
    let height = img.height;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = width;
    let sourceHeight = height;

    if (crop) {
      // Crop to fit (for thumbnails)
      const aspectRatio = maxWidth / maxHeight;
      const imgAspectRatio = width / height;

      if (imgAspectRatio > aspectRatio) {
        // Image is wider, crop width
        sourceWidth = height * aspectRatio;
        sourceX = (width - sourceWidth) / 2;
      } else {
        // Image is taller, crop height
        sourceHeight = width / aspectRatio;
        sourceY = (height - sourceHeight) / 2;
      }

      canvas.width = maxWidth;
      canvas.height = maxHeight;
    } else {
      // Resize to fit (maintain aspect ratio)
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
    }

    // Draw image on canvas
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to data URL with compression
    return canvas.toDataURL('image/jpeg', quality);
  },

  /**
   * Get size of data URL in bytes
   * @param {string} dataUrl - Data URL
   * @returns {number} - Size in bytes
   */
  getDataUrlSize(dataUrl) {
    // Remove data URL prefix
    const base64 = dataUrl.split(',')[1];
    // Calculate size (base64 is ~33% larger than binary)
    return Math.floor((base64.length * 3) / 4);
  },

  /**
   * Optimize multiple images
   * @param {FileList|Array<File>} files - Files to optimize
   * @param {object} options - Optional configuration overrides
   * @param {function} progressCallback - Progress callback (current, total)
   * @returns {Promise<Array<object>>} - Array of optimized image data
   */
  async optimizeMultipleImages(files, options = {}, progressCallback = null) {
    const results = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      try {
        const result = await this.optimizeImage(fileArray[i], options);
        results.push(result);

        if (progressCallback) {
          progressCallback(i + 1, fileArray.length);
        }
      } catch (error) {
        console.error(`Failed to optimize ${fileArray[i].name}:`, error);
        results.push({
          error: error.message,
          file: fileArray[i].name
        });
      }
    }

    return results;
  },

  /**
   * Create file input handler with optimization
   * @param {HTMLInputElement} input - File input element
   * @param {function} callback - Callback function to receive optimized images
   * @param {object} options - Optional configuration overrides
   */
  setupFileInput(input, callback, options = {}) {
    if (!input || input.tagName !== 'INPUT' || input.type !== 'file') {
      throw new Error('Invalid file input element');
    }

    input.addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        return;
      }

      try {
        // Show loading indicator if available
        const loadingEl = document.getElementById('imageUploadLoading');
        if (loadingEl) {
          loadingEl.style.display = 'block';
        }

        const results = await this.optimizeMultipleImages(
          files,
          options,
          (current, total) => {
            // Update progress if element exists
            const progressEl = document.getElementById('imageUploadProgress');
            if (progressEl) {
              const percent = Math.round((current / total) * 100);
              progressEl.style.width = percent + '%';
              progressEl.textContent = `${current}/${total}`;
            }
          }
        );

        // Hide loading indicator
        if (loadingEl) {
          loadingEl.style.display = 'none';
        }

        // Call callback with results
        callback(results);
      } catch (error) {
        console.error('Image optimization error:', error);
        alert('Failed to optimize images: ' + error.message);
      }
    });
  },

  /**
   * Convert data URL to Blob
   * @param {string} dataUrl - Data URL
   * @returns {Blob} - Blob object
   */
  dataUrlToBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  },

  /**
   * Download optimized image
   * @param {string} dataUrl - Data URL
   * @param {string} filename - Filename for download
   */
  downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.ImageOptimizer = ImageOptimizer;
}
