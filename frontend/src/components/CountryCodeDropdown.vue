<template>
  <div class="country-dropdown-wrapper" ref="dropdownRef">
    <div class="country-trigger" @click="toggleDropdown">
      <span class="selected-country">{{ selectedCountry?.name || '+94' }}</span>
      <svg
          class="dropdown-arrow"
          :class="{ rotate: isDropdownOpen }"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>

    <transition name="dropdown-slide">
      <div
          v-if="isDropdownOpen"
          class="country-dropdown-menu"
          @click.stop
      >
        <div class="search-box">
          <svg
              class="search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search country..."
          />
        </div>

        <div class="country-list">
          <div
              v-for="country in filteredCountries"
              :key="country.code + country.name"
              class="country-item"
              :class="{ active: country.code === modelValue }"
              @click="selectCountry(country)"
          >
            <span class="country-flag">{{ country.flag }}</span>
            <span class="country-name">{{ country.fullName }}</span>
            <span class="country-code">{{ country.code }}</span>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import countriesData from '../assets/country_code.json'

// Props
const props = defineProps({
  modelValue: { type: String, default: '+94' },
})
const emit = defineEmits(['update:modelValue'])

// Dropdown state
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)
const searchInputRef = ref(null)

// Prepare country data
const allCountries = ref(
    countriesData.map(country => ({
      flag: country.flag,
      name: `${country.flag} ${country.code}`,
      fullName: country.name,
      code: country.code,
      searchText: country.name.toLowerCase()
    }))
)

// Search filter
const normalize = str =>
    str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

const filteredCountries = computed(() => {
  const query = normalize(searchQuery.value.trim())
  if (!query) return allCountries.value
  return allCountries.value.filter(c =>
      [c.fullName, c.code].some(f => normalize(f).includes(query))
  )
})

// Selected country
const selectedCountry = computed(() =>
    allCountries.value.find(c => c.code === props.modelValue)
)

// Toggle dropdown
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) nextTick(() => searchInputRef.value?.focus())
  else searchQuery.value = ''
}

// Select and emit country
function selectCountry(country) {
  emit('update:modelValue', country.code)
  isDropdownOpen.value = false
  searchQuery.value = ''
}

// Close dropdown on outside click
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target))
    isDropdownOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>

/* Country Dropdown Styles */
.country-dropdown-wrapper {
  position: relative;
  flex-shrink: 0;
}

.country-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  user-select: none;
}

.country-trigger:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.selected-country {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
}

.dropdown-arrow {
  transition: transform 0.2s;
  color: #64748b;
  flex-shrink: 0;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.country-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 320px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.search-box {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.country-list {
  max-height: 280px;
  overflow-y: auto;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.country-item:last-child {
  border-bottom: none;
}

.country-item:hover {
  background: #f8fafc;
}

.country-item.active {
  background: #eef2ff;
  border-left: 3px solid #4f46e5;
}

.country-flag {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.country-name {
  flex: 1;
  font-size: 0.875rem;
  color: #0f172a;
}

.country-code {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  flex-shrink: 0;
}

.no-results {
  padding: 2rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.phone-number-input {
  flex: 1;
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

</style>
