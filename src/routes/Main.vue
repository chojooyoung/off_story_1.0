<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <main class="main">
          <div class="left">
            <h1 class="title">
              <span>오프라인에서 만드는</span><span>우리들의 이야기</span>
            </h1>
            <div class="content">
              <p class="paragraph">위치를 검색하고, 모임을 찾아요</p>
              <p class="paragraph">
                때로는 주최자가, 때로는 참가자가 되어보아요
              </p>
            </div>
          </div>
          <div class="right">
            <img class="main-image--1" :src="mainImageOne" alt="" />
            <img class="main-image--2" :src="mainImageTwo" alt="" />
            <img class="main-image--3" :src="mainImageThree" alt="" />
          </div>

          <!-- <BoxSkeleton />
    <CircleSkeleton />
    <ParagraphSkeleton /> -->
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import BoxSkeleton from '~/components/designs/BoxSkeleton'
import CircleSkeleton from '~/components/designs/CircleSkeleton'
import ParagraphSkeleton from '~/components/designs/ParagraphSkeleton'
export default {
  // components: { BoxSkeleton, CircleSkeleton, ParagraphSkeleton },
  computed: {
    mainImageOne() {
      return require('~/assets/images/main_1.png')
    },
    mainImageTwo() {
      return require('~/assets/images/main_2.png')
    },
    mainImageThree() {
      return require('~/assets/images/main_3.png')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  [class^='col-'] {
    @include flexbox;
    width: 100%;
    height: calc(100vh - $LG_HEADER_HEIGHT);
    position: relative;
    top: $LG_HEADER_HEIGHT;
  }
}

.main {
  @include flexbox;
  height: 100%;

  .title {
    @include font($sz: $FONT_XXXL, $w: 700);
    display: flex;
    flex-direction: column;
  }

  .content {
    margin-top: $INNER_PADDING_VERTICAL;
  }

  .left {
    margin-right: $LG_PADDING_HORIZONTAL;
  }

  .right {
    position: relative;
    width: 500px;
    height: 300px;

    .main-image {
      &--1 {
        position: absolute;
        bottom: -100px;
        left: 0px;
        width: 250px;
        z-index: 1;
      }

      &--2 {
        position: absolute;
        top: -150px;
        width: 500px;
      }

      &--3 {
        position: absolute;
        width: 300px;
        right: -35px;
        bottom: -145px;
      }
    }
  }

  @media (max-width: $SECOND_BREAPOINT) {
    flex-direction: column;

    .title {
      font-size: $FONT_XXL;
      flex-direction: row;
      span:first-child {
        margin-right: $INNER_PADDING_HORIZONTAL;
      }
    }

    .content {
      text-align: center;
    }
    .main-image {
      &--2 {
        display: none;
      }
    }
  }

  @include responsive('sm') {
    .title {
      text-align: center;
      flex-direction: column;
    }

    .right {
      width: 90%;
    }
  }
}
</style>
