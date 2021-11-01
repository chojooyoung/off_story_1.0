<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <form @submit.prevent="createPost" class="post-form">
          <div class="post-logo-area">
            <img src="../assets/images/logo.svg" alt="로고" />
          </div>
          <div>
            <h1 class="post-title">동행 구하기</h1>
          </div>
          <div class="post-Title">어디서 만날까요?</div>
          <div class="post-address">
            <select @change="selectedCity($event)" class="selectcity">
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
              <option value="undefined" class="option">군,구</option>
              <option
                class="countylist"
                :key="i"
                :value="data.name"
                v-for="(data, i) in countyListForSelect"
              >
                {{ data }}
              </option>
            </select>
            <input
              placeholder="나머지 주소입력!"
              v-model="detailAdress"
              name="detailAdress"
              type="text"
              required
            />
          </div>
          <div class="post-titletext">제목을 작성하세요</div>

          <div class="titlearea">
            <input
              placeholder="제목"
              v-model="title"
              name="title"
              type="title"
              class="posttitle"
              required
            />

            <Button class="uploadbutton" @click.prevent="chooseFile"
              >이미지 첨부하기</Button
            >
            <div class="imagearea">
              <template v-if="this.url === ''">
                <img :src="this.url" ref="image" style="display: none" />
              </template>
              <template v-else>
                <img :src="url" ref="image" @click="deleteImage" />
                <button class="deletebutton" @click="deleteImage">
                  <span class="txt">x</span>
                </button>
              </template>
            </div>
            <input
              type="File"
              accept="image/*"
              @change="previewImage"
              ref="imageInput"
              :style="{ display: 'none' }"
            />
          </div>
          <!-- <input type="file" id="input-file" style="display: none" /> -->
          <!-- <img style="width: 500px" id="preview-image" src="`${this.imgurl}`" /> -->
          <div class="post-contenttext">내용</div>
          <textarea
            class="post-content"
            v-model="content"
            @keyup="resizeContent($event)"
            placeholder="100자 이내로 입력하세요"
          ></textarea>
          <div class="buttonwrapper">
            <Button class="post-button">글 작성하기</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getAuth, createPost, channelsList, createChannel } from '../api/index'
import Button from '~/components/designs/Button'
import Input from '../components/designs/Input.vue'

