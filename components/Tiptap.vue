<template>
  <div>
    <div v-if="editor" class="editor-menu">
      <v-btn icon @click="editor.chain().focus().undo().run()"><v-icon>undo</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().redo().run()"><v-icon>redo</v-icon></v-btn>
      <v-btn icon :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()"><v-icon>format_bold</v-icon></v-btn>
      <v-btn icon :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()"><v-icon>format_italic</v-icon></v-btn>
      <v-btn icon :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()"><v-icon>format_strikethrough</v-icon></v-btn>
      <v-btn icon :class="{ 'is-active': editor.isActive('unsetAllMarks') }" @click="editor.chain().focus().unsetAllMarks().run()"><v-icon>format_clear</v-icon></v-btn>
      <v-btn icon :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()"><v-icon>format_list_bulleted</v-icon></v-btn>
      <v-btn icon :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()"><v-icon>format_list_numbered</v-icon></v-btn>
      <v-btn icon @click="editor.chain().focus().setHorizontalRule().run()"><v-icon>horizontal_rule</v-icon></v-btn>
    </div>
    <editor-content :editor="editor" class="editor-edit" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      editor: null,
    }
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) {
        return
      }
      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      },
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
.editor-menu {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
}
</style>
