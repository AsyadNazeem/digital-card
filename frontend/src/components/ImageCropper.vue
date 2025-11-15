<template>
  <transition name="modal">
    <div v-if="show" class="cropper-modal-overlay" @click.self="$emit('close')">
      <div class="cropper-modal-container" @click.stop>
        <!-- Header -->
        <div class="cropper-header">
          <h2 class="cropper-title">{{ title }}</h2>
          <button @click="$emit('close')" class="btn-close-cropper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Cropper Area -->
        <div class="cropper-body">
          <div class="cropper-wrapper">
            <Cropper
                ref="cropper"
                class="cropper"
                :src="imageSrc"
                :stencil-props="{
                aspectRatio: aspectRatio,
                movable: true,
                resizable: true,
              }"
                :canvas="{
                maxWidth: 1200,
                maxHeight: 1200,
              }"
                @change="onChange"
            />
          </div>

          <!-- Zoom Controls -->
          <div class="zoom-controls">
            <button @click="zoomOut" class="zoom-btn" title="Zoom Out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="8" y1="11" x2="14" y2="11"></line>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <input
                type="range"
                v-model="zoomLevel"
                @input="handleZoom"
                min="0"
                max="100"
                class="zoom-slider"
            />

            <button @click="zoomIn" class="zoom-btn" title="Zoom In">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <!-- Rotation Controls -->
          <div class="rotation-controls">
            <button @click="rotateLeft" class="rotate-btn" title="Rotate Left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"></path>
              </svg>
              Rotate Left
            </button>

            <button @click="rotateRight" class="rotate-btn" title="Rotate Right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
              </svg>
              Rotate Right
            </button>

            <button @click="flipHorizontal" class="rotate-btn" title="Flip Horizontal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3m8-18h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
                <line x1="12" y1="20" x2="12" y2="4"></line>
              </svg>
              Flip
            </button>

            <button @click="resetCrop" class="rotate-btn" title="Reset">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              Reset
            </button>
          </div>

          <!-- Preview Card -->
          <!-- Preview Card -->
          <div v-if="previewMode" class="preview-section">
            <h3 class="preview-title">Preview</h3>
            <div class="preview-card">
              <div class="preview-header">
                <!-- Logo as background when type is 'logo' -->
                <div class="preview-logo-bg" v-if="type === 'logo'">
                  <img :src="croppedImage" alt="Preview" class="preview-logo-bg-img" />
                </div>

                <!-- Photo as center circle when type is 'photo' -->
                <div class="preview-photo-circle" v-if="type === 'photo'">
                  <img :src="croppedImage" alt="Preview" class="preview-photo-circle-img" />
                </div>
              </div>
              <div class="preview-info">
                <p v-if="type === 'photo'">Contact Photo Preview</p>
                <p v-if="type === 'logo'">Company Logo Preview</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="cropper-footer">
          <button @click="togglePreview" class="btn-preview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {{ previewMode ? 'Hide Preview' : 'Show Preview' }}
          </button>

          <div class="footer-actions-right">
            <button @click="$emit('close')" class="btn-cancel">
              Cancel
            </button>
            <button @click="cropImage" class="btn-crop">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Apply & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  show: Boolean,
  imageSrc: String,
  type: {
    type: String,
    default: 'logo' // 'logo' or 'photo'
  },
  title: {
    type: String,
    default: 'Crop Image'
  }
});

const emit = defineEmits(['close', 'cropped']);

const cropper = ref(null);
const zoomLevel = ref(50);
const croppedImage = ref('');
const previewMode = ref(false);
const flipped = ref(false);

// Aspect ratio based on type
const aspectRatio = computed(() => {
  return props.type === 'photo' ? 1 : 1; // Square for both, but you can customize
});

// Zoom functions
const zoomIn = () => {
  if (zoomLevel.value < 100) {
    zoomLevel.value = Math.min(100, zoomLevel.value + 10);
    handleZoom();
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0) {
    zoomLevel.value = Math.max(0, zoomLevel.value - 10);
    handleZoom();
  }
};

const handleZoom = () => {
  if (cropper.value) {
    const zoomFactor = 1 + (zoomLevel.value / 50);
    cropper.value.zoom(zoomFactor);
  }
};

// Rotation functions
const rotateLeft = () => {
  if (cropper.value) {
    cropper.value.rotate(-90);
  }
};

const rotateRight = () => {
  if (cropper.value) {
    cropper.value.rotate(90);
  }
};

const flipHorizontal = () => {
  if (cropper.value) {
    cropper.value.flip(true, false);
    flipped.value = !flipped.value;
  }
};

const resetCrop = () => {
  if (cropper.value) {
    cropper.value.reset();
    zoomLevel.value = 50;
    flipped.value = false;
  }
};

// Handle crop change
const onChange = ({ canvas }) => {
  if (canvas && previewMode.value) {
    croppedImage.value = canvas.toDataURL();
  }
};

// Toggle preview
const togglePreview = () => {
  previewMode.value = !previewMode.value;
  if (previewMode.value && cropper.value) {
    const { canvas } = cropper.value.getResult();
    if (canvas) {
      croppedImage.value = canvas.toDataURL();
    }
  }
};

// Crop and emit
const cropImage = () => {
  if (cropper.value) {
    const { canvas } = cropper.value.getResult();
    if (canvas) {
      canvas.toBlob((blob) => {
        emit('cropped', blob);
        emit('close');
      }, 'image/jpeg', 0.95);
    }
  }
};

// Watch for image source changes
watch(() => props.imageSrc, () => {
  zoomLevel.value = 50;
  previewMode.value = false;
  flipped.value = false;
});
</script>

<style scoped>
.cropper-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
}

.cropper-modal-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  max-width: 900px;
  width: 100%;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.cropper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.cropper-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-close-cropper {
  background: #f1f5f9;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-cropper:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Body */
.cropper-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cropper-wrapper {
  width: 100%;
  height: 400px;
  background: #f8fafc;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.cropper {
  height: 100%;
}

/* Zoom Controls */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.zoom-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.zoom-btn:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
  transform: scale(1.05);
}

.zoom-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  transition: all 0.2s;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
}

.zoom-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

/* Rotation Controls */
.rotation-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.rotate-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.rotate-btn:hover {
  background: #f8fafc;
  border-color: #4f46e5;
  color: #4f46e5;
  transform: translateY(-1px);
}

/* Preview Section */
.preview-section {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.preview-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  max-width: 300px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-header {
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-photo {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.preview-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-logo {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.preview-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.preview-info {
  padding: 1rem;
  text-align: center;
}

.preview-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Footer */
.cropper-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  gap: 1rem;
}

.footer-actions-right {
  display: flex;
  gap: 0.75rem;
}

.btn-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-preview:hover {
  background: #eef2ff;
}

.btn-cancel {
  padding: 0.625rem 1.5rem;
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-crop {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-crop:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Logo as background */
.preview-logo-bg {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.preview-logo-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Photo as center circle */
.preview-photo-circle {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.preview-photo-circle-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Responsive */
@media (max-width: 768px) {
  .cropper-modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .cropper-body {
    padding: 1.5rem;
  }

  .cropper-wrapper {
    height: 300px;
  }

  .rotation-controls {
    justify-content: center;
  }

  .rotate-btn {
    flex: 1;
    min-width: calc(50% - 0.375rem);
    justify-content: center;
  }

  .cropper-footer {
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-actions-right {
    width: 100%;
  }

  .btn-preview,
  .btn-cancel,
  .btn-crop {
    flex: 1;
  }
}
</style>
