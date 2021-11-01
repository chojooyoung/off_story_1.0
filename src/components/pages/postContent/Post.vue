<template>
  <Card>
    <section class="post">
      <header class="post__header">
        <div class="left">
          <button class="user__profile">
            <img :src="HostProfileUrl" alt="유저 프로필" />
          </button>
          <div class="user__infos">
            <strong class="nickname">{{ author.fullName }}</strong>
            <div class="uploadDate">{{ timeForToday(postData.createdAt) }}</div>
            <div class="location">{{ postData.location }}</div>
          </div>
        </div>
        <div class="right">
          <Like v-if="isLogin && !checkHost" class="likes" :post="postData" />
          <div v-if="checkHost" class="edit-area">
            <button v-if="!isEdit" @click="changeToEdit" class="edit">
              편집
            </button>

            <button v-if="!isEdit" @click="submitDelete" class="delete">
              삭제
            </button>
          </div>
        </div>
      </header>
      <template v-if="!isEdit">
        <Editor :title="title" :content="content" :postImgUrl="postImgUrl" />
      </template>
      <template v-else>
        <EditPage
          @rerender="rerender"
          @saveEdit="saveEdit"
          @cancelEdit="cancelEdit"
          v-show="changeToEdit"
          :postId="postId"
          :channel="channel"
          :initialTitle="title"
          :initialContent="content"
          :initialPostImgUrl="postImgUrl"
        />
      </template>
    </section>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { timeForToday } from '~/utils/function'
import { deletePost } from '~/api/postContent'
import Card from '~/components/designs/Card'
import Like from '~/components/designs/Like'
import Editor from '~/components/pages/postContent/Editor'
import EditPage from '~/components/pages/postContent/EditPage'

export default {
  components: {
    Card,
    Editor,
    EditPage,
    Like,
  },
  props: ['postId', 'postData', 'author', 'channel', 'userId'],
  data() {
    return {
      isEdit: false,
    }
  },
  methods: {
    timeForToday,
    changeToEdit() {
      this.isEdit = true
    },
    saveEdit() {
      this.isEdit = false
    },
    cancelEdit() {
      this.isEdit = false
    },
    async submitDelete() {
      if (window.confirm('포스트를 삭제하시겠어요?')) {
        const userData = {
          id: this.postId,
        }
        const res = await deletePost({ data: userData })
        await window.alert('포스트가 삭제되었어요')
        this.$router.push('/')
      }
    },
    getHostProfileImg() {
      const result = Object.keys(this.author).some(v => v === 'coverImage')
      return result ? this.author.coverImage : ''
    },
    getPostImg() {
      const result = Object.keys(this.postData).some(v => v === 'image')
      return result ? this.postData.image : ''
    },
    async rerender() {
      await this.$emit('rerender')
    },
  },
  computed: {
    ...mapGetters('Login', ['isLogin']),
    title() {
      return this.postData.title.split('/')[0]
    },
    content() {
      return this.postData.title.split('/')[1]
    },
    HostProfileUrl() {
      return (
        this.getHostProfileImg() ||
        require('~/assets/images/user-profile__default.svg')
      )
    },
    postImgUrl() {
      return this.getPostImg() || ''
    },
    checkHost() {
      return this.author._id === this.userId
    },
  },
}
</script>

<style lang="scss" scoped>
.post {
  position: relative;
  min-height: 300px;

  &__header {
    @include flexbox($jc: between, $ai: start);
    height: $LG_HEADER_HEIGHT;

    .left {
      @include flexbox($jc: start);

      .user {
        &__profile {
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          margin-right: $INNER_PADDING_HORIZONTAL;
          img {
            @include flexbox;
            width: 40px;
            height: 40px;
            object-fit: cover;
          }
        }

        &__infos {
          & > * {
            margin-bottom: $INNER_PADDING_SMALL;
          }
          .nickname {
            display: inline-block;
            font-size: $FONT_L;
            cursor: pointer;
          }

          .uploadDate,
          .location {
            color: inherit;
            font-size: $FONT_S;
          }

          .uploadDate {
            color: $KEY_COLOR;
          }
        }
      }
    }

    .right {
      .edit-area {
        button {
          color: $COLOR_GRAY_DARKEN;
        }
        .edit {
          margin-right: $INNER_PADDING_HORIZONTAL;
        }
      }
    }
  }
}

@include responsive('sm') {
  .post {
    &__header {
      .left {
        .user {
          &__profile {
            img {
              width: 30px;
              height: 30px;
            }
          }
          &__infos {
            .nickname {
              font-size: $FONT_BASE;
            }
            .uploadDate,
            .location {
              font-size: $FONT_XS;
            }
          }
        }
      }
    }
  }
}
</style>
