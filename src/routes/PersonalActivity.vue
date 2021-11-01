<template>
  <div class="container">
    <!-- <div id="user-info" class="row">
      <div class="col col-sm-4 col-lg-8">
        <img :src="profileImage" alt="" />
        <div class="user-details">
          <div class="user-nickname">wherehows</div>
          <div class="user-introduce">나는 공부하는게 너무 싫습니다</div>
        </div>
      </div>
    </div> -->
    <div id="category" class="row">
      <div class="col col-sm-4 col-lg-8">
        <div class="category">
          <button class="OffStory">참여한 모임</button>
        </div>
      </div>
    </div>
    <div id="Divider" class="row">
      <div class="col col-sm-4 col-lg-8">
        <Divider />
      </div>
    </div>
    <div id="activity-filter" class="row">
      <div class="col col-sm-4 col-lg-8">
        <div class="activity-filter" @click="filterPost($event)">
          <button class="admitted">날짜 순</button>
          <button class="approve">참가 승인됨</button>
          <button class="reject">참가 거절됨</button>
          <button class="waiting">참가 대기중</button>
        </div>
      </div>
    </div>
    <div id="activity-list" class="row">
      <div class="col col-sm-4 col-lg-8">
        <div class="activity-list">
          <ul ref="postContainer">
            <Post
              v-for="post in postsThatUserLike"
              :key="post._id"
              :post="post"
            />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Divider from '../components/designs/Divider'
import Tag from '../components/designs/Tag'
import Post from '../components/designs/PostInActivity'
import { userDetailInfo, likePost, cancleLikePost, getPost } from '../api/index'
import { mapGetters } from 'vuex'

export default {
  components: {
    Post,
    Divider,
  },
  data() {
    return {
      dummyPostData: {
        likes: [],
        comments: [],
        image: '',
        title: '',
        author: '',
        location: '',
      },
      postsThatUserLike: [],
      onlyLikeDataInPost: [],
      postContent: '',
    }
  },
  computed: {
    ...mapGetters('Login', ['getToken']),
    profileImage() {
      const res = this.$storage.getItem('userData')
      return res.userCoverImage || require('../assets/images/user-profile.svg')
    },
  },
  mounted() {
    this.getPostsThatUserLike()
  },
  methods: {
    filterPost(event) {
      const filterState = event.target.className
      console.log('실행여부', filterState)
      const posts = [...this.$refs.postContainer.children]
      console.log('실행여부2', posts[0])
      const filteredPosts = posts.filter(post => {
        console.log('post', post)
        return post.classList.contains(filterState)
      })
      console.log('filteredPosts', filteredPosts)
    },
    doesUserLikePost(post) {
      return this.getOnlyLikeDataInPost(post).includes(
        this.$storage.getItem('userData').userId,
      )
    },
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
    getPostContent(title) {
      return title.split('/')[1].replace(/\n/g, '<br/>')
    },
    getOnlyLikeDataInPost(postData) {
      const res = []

      for (let i = 0; i < postData.likes?.length; i += 1) {
        res.push(postData.likes[i].user)
      }
      return res
    },
    getTime(time) {
      return [
        new Date(time).toISOString().split('T')[0],
        new Date(time).toTimeString().split(' ')[0],
      ]
    },
    async getPostsThatUserLike() {
      const { userId: currentUserId } = this.$storage.getItem('userData')
      const { data } = await userDetailInfo(currentUserId)
      const likes = data.likes
      const postsThatUserLike = []
      console.log('userData는 어떻게 나옴?', data)
      console.log('likes는 어떻게 나옴?', likes)
      for (let i = 0; i < likes.length; i += 1) {
        const { post: postId } = likes[i]
        const { data } = await getPost(postId)
        postsThatUserLike[i] = data
      }
      this.postsThatUserLike = postsThatUserLike
    },
    async getpostsThatUserLikeTest() {
      const { data } = await getPost('617b8a28c63ff72877a2277c')
      data.state = 'approve'
      this.postsThatUserLikeTest.push(data)
    },
    async likeUpdate(postId) {
      const data = {
        postId,
      }
      await likePost(data)
    },
  },
}
</script>

<style lang="scss" scoped>
$marginToTheTop: 30px;

.container {
  position: relative;
  top: 150px;
  .row {
    @include flexbox;
  }
  /* 
  #user-info {
    .col {
      display: flex;
      img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
      }

      .user-details {
        margin-left: 20px;
      }
    }
  } */

  #activity-filter {
    .col {
      position: relative;

      .activity-filter {
        position: absolute;
        right: 0;

        button {
          margin-left: 25px;
        }
      }
    }
  }

  #activity-list {
    margin-top: 60px;

    .post-container {
      padding: 25px 40px;
      border: none;
      border-radius: 10px;
      box-shadow: 5px 5px 10px 3px rgba(224, 224, 224, 0.95);
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
      }
    }

    .bot {
      position: relative;
      margin-top: 50px;

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
  }
}
</style>
