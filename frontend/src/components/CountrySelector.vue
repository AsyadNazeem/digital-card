<template>
  <div class="country-dropdown-wrapper" :class="{ 'dark-mode': isDarkMode }" ref="dropdownRef">

    <!-- Trigger -->
    <div class="country-trigger" @click="toggleDropdown">
      <span class="selected-country">
        {{ selectedCountry?.flag }} {{ selectedCountry?.name || "Select Country" }}
      </span>

      <svg
          class="dropdown-arrow"
          :class="{ rotate: isDropdownOpen }"
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>

    <!-- Dropdown -->
    <transition name="dropdown-slide">
      <div v-if="isDropdownOpen" class="country-dropdown-menu" @click.stop>

        <!-- Search -->
        <div class="search-box">
          <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search country..."
          />
        </div>

        <!-- List -->
        <div class="country-list">
          <div
              v-for="country in filteredCountries"
              :key="country.code"
              class="country-item"
              :class="{ active: country.code === modelValue }"
              @click="selectCountry(country)"
          >
            <span class="country-flag">{{ country.flag }}</span>
            <span class="country-name">{{ country.name }}</span>
          </div>

          <div v-if="filteredCountries.length === 0" class="no-results">
            No countries found
          </div>
        </div>

      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, inject } from "vue";
import countriesRaw from "../assets/complete_country_list.json";

// Inject dark mode state
const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  modelValue: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue"]);

const dropdownRef = ref(null);
const searchInputRef = ref(null);
const isDropdownOpen = ref(false);
const searchQuery = ref("");

// Prepare countries list
const allCountries = ref(
    countriesRaw.map(c => ({
      code: c.code,          // <-- Saved to DB (e.g., "SL")
      name: c.name,          // Display name
      flag: c.flag           // Emoji flag
    }))
);

// Selected country details
const selectedCountry = computed(() =>
    allCountries.value.find(c => c.code === props.modelValue)
);

// Search
const filteredCountries = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return allCountries.value;
  return allCountries.value.filter(c =>
      c.name.toLowerCase().includes(q)
  );
});

// Toggle dropdown
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) nextTick(() => searchInputRef.value.focus());
}

// Select
function selectCountry(country) {
  emit("update:modelValue", country.code);
  isDropdownOpen.value = false;
  searchQuery.value = "";
}

// Close when clicking outside
function handleOutsideClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleOutsideClick));
onUnmounted(() => document.removeEventListener("click", handleOutsideClick));
</script>

<style scoped>
.country-dropdown-wrapper {
  position: relative;
  width: 100%;
}

.country-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.country-trigger:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.selected-country {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
}

.dropdown-arrow {
  transition: 0.2s;
  color: #64748b;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.country-dropdown-menu {
  position: absolute;
  width: 100%;
  background: white;
  top: 45px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.search-box {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

.country-list {
  max-height: 250px;
  overflow-y: auto;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.country-item:last-child {
  border-bottom: none;
}

.country-item:hover {
  background: #f3f4f6;
}

.country-item.active {
  background: #eef2ff;
  border-left: 3px solid #5c4033;
}

.country-flag {
  font-size: 20px;
}

.country-name {
  color: #0f172a;
  font-size: 14px;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #6b7280;
}

/* Dark Mode Styles */
.dark-mode .country-trigger {
  background: #0f0d1a;
  border-color: #2d2640;
}

.dark-mode .country-trigger:hover {
  border-color: #3d3555;
  background: #1a1626;
}

.dark-mode .selected-country {
  color: #e5e7eb;
}

.dark-mode .dropdown-arrow {
  color: #9ca3af;
}

.dark-mode .country-dropdown-menu {
  background: #0f0d1a;
  border-color: #2d2640;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.dark-mode .search-box {
  border-bottom-color: #2d2640;
}

.dark-mode .search-input {
  background: #1a1626;
  border-color: #2d2640;
  color: #e5e7eb;
}

.dark-mode .search-input::placeholder {
  color: #6b7280;
}

.dark-mode .search-input:focus {
  border-color: #D4A574;
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}

.dark-mode .country-item {
  border-bottom-color: #2d2640;
}

.dark-mode .country-item:hover {
  background: #2d2640;
}

.dark-mode .country-item.active {
  background: #2d2640;
  border-left-color: #D4A574;
}

.dark-mode .country-name {
  color: #e5e7eb;
}

.dark-mode .no-results {
  color: #6b7280;
}

/* Scrollbar styling */
.country-list::-webkit-scrollbar {
  width: 6px;
}

.country-list::-webkit-scrollbar-track {
  background: #f8fafc;
}

.country-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.country-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark-mode .country-list::-webkit-scrollbar-track {
  background: #1a1626;
}

.dark-mode .country-list::-webkit-scrollbar-thumb {
  background: #3d3555;
}

.dark-mode .country-list::-webkit-scrollbar-thumb:hover {
  background: #4b4563;
}

/* Dropdown transition */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.2s ease;
}

.dropdown-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
