<template>
  <div class="header-wrapper">
    <div class="left" @click="$router.push('/')">
      <img src="../assets/images/symbol.svg" alt="OffStory 심볼" />
      <button class="logo">OffStory</button>
    </div>
    <div ref="middle" class="middle">
      <!-- <form @submit.prevent="">
        <input
          :value="userAddress"
          placeholder="'서울 강남'을 입력해 보세요"
          ref="input"
          @keyup.enter="parseAddress"
        />
        <button><i class="material-icons"> search </i></button>
      </form> -->
      <!-- <div class="search-Title">어디서 만날까요?</div> -->
      <br />
      <div class="search-address">
        <form
          @submit.prevent="searchPost"
          @submit="$router.push('/ResultOfPostList')"
        >
          <select
            @change="selectedCity($event)"
            @change.prevent="initSelectcounty"
            class="selectcity"
          >
            <option value="undefined" class="option">시</option>
            <option
              class="citylist"
              :key="i"
              :value="city"
              v-for="(city, i) in cityList"
            >
              {{ city }}
            </option>
          </select>
          <select @change="selectedCounty($event)" class="selectcounty">
            <option selected value="undefined" class="option">군,구</option>
            <option
              class="countylist"
              :key="i"
              :value="data.name"
              v-for="(data, i) in countyListForSelect"
            >
              {{ data }}
            </option>
          </select>
          <!-- TODO: sm이랑 lg의 input, button 이벤트가 달라야 해서 2개씩 만듦 -->
          <input
            class="search-detail lg"
            v-model="detailAdress"
            placeholder="상세주소 입력"
            @keyup.enter="searchPost"
          />
          <input
            class="search-detail sm"
            v-model="detailAdress"
            placeholder="상세주소 입력"
            @keyup.enter="searchPost(), closeSearch()"
          />
          <button class="lg-search-button" aria-label="검색 버튼">
            <i class="material-icons"> search </i>
          </button>
          <button
            class="sm-search-button"
            aria-label="검색 버튼"
            @click="closeSearch"
          >
            <i class="material-icons"> search </i>
          </button>
        </form>
      </div>
      <button ref="close" class="cancel-button" @click="closeSearch">
        <span class="material-icons"> close </span>
      </button>
    </div>
    <div class="right">
      <template v-if="isLogin">
        <button @click="openSearch" aria-label="검색 버튼">
          <i class="material-icons"> search </i>
        </button>
        <button
          aria-label="글쓰기 버튼"
          @click="this.$router.push({ name: 'CreateNewPost' })"
        >
          <i class="material-icons"> edit </i>
        </button>
        <!-- <button aria-label="채팅 버튼">
          <i class="material-icons"> question_answer </i>
        </button>
        <button aria-label="알림 버튼">
          <i class="material-icons"> notifications </i>
        </button> -->

        <button @click.stop="toggleSidebar">
          <img
            ref="userProfile"
            class="userprofile-image onToggle"
            :src="getUserProfileImage"
          />
        </button>
      </template>
      <template v-else>
        <Button
          width="100px"
          fontSize="25px"
          aria-label="로그인 버튼"
          @click="$router.push('/login')"
          :style="{
            display: 'block',
          }"
        >
          Login
        </Button>
      </template>
    </div>
  </div>
  <div class="isLoading">
    <div v-if="this.isLoading === true">
      <LoadingSpinner />
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import { channelsList, channelPostList } from '../api/index'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Button from '~/components/designs/Button'
import LoadingSpinner from '~/components/designs/LoadingSpinner'
import { getImageFromCookie } from '~/utils/cookies'
import { reactive } from 'vue'