export default {
  data() {
    return {
      url: '',
      detailAdress: '',
      title: '',
      content: '',
      image: null,
      imgurl: '',
      channelId: '',
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
      countyList: [],
      countyListForSelect: [],
      selectuserCity: '',
      selectuserCounty: '',
    }
  },
  components: { Button },
  async mounted() {
    const auth = await getAuth()
    console.log(auth)
  },
  computed: {
    //...mapState('address', ['cityList', 'countyList']),
  },
  methods: {
    ...mapActions('address', ['fetchCounty']),

    async selectedCity(event) {
      console.log(event.target.value)
      this.selectuserCity = event.target.value
      const userCity = event.target.value //선택한 도시 넘겨줌
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
    },
    chooseFile() {
      this.$refs.imageInput.click()
    },
    previewImage(event) {
      this.image = event.target.files[0]

      if (this.image) {
        const reader = new FileReader()
        const img = this.$refs.image

        reader.addEventListener('load', function () {
          img.setAttribute('src', this.result)
        })
        this.url = window.URL.createObjectURL(this.image)

        reader.readAsDataURL(this.image)
      }
    },
    selectedCounty(event) {
      console.log(event.target.value)
      this.selectuserCounty = event.target.value
    },

    uploadImage(event) {
      this.image = event.target.files[0]
      this.imgurl = URL.createObjectURL(event.target.files[0])
      console.log(this.image)
      console.log(this.imgurl)
    },
    deleteImage() {
      this.image = null
      this.url = ''
    },

    getcitylist() {
      console.log(this.city)
      return this.city
    },
    hover(element) {
      element.setAttribute('src', 'http://dummyimage.com/100x100/eb00eb/fff')
    },

    unhover(element) {
      element.setAttribute('src', 'http://dummyimage.com/100x100/000/fff')
    },
    async createPost() {
      try {
        // const channelsListData = await channelsList()
        // const selectChannelId = channelsListData.data
        //   .filter(x => {
        //     return x.name === this.selectuserCity
        //   })
        //   .map(x => x._id)
        // console.log(selectChannelId)
        // if (selectChannelId.length === 0) {
        //   //채널을 새로 생성해야 되는 경우
        //   const channelData = {
        //     name: this.selectuserCity,
        //     description: `${this.selectuserCity}의 채널입니다.`,
        //   }
        //   const newChannelData = await createChannel(channelData)
        //   this.channelId = newChannelData._id
        // } else {
        //   this.channelId = selectChannelId[0]
        // }
        const userData = new FormData()
        userData.append('title', `${this.title}/${this.content}`)
        userData.append('image', this.image)
        userData.append('channelId', this.channelId)
        userData.append(
          'location',
          `${this.selectuserCity}/${this.selectuserCounty}/${this.detailAdress}`,
        )
        userData.append('meta', '')

        // const userData = {
        //   title: `${this.title}/${this.content}`,
        //   image: this.image,
        //   channelId: this.channelId,
        //   location: `${this.selectuserCity}/${this.selectuserCounty}/${this.detailAdress}`,
        //   meta: '', //만일을 위해 아껴두자!
        // }
        console.log(userData)
        const postData = await createPost(userData)
        console.log('postData afer write', postData)
        alert(
          `${this.selectuserCity}시 ${this.selectuserCounty} 카테고리에 등록되었습니다.`,
        )
        this.$router.push('/')
      } catch (error) {
        //에러 핸들링 코드
        console.log(error.response.data)
        alert(error.response.data)
      }
      //this.$route.push('/')
    },
    resizeContent(event) {
      event.target.style.height = '1px'
      event.target.style.height = 20 + event.target.scrollHeight + 'px'
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  top: $LG_HEADER_HEIGHT;
  .row {
    height: calc(90vh - $LG_HEADER_HEIGHT);
    justify-content: center;
    .post {
      width: 100%;
      &-title {
        margin: 30px 0;
        color: $COLOR_GRAY_DARKEN;
        font-size: $FONT_L;
        font-weight: 700;
      }
      &-Title {
        color: $KEY_COLOR;
        margin-top: 10px;
        font-size: $FONT_BASE;
        font-weight: 600;
      }
      &-titletext {
        color: $KEY_COLOR;
        font-size: $FONT_BASE;
        font-weight: 600;
      }
      &-contenttext {
        color: $KEY_COLOR;
        font-size: $FONT_BASE;
        font-weight: 600;
      }

      &-logo-area {
        display: flex;
        justify-content: right;
        img {
          width: 120px;
        }
      }
      margin-bottom: $LG_PADDING_VERTICAL;

      &-form {
        flex-direction: column;
        position: relative;
        top: 50%;
        padding: $LG_PADDING_VERTICAL $LG_PADDING_HORIZONTAL;
        background-color: $COLOR_WHITE;
        box-shadow: $BOX_SHADOW;
        transform: translateY(-50%);
        .post-address {
          @include flexbox;
          @include font;
          margin: $LG_PADDING_VERTICAL 0;
          select {
            @include font;
            width: 30%;
            height: $BUTTON_HEIGHT;
            margin-right: $INNER_PADDING_HORIZONTAL;
            padding: $INNER_PADDING_VERTICAL $INNER_PADDING_HORIZONTAL;
            border-radius: $BORDER_RADIOUS;
            border: 1px solid $COLOR_GRAY_DARKEN;
            color: $COLOR_GRAY_DARKEN;
            background: none;

            .citylist {
              color: $COLOR_GRAY_DARKEN;
            }
            .countylist {
              color: $COLOR_GRAY_DARKEN;
            }

            &::placeholder {
              color: $COLOR_GRAY_DARKEN;
            }
          }

          input {
            @include font;
            width: 100%;
            height: $BUTTON_HEIGHT;
            padding: $INNER_PADDING_VERTICAL $INNER_PADDING_HORIZONTAL;
            border-radius: $BORDER_RADIOUS;
            border: 1px solid $COLOR_GRAY_DARKEN;

            &::placeholder {
              color: $COLOR_GRAY_LIGHTEN;
            }
          }
        }
        .titlearea {
          position: relative;
          @include flexbox;
          width: 100%;
          margin: $LG_PADDING_VERTICAL 0;

          .posttitle {
            @include font;
            width: 100%;
            height: $BUTTON_HEIGHT;
            padding: $INNER_PADDING_VERTICAL $INNER_PADDING_HORIZONTAL;
            margin-right: $INNER_PADDING_HORIZONTAL;
            border-radius: $BORDER_RADIOUS;
            border: 1px solid $COLOR_GRAY_DARKEN;
            &::placeholder {
              color: $COLOR_GRAY_LIGHTEN;
            }

            .uploadbutton {
              width: 10px;
            }
          }
          .post {
            @include font;
            width: 45%;
            height: 100%;
            margin-left: 10px;
            padding: 6px 25px;
            background-color: $KEY_COLOR;
            border-radius: 4px;
            color: white;
            cursor: pointer;
          }
        }

        .imagearea {
          @include flexbox($ai: start);
          position: absolute;
          top: -35px;
          right: 30px;
          vertical-align: middle;
          img {
            width: $BUTTON_HEIGHT;
            height: 30px;
            cursor: pointer;
            &:hover {
              filter: brightness(30%);
              //opacity: 0.3;
            }
          }
          .deletebutton {
            @include flexbox;
            width: 13px;
            height: 13px;
            padding-bottom: 2px;
            color: $COLOR_WHITE;
            background-color: $COLOR_BLACK;
            opacity: 0.6;

            &:hover {
              opacity: 0.3;
            }
          }
        }
        .post-content {
          @include font;
          width: 100%;
          min-height: 100px;
          margin: $LG_PADDING_VERTICAL 0;
          background-color: $COLOR_WHITE;
          border-radius: $BORDER_RADIOUS;
          border: 1px solid $COLOR_GRAY_DARKEN;

          &::placeholder {
            color: $COLOR_GRAY_LIGHTEN;
          }
        }
        .buttonwrapper {
          display: flex;
          justify-content: right;
          .post-button {
            margin-top: 20px;
            margin-bottom: 10px;
          }
        }
      }
    }

    @include responsive('sm') {
      .post {
        &-form {
          .post {
            &-address {
              flex-direction: column;
              select {
                width: 100%;
                margin-right: 0;
                margin-bottom: $INNER_PADDING_SMALL;
              }
            }
          }
          .titlearea {
            flex-direction: column;
            align-items: flex-start;

            .posttitle {
              margin-right: 0;
              margin-bottom: $INNER_PADDING_SMALL;
            }

            .uploadbutton {
              width: 75%;
              max-width: 400px;
            }
          }

          .imagearea {
            top: $BUTTON_HEIGHT + $INNER_PADDING_SMALL;
            right: 0;
          }

          .buttonwrapper {
            .post-button {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
