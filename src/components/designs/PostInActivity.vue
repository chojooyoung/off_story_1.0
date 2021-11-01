<template>
  <div class="post-wrapper">
    <div class="top">
      <div class="user-profile">
        <img
          :src="
            post.author.coverImage ||
            require('../../assets/images/user-profile.svg')
          "
          alt=""
        />
        <div class="text-profile">
          <div class="nickname">{{ post.author.fullName }}</div>
          <div class="address">
            {{ address }}
          </div>
        </div>
      </div>
      <Tag :state="post.state" class="join-state" :fontSize="'15px'" />
    </div>
    <Divider :margin="`13`" />
    <div class="mid">
      <div class="title">
        {{ title }}
      </div>
      <div class="content" v-html="content"></div>
    </div>
    <div class="bot">
      <div class="interest">
        <div class="like">
          <Like
            :likeCount="likeCount"
            :post="post"
            :doesUserLike="doesUserLike"
          />
        </div>
        <div class="comments">
          <i class="material-icons"> chat_bubble </i>
          <div class="comment-number">
            {{ commentCount }}
          </div>
        </div>
      </div>
      <div class="time">
        <div class="day">{{ getTime(post.createdAt)[0] }}</div>
        <div class="seperator">/</div>
        <div class="before">
          {{ pastTimeFrom(post.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  likePost,
  cancelLikePost,
  userDetailInfo,
  cancleLikePost,
  getPost,
} from '~/api'
import Divider from './Divider'
import Tag from './Tag'
import Like from './Like'

export default {
  data() {
    return {
      hasMyLikeToCurrentPostTest: true,
      doesUserLike: false,
      likeCount: 0,
    }
  },
  components: {
    Divider,
    Tag,
    Like,
  },
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    hasMyLikeToCurrentPost() {
      const { userId: currentUserId } = this.$storage.getItem('userData')
      const likes = this.post.likes || []
      const likeUserIds = likes.map(like => like.user) // user is userId
      return likeUserIds.includes(currentUserId)
    },
    address() {
      return this.post.location.replace(/[/]/g, ' ')
    },
    title() {
      return this.post.title.split('/')[0]
    },
    content() {
      return this.post.title.split('/')[1].replace(/\n/g, '<br/>')
    },
    commentCount() {
      return this.post.comments.length > 100
        ? '100+'
        : this.post.comments.length
    },
  },
  methods: {
    pastTimeFrom(createdAt) {
      const today = new Date()
      const timeValue = new Date(createdAt)

      const betweenTime = Math.floor(
        (today.getTime() - timeValue.getTime()) / 1000 / 60,
      )
      if (betweenTime < 1) return '방금전'
      if (betweenTime < 60) {
        return `${betweenTime}분전`
      }

      const betweenTimeHour = Math.floor(betweenTime / 60)
      if (betweenTimeHour < 24) {
        return `${betweenTimeHour}시간전`
      }

      const betweenTimeDay = Math.floor(betweenTime / 60 / 24)
      if (betweenTimeDay < 365) {
        return `${betweenTimeDay}일전`
      }

      return `${Math.floor(betweenTimeDay / 365)}년전`
    },
    getTime(time) {
      return [
        new Date(time).toISOString().split('T')[0],
        new Date(time).toTimeString().split(' ')[0],
      ]
    },
    async like() {
      const res = await likePost(this.post._id)
      this.doesUserLike = !this.doesUserLike
      this.likeCount++
      const { userId: currentUserId } = this.$storage.getItem('userData')
      this.post.likes.push({ _id: res.data._id, user: currentUserId })
    },
    async cancleLike() {
      const [likeId, index] = this.findLikeId()
      await cancleLikePost(likeId)
      this.doesUserLike = !this.doesUserLike
      this.likeCount--
      this.post.likes.splice(index, 1)
    },
    findLikeId() {
      const index = this.post.likes.findIndex(like => {
        const { userId: currentUserId } = this.$storage.getItem('userData')
        return like.user === currentUserId
      })
      const likeId = this.post.likes[index]._id
      return [likeId, index]
    },
    likeUpdate() {
      const { userId: currentUserId } = this.$storage.getItem('userData')
      const likes = this.post.likes
      const likeUserIds = likes.map(like => like.user) // user is userId
      this.doesUserLike = likeUserIds.includes(currentUserId)
      this.likeCount = likes.length
    },
  },
  mounted() {
    this.likeUpdate()
  },
}
</script>

<style lang="scss" scoped>
.post-wrapper {
  padding: 20px 40px 15px;
  margin-bottom: 20px;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px 3px rgba(224, 224, 224, 0.95);
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.05);
  }

  .delete {
    width: 0%;
    transition: all 0.5s ease;
  }
}

.top {
  position: relative;

  .user-profile {
    display: flex;

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #cccccc;
    }

    .text-profile {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin-left: 15px;

      .nickname {
        font-weight: 700;
        font-size: 1.1rem;
        line-height: 0.95rem;
      }
    }
  }

  .join-state {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.mid {
  .title {
    font-weight: 700;
    font-size: 1.4rem;
  }
  .content {
    margin-top: 10px;
    font-size: 1.1rem;

    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    line-height: 1.2;
    height: 65px;
    white-space: normal;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}

.bot {
  position: relative;
  margin-top: 20px;

  i {
    font-size: 1.4rem;
  }

  .interest {
    display: flex;

    .like {
      display: flex;
      align-items: center;

      i {
        cursor: pointer;
      }

      .like-number {
        font-size: 1.1rem;
        margin-left: 8px;
      }
    }
    .comments {
      display: flex;
      align-items: center;
      margin-left: 50px;

      .comment-number {
        font-size: 1.1rem;
        margin-left: 8px;
      }
    }
  }
  .time {
    position: absolute;
    display: flex;
    top: 0;
    right: 0;

    div {
      font-size: 1.1rem;
      margin-left: 10px;
    }
  }
}
</style>
