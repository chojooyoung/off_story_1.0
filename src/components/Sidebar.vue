<template>
  <div class="sidebar-wrapper">
    <div class="header">
      <template v-if="getUserProfileImage === `undefined`">
        <img class="basicimage" :src="imageUrl" alt="" />
      </template>
      <template v-else>
        <img class="userimage" :src="getUserProfileImage" alt="" />
      </template>
      <div class="message">
        <div class="username">
          {{ getUserName }}
          <span class="sir">님</span>
        </div>
        <p>우리 동행할까요?</p>
      </div>
    </div>
    <div class="top">
      <button class="option personal-info" @click="$router.push('/authcheck')">
        내 정보 변경
      </button>
      <button
        class="option personal-create--newpost"
        @click="$router.push('/newpost')"
      >
        동행글 쓰기
      </button>
      <button
        class="option personal-activity"
        @click="$router.push('/personalactivity')"
      >
        내 활동목록
      </button>
    </div>
    <div class="bottom">
      <button @click="logout" class="logout-wrapper">
        <img :src="logoutImageUrl" alt="" class="logoutimg" />
        <button class="optionlogout">로그아웃</button>
      </button>
    </div>
  </div>
</template>

<script>
import { deleteCookie, getImageFromCookie } from '~/utils/cookies'
export default {
  data() {
    return {
      imageUrl: require('~/assets/images/user-profile__default.svg'),
      logoutImageUrl: require('~/assets/images/logout-black.svg'),
    }
  },
  computed: {
    getUserProfileImage() {
      // this.$store.state.Login.username
      // const res = this.$storage.getItem('userData')
      // const profileImage = res.userCoverImage
      // const profileImage = this.$store.state.Login.profileImage
      // console.log(profileImage)
      const profileImage = getImageFromCookie()
      console.log(profileImage)
      return profileImage
    },
    getUserName() {
      //this.$store.state.Login.username
      const res = this.$storage.getItem('userData')
      const username = res.userFullName
      //const username = this.$store.state.Login.username
      return username
    },
  },
  methods: {
    logout() {
      this.$store.commit('Login/clearUsername')
      this.$store.commit('Login/clearToken')
      // deleteCookie('off_auth')
      // deleteCookie('off_user')
      // deleteCookie('off_userId')
      // deleteCookie('off_userprofileImage')
      this.$storage.removeItem('off_userName')
      this.$storage.removeItem('off_auth')
      this.$storage.removeItem('off_userId')
      this.$storage.removeItem('userData')
      this.$router.push('/')
      return alert('logout!')
    },
  },
}
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  transition: all 0.3s;
  z-index: $HEADER_INDEX;
  width: 250px;
  position: fixed;
  top: calc($LG_HEADER_HEIGHT - $INNER_PADDING_VERTICAL);
  right: $HEADER_MARGIN;
  box-shadow: $BOX_SHADOW;
  background-color: $COLOR_WHITE;
  padding: 10px;

  .header {
    align-items: center;
    align-content: center;
    text-align: center;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $COLOR_GRAY_LIGHTEN;

    .basicimage {
      width: $LG_PROFILE_SIZE;
      height: $LG_PROFILE_SIZE;
    }
    .userimage {
      width: $LG_PROFILE_SIZE;
      height: $LG_PROFILE_SIZE;
      border-radius: 20px;
      border: 1px solid $COLOR_BORDER;
      margin-bottom: $INNER_PADDING_SMALL;
    }
    .message {
      display: flex;
      flex-direction: column;
      .username {
        color: $KEY_COLOR;
      }
      .sir {
        color: $COLOR_PRIMARY;
      }
    }
  }

  .top {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    button {
      margin: 0 10px 10px 10px;
      font-size: $FONT_BASE;
      color: $COLOR_GRAY_DARKEN;
      &:hover {
        color: $COLOR_GRAY_LIGHTEN;
      }
    }
  }
  .bottom {
    @include flexbox($jc: end);
    .logout-wrapper {
      @include flexbox;
      .logoutimg {
        width: 20px;
        height: 20px;
      }
      .optionlogout {
        color: $COLOR_GRAY_DARKEN;
        font-size: $FONT_S;
        margin-left: 2px;
      }
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>
