<template>
  <div class="container">
    <div class="sign-page">
      <div class="row">
        <div class="col-lg-6">
          <Form class="sign-form" @submit="submitSignup">
            <header class="sign-header">
              <h1 class="sign-title">이메일로 가입하기</h1>
            </header>
            <Field
              v-model="email"
              name="email"
              type="email"
              rules="required|email"
              placeholder="이메일"
            />
            <div class="error-message-wrapper">
              <ErrorMessage name="email" class="error-message" />
            </div>

            <Field
              v-model="fullName"
              type="text"
              name="nickname"
              rules="required|between:2,30"
              placeholder="닉네임 (2 ~ 30자)"
            />
            <div class="error-message-wrapper">
              <ErrorMessage name="nickname" class="error-message" />
            </div>

            <Field
              v-model="password"
              name="password"
              type="password"
              rules="required|between:8,30|password"
              placeholder="비밀번호 (영문, 숫자, 특수문자 8 ~ 30자)"
            />
            <div class="error-message-wrapper">
              <ErrorMessage name="password" class="error-message" />
            </div>

            <Field
              v-model="confirmation"
              name="confirmation"
              type="password"
              class="checkPassword"
              rules="required|confirmed:@password"
              placeholder="비밀번호 확인"
            />
            <div class="error-message-wrapper">
              <ErrorMessage name="confirmation" class="error-message" />
            </div>

            <Button v-bind="{ width: '100%' }" class="sign-button"
              >회원가입</Button
            >
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser, updateNameField } from '~/api/index'
import { Field, Form, ErrorMessage } from 'vee-validate'
import Button from '~/components/designs/Button'

export default {
  components: {
    Field,
    Form,
    ErrorMessage,
    Button,
  },
  data() {
    return {
      email: '',
      fullName: '',
      password: '',
      confirmation: '',
    }
  },

  methods: {
    async submitSignup() {
      try {
        const userData = {
          email: this.email,
          fullName: this.fullName,
          password: this.password,
        }
        const { data } = await registerUser(userData)
        console.log(data)
        await this.initForm() // submit 후 input 초기화
        if (
          window.confirm(
            '회원가입이 완료되었습니다 👏👏. 로그인 페이지로 이동할까요?',
          )
        ) {
          this.$router.push({ name: 'Login' })
        } else {
          this.$router.push('/')
        }
      } catch (error) {
        console.log(error.response.data)
        alert(error.response.data)
      }
    },
    initForm() {
      this.email = ''
      this.fullName = ''
      this.password = ''
      this.confirmation = ''
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

    .sign {
      &-header {
        width: 100%;
        .sign-title {
          font-size: $FONT_L;
          font-weight: 700;
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

        input {
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
      }
    }

    .error-message {
      &-wrapper {
        height: $FONT_BASE;
        display: block;
        width: 100%;
        font-size: $FONT_XS;
        color: $COLOR_RED;
      }
    }
  }
}
</style>