export default {
  data() {
    return {
      selected: '',
      isLoading: false,
      defaultImageUrl: require('../assets/images/user-profile__default.svg'),
      userImage: null,
      detailAdress: '',
      countyList: [],
      countyListForSelect: [],
      selectuserCity: '',
      selectuserCounty: '',
      CountydataList: [],
      cityList: [
        '서울',
        '경기도',
        '세종특별자치시',
        '인천',
        '강원도',
        '대전',
        '충청북도',
        '충청남도',
        '경상북도',
        '경상남도',
        '부산',
        '대구',
        '울산',
        '전라북도',
        '전라남도',
        '광주',
        '제주도',
      ],
    }
  },
  props: {
    isSidebarShowed: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Button,
  },
  computed: {
    ...mapState('address', ['cityList', 'countyList']),

    ...mapGetters('Login', [
      'isLogin',
      'isEmptyProfileImage',
      'getUserProfileImage',
    ]),
    getUserProfileImage() {
      const profileImage = getImageFromCookie()
      return profileImage === 'undefined' ? this.defaultImageUrl : profileImage
    },
    keepSearchDatas() {
      let targetCity = document.getElementsByClassName('selectcity')[0]
      console.log(targetCity)
      console.log(targetCity.value)
      console.log(this.$storage.getItem('userCity'))
      //${this.$storage.getItem('userCity')}
      targetCity.value = `${this.$storage.getItem('userCity')}`
      let targetCounty = document.getElementsByClassName('selectcounty')[0]
      targetCounty.value = `${this.$storage.getItem('userCounty')}`
    },
  },
  methods: {
    ...mapMutations('address', [
      'setUserCity',
      'setUserCounty',
      'setSearchChannelId',
      'setdetailAddress',
      'setPostListData',
    ]),

    async parseAddress() {
      // const userCity = this.cityList.find(city =>
      //   this.$refs.input.value.includes(city.name),
      // )
      // await this.fetchCounty(userCity.code)
      // const userCounty = this.countyList.find(county => {
      //   const countyNameWithoutGu = county.name.replace(/구$/, '')
      //   return this.$refs.input.value.includes(countyNameWithoutGu)
      // })
      // //for debug
      // console.log('userCounty', userCounty)
      // this.updateSearchedAddress({ userCity, userCounty })
      // this.$refs.input.value = ''
      const userInputAdress = this.$refs.input.value
      userInputAdress.split(' ')
    },

    toggleSidebar() {
      if (this.isSidebarShowed === false) {
        // FIXME: 실제 isSodebarShowed는 true인데 false일 때 작동;;
        this.$refs.userProfile.classList.add('onToggle')
      } else {
        this.$refs.userProfile.classList.remove('onToggle')
      }
      this.$emit('toggleSidebar')
    },
    //시를 선택했을때
    async selectedCity(event) {
      console.log(event.target.value)
      this.selectuserCity = event.target.value
      //시만을 선택했을때를 위한 예외처리
      if (this.selectuserCity === 'undefined') {
        this.selectuserCity = ''
      }
      const userCity = event.target.value //선택한 도시 넘겨줌
      //선택되었던 군/구 초기화
      let target = document.getElementsByClassName('selectcounty')[0]
      target.value = undefined
      this.setUserCounty('')
      this.$storage.setItem('userCounty', '')
      const channelsListData = await channelsList() //채널리스트를 불러옴

      //선택한 city와 같은 name의 채널을 찾음
      const selectChannelData = channelsListData.data.filter(x => {
        return x.name === `${userCity}b`
      })

      //찾은 채널의 description을 기반으로 문자열 처리해주어 군/구 데이터 뽑아내기
      const countyListBeta = selectChannelData.map(x => x.description)
      const countyList = countyListBeta[0].split('/')
      console.log(countyList)
      this.countyListForSelect = countyList

      //선택된 채널 id를 할당
      const selectChannelId = selectChannelData.map(x => x._id) //채널의 id
      console.log(selectChannelId)
      this.channelId = selectChannelId
      this.setSearchChannelId(this.channelId)
      this.$storage.setItem('channelId', this.channelId)

      this.setUserCity(this.selectuserCity)
      this.$storage.setItem('userCity', this.selectuserCity)
    },
    // initSelectcounty(event) {
    //   if (event) {
    //     let target = document.getElementsByClassName('selectcounty')[0]
    //     this.selectuserCounty = ''
    //     target.value = undefined
    //     this.setUserCounty('')
    //     this.$storage.setItem('userCounty', '')
    //     console.log('도시선택했을때 구', this.setUserCounty)
    //     console.log(this.selectuserCounty)
    //   }
    // },
    selectedCounty(event) {
      let valueCheck = event.target.value
      console.log(valueCheck)
      if (valueCheck === 'undefined') {
        this.selectuserCounty = ''
        this.setUserCounty('')
        this.$storage.setItem('userCounty', '')
        return
      } else {
        this.selectuserCounty = event.target.value
        this.setUserCounty(this.selectuserCounty)
        this.$storage.setItem('userCounty', this.selectuserCounty)
      }
    },
    keepSearchData() {
      let targetCity = document.getElementsByClassName('selectcity')[0]
      console.log(targetCity)
      console.log(targetCity.value)
      console.log(this.$storage.getItem('userCity'))
      //${this.$storage.getItem('userCity')}
      targetCity.value = '경기'
      let targetCounty = document.getElementsByClassName('selectcounty')[0]
      targetCounty.value = `${this.$storage.getItem('userCounty')}`
    },
    async searchPost() {
      //this.isLoading = true
      //this.setisLoading(true)
      // console.log(this.isLoading)
      // console.log(this.detailAdress)
      if (this.selectuserCity === '') {
        alert(' 시 를 선택해주세요')
        this.$storage.removeItem('userCity')
        this.$storage.removeItem('userCounty')
        this.$storage.removeItem('PostListData')
        return
      } else {
        this.setdetailAddress(this.detailAdress)
        this.$storage.setItem('userdetailAddress', this.detailAdress)

        const postListdata = await channelPostList(this.channelId)
        this.CountydataList = []
        console.log(postListdata.data)
        console.log('county', this.selectuserCounty)
        const filteredDataOfCounty = postListdata.data.map(x =>
          x.location.includes(`/${this.selectuserCounty}`),
        )

        for (let i in filteredDataOfCounty) {
          if (filteredDataOfCounty[i]) {
            this.CountydataList.push(postListdata.data[i])
          }
        }
        console.log('군까지 선택했을때', this.CountydataList)
        console.log(filteredDataOfCounty)
        this.setPostListData(this.CountydataList)
        this.$storage.setItem('PostListData', this.CountydataList)
        this.isLoading = false
        console.log(this.isLoading)
        //this.setisLoading(false)
        this.$router.go(0)
        this.$router.push('/ResultOfPostList')
      }

      // }
    },
    openSearch() {
      this.$refs.middle.style = 'display: flex'
      this.$refs.close.style = 'display: inline-block'
      this.$emit('closeSidebar')
    },
    closeSearch() {
      this.$refs.middle.style = 'display: none'
      this.$refs.close.style = 'display: none'
    },
  },
}
</script>

