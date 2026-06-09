<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const model = defineModel()
</script>

<template>
  <QuillEditor
      v-model:content="model"
      contentType="html"
      theme="snow"
      :toolbar="[
      ['bold','italic','underline'],
      [{ header: [1,2,3,false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]"
      class="quill-editor"
      placeholder="Write a short description of your company…"
  />
</template>
