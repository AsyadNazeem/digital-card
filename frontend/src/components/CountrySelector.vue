<template>
  <div class="country-dropdown-wrapper" ref="dropdownRef">

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
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import countriesRaw from "../assets/complete_country_list.json";

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
}

.selected-country {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-arrow {
  transition: 0.2s;
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
}

.country-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
}

.country-item:hover {
  background: #f3f4f6;
}

.country-item.active {
  background: #eef2ff;
}

.country-flag {
  font-size: 20px;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #6b7280;
}
</style>