<style scoped lang="scss">
.header-wrapper {
  position: fixed;
  width: 100%;
  height: $LG_HEADER_HEIGHT;
  padding: 0 $HEADER_MARGIN;
  @include flexbox($jc: between);
  z-index: $HEADER_INDEX;
  background-color: rgba($COLOR_WHITE, $OPACITY);
  backdrop-filter: blur(10px);

  .left {
    @include flexbox;

    img {
      width: 40px;
      cursor: pointer;
    }

    .logo {
      /* font-family: $FONT_LOGO; */
      font-size: $HEADER_ICON_BASE;
      color: $KEY_COLOR;
      margin-left: 10px;
    }
  }

  .middle {
    @include pos-center-x;
    @include flexbox;
    .search-address {
      position: relative;
      form {
        width: 100%;
        display: flex;
        align-items: center;

        select {
          @include font($color: $COLOR_GRAY_DARKEN);
          width: 150px;
          margin: $INNER_PADDING_SMALL;
          padding: $INNER_PADDING_VERTICAL $INNER_PADDING_HORIZONTAL;
          border-radius: $BORDER_RADIOUS;
          border: 1px solid $COLOR_GRAY_DARKEN;
          background: none;
          .citylist {
            color: $COLOR_GRAY_DARKEN;
          }
          .countylist {
            color: $COLOR_GRAY_DARKEN;
          }
        }
        .search-detail {
          @include font;
          position: relative;
          width: 200px;
          height: 52px;
          margin: 5px;
          padding: $INNER_PADDING_VERTICAL $INNER_PADDING_HORIZONTAL;
          border-radius: $BORDER_RADIOUS;
          border: 1px solid $COLOR_GRAY_DARKEN;

          &.sm {
            display: none;
          }

          &::placeholder {
            color: $COLOR_GRAY_DARKEN;
          }
        }

        // input {
        //   width: 10%;
        //   padding: 13px;
        //   font-size: 20px;
        //   border: 1px solid darken($KEY_xCOLOR, 0%);
        //   border-radius: 25px;
        //   &:focus {
        //     border-color: darken($KEY_COLOR, 10%);
        //   }
        // }

        button {
          display: inline-block;
          position: absolute;
          right: 10px;

          &.sm-search-button {
            display: none;
          }

          i {
            font-size: $HEADER_ICON_BASE;
          }
        }
      }
    }

    .cancel-button {
      display: none;
    }
  }

  .right {
    button {
      margin-left: $LG_PADDING_HORIZONTAL;

      .userprofile-image {
        width: $LG_PROFILE_SIZE + $ACTIVE_BORDER;
        height: $LG_PROFILE_SIZE + $ACTIVE_BORDER;
        border-radius: 30px;
        border: 1px solid $COLOR_BORDER;

        &.onToggle {
          border: $ACTIVE_BORDER solid $KEY_COLOR;
        }
      }
      i {
        font-size: $LG_PROFILE_SIZE;
        color: $COLOR_PRIMARY;
        transition: color 300ms;
        &:hover {
          color: $KEY_COLOR;
        }
      }

      &:first-child {
        display: none;
      }
    }
  }

  @media (max-width: $FIRST_BREAPOINT) {
    .logo {
      display: none;
    }
  }

  @media (max-width: $SECOND_BREAPOINT) {
    .left {
      img {
        width: $LG_PROFILE_SIZE;
      }
    }

    .middle {
      width: 100%;
      height: 100vh;
      z-index: $SEARCH_INDEX;
      position: absolute;
      top: 10px;
      background-color: $COLOR_WHITE;
      display: none;

      .search-address {
        form {
          flex-wrap: wrap;
          select,
          .search-detail.sm {
            display: block;
            width: 100%;
          }

          .search-detail.lg {
            display: none;
          }
          .lg-search-button {
            display: none;
          }

          button.sm-search-button {
            position: static;
            display: block;
            width: 100%;
            padding: $INNER_PADDING_SMALL;
            margin: $INNER_PADDING_SMALL;
            border-radius: $BORDER_RADIOUS;
            background-color: $KEY_COLOR;

            i {
              color: $COLOR_WHITE;
            }
          }
        }
      }
      .cancel-button {
        position: absolute;
        top: $INNER_PADDING_SMALL;
        right: $INNER_PADDING_SMALL;
        width: $LG_PROFILE_SIZE;
        height: $LG_PROFILE_SIZE;
      }
    }

    .right {
      button:first-child {
        display: inline-block;
      }
    }
  }
}
</style>
