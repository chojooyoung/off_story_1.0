<template>
  <div class="editor">
    <h1 class="editor__title">{{ title }}</h1>
    <img v-if="postImgUrl" class="postImg" :src="postImgUrl" alt="" />
    <p v-html="replacedContent" class="content" type="text"></p>
  </div>
</template>

<script>
import { putBr } from '~/utils/function'

export default {
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    content: {
      type: String,
      default: '',
      required: true,
    },
    postImgUrl: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    replacedContent() {
      return putBr(this.content)
    },
  },
}
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - $LG_HEADER_HEIGHT);

  &__title {
    padding: $INNER_PADDING_VERTICAL 0;
    font-size: $FONT_XL;
    font-weight: 700;
  }

  .postImg {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: $EDIT_BASE_SIZE;
    height: $EDIT_BASE_SIZE;
  }

  .content {
    flex-grow: 1;
    padding: $INNER_PADDING_VERTICAL 0;
    font-size: $FONT_L;
  }
}
@include responsive('sm') {
  .editor {
    &__title {
      font-size: $FONT_BASE;
    }

    .content {
      font-size: $FONT_S;
    }
  }
}
</style>
