<template>
  <div>
    <div v-if="editor">
      <v-btn icon @click="editor.chain().focus().undo().run()"><v-icon>undo</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().redo().run()"><v-icon>redo</v-icon></v-btn>

      <v-btn icon @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"><v-icon>format_bold</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }"><v-icon>format_italic</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }"><v-icon>format_strikethrough</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().unsetAllMarks().run()" :class="{ 'is-active': editor.isActive('unsetAllMarks') }"><v-icon>format_clear</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }"><v-icon>format_list_bulleted</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }"><v-icon>format_list_numbered</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().setHorizontalRule().run()"><v-icon>horizontal_rule</v-icon></v-btn>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },

  methods: {},

  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit, Color, TextStyle],
      content: '',
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
.is-active {
  color: #fff;
  background-color: #002f5f;
}
</style>
