<template>
  <div class="container">
    <div class="login-page">
      <div class="row">
        <div class="col-lg-6">
          <Form class="login-form" @submit="submitForm">
            <header class="login-header">
              <div class="logo-area">
                <img src="../assets/images/logo.svg" alt="로고" />
              </div>
              <h1 class="login-comment">비밀번호를 입력해주세요</h1>
              <h1 class="login-title">내 정보 변경</h1>
            </header>
            <input
              class="login-input"
              v-model="password"
              name="password"
              type="password"
              placeholder="비밀번호"
              rules="required|confirmed:@password"
              required
            />
            <div class="error-message-wrapper">
              <ErrorMessage name="confirmation" class="error-message" />
            </div>
            <Button v-bind="{ width: '100%' }" class="login-button"
              >내 정보 변경
            </Button>
            <Button
              v-bind="{ width: '100%' }"
              class="goback"
              @click.prevent="gobackPage"
              >뒤로가기</Button
            >
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '~/components/designs/Button'
import { loginUser } from '../api/index'
import { validateEmail } from '../utils/validation'
import { Form, ErrorMessage } from 'vee-validate'
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  components: { Button, Form, ErrorMessage },
  computed: {
    isUserNameVaild() {
      return validateEmail(this.email)
    },
  },
  methods: {
    async submitForm() {
      //alert('f')
      const res = this.$storage.getItem('userData')
      this.email = res.userEmail
      try {
        const userData = {
          email: this.email,
          password: this.password,
        }
        const { data } = await loginUser(userData)
        console.log(data)
        this.$router.push('/personalinfo')
        this.$store.commit('Login/setAuthCheck', true)
      } catch (error) {
        //에러 핸들링 코드
        console.log(error.response.data)
        alert(error.response.data)
      }
    },
    gobackPage() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  top: $LG_HEADER_HEIGHT;

  .row {
    height: calc(100vh - $LG_HEADER_HEIGHT);
    justify-content: center;

    .login {
      &-header {
        width: 100%;
        .login-comment {
          margin-top: 50px;
          font-size: $FONT_L;
          font-weight: 700;
          padding: 10px;
          text-align: center;
        }
        .login-title {
          margin-top: 50px;
          font-size: $FONT_L;
          font-weight: 700;
        }

        .logo-area {
          display: flex;
          justify-content: right;
          img {
            width: 120px;
          }
        }
        margin-bottom: $LG_PADDING_VERTICAL;
      }

      &-form {
        @include flexbox;
        flex-direction: column;
        position: relative;
        top: 50%;
        padding: $LG_PADDING_VERTICAL $LG_PADDING_HORIZONTAL;
        background-color: $COLOR_WHITE;
        box-shadow: $BOX_SHADOW;
        transform: translateY(-50%);

        .login-input {
          @include font;
          width: 100%;
          padding: $INNER_PADDING_VERTICAL $INNER_PADDING_HORIZONTAL;
          border-radius: $BORDER_RADIOUS;
          border: 1px solid $COLOR_GRAY_DARKEN;

          &::placeholder {
            font-weight: 700;
            color: $COLOR_GRAY_LIGHTEN;
          }
        }
      }

      &-button {
        margin-top: 30px;
        margin-bottom: 10px;
      }
    }
    .error-message {
      &-wrapper {
        height: $FONT_XS;
        display: block;
        width: 100%;
        font-size: $FONT_XS;
        color: $COLOR_RED;
      }
    }
  }
}
</style>
