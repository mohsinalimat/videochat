<template>
  <div class="richText">
    <input id="file-input" type="file" style="display: none;" accept="image/*" />
    <div class="richText__content">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
import "prosemirror-view/style/prosemirror.css";
import "./messageImage.styl";
import { Editor, EditorContent } from "@tiptap/vue-2";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Text from "@tiptap/extension-text";
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import axios from "axios";

const embedUploadFunction = (chatId, fileObj) => {
    const formData = new FormData();
    formData.append('embed_file_header', fileObj);
    return axios.post('/api/storage/'+chatId+'/embed', formData)
        .then((result) => {
            let url = result.data.relativeUrl; // Get url from response
            console.debug("got embed url", url);
            return url;
        })
}

export default {
  components: {
    EditorContent,
  },

  props: {
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      editor: null,
      html: "",
      imageFileInput: null,
    };
  },

  watch: {
    html: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value != "<p></p>") {
            this.$emit("input", value);
        }
      },
    },
    value(value) {
      const isSame = this.html === value;

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },
  computed: {
    chatId() {
      return this.$route.params.id
    },
  },
  methods: {
    updateHtml() {
      this.html = this.editor.getHTML();
    },
    addImage() {
      this.imageFileInput.click();
    },
  },
  mounted() {
    this.editor = new Editor({
      parseOptions: {
        preserveWhitespace: "full",
      },
      autofocus: true,
      enablePasteRules: false,
      injectCSS: false,
      enableInputRules: false,
      extensions: [
          Document,
          Paragraph,
          History,
          Placeholder.configure({
              placeholder: ({ node }) => {
                return this.$vuetify.lang.t('$vuetify.message_edit_placeholder')
              },
          }),
          Text,
          Image.configure({
              HTMLAttributes: {
                  class: 'image-custom-class',
              },
          }),
          Italic,
          Bold,
          Strike,
          Underline,
      ],
      content: this.value,
      onCreate: () => this.updateHtml(),
      onUpdate: () => this.updateHtml(),
      onSelectionUpdate: () => this.updateHtml(),
    });

    this.imageFileInput = document.getElementById('file-input');
    this.imageFileInput.onchange = e => {
      if (e.target.files.length) {
          const file = e.target.files[0];
          embedUploadFunction(this.chatId, file)
              .then(url => {
                  this.editor.chain().focus().setImage({ src: url }).run()
              })
      }
    }
  },

  beforeDestroy() {
    this.editor.destroy();
    this.imageFileInput = null;
  },
};
</script>
<style>
.richText {
  display: flex;
  flex-direction: column;
  color: #0d0d0d;
  background-color: #fff;
  border: 1px dashed #0D0D0D;
  height: 100%;
  overflow-y: auto;
}
.richText__header {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.25rem;
  border-bottom: 3px solid #0D0D0D;
}

.richText__content {
  padding: 6px 6px;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.richText__content p {
    margin-bottom: unset
}

.richText__footer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  border-top: 3px solid #0D0D0D;
  font-size: 12px;
  font-weight: 600;
  color: #0d0d0d;
  white-space: nowrap;
  padding: 0.25rem 0.75rem;
}

.richText__content :focus-visible {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #a9a9a9;
    pointer-events: none;
    height: 0;
}

.ProseMirror img {
    max-width: 100%;
    height: auto;
}

</style>