<template>
    <div>
        <div class="total">
            <div class="content">
                <div class="foo">
                    <div class="head clearFix">
                        <div class="leftHead"></div>
                        <div class="rightHead" style="cursor: default">台灣免試生系統</div>
                    </div>
                    <StudentLoginInputs v-show="this.showStudentLogin"></StudentLoginInputs>
                    <AdminLogin v-show="this.showAdminLogin"></AdminLogin>
                    <LoginPrompt v-show="this.showPrompt"></LoginPrompt>
                </div>
                <div class="background"></div>
            </div>
        </div>
        <div class="mainBackground"></div>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { getAdminToken, getStudentToken } from 'utils/token.ts'
  import { bus } from "./bus.ts"
  import StudentLoginInputs from './StudentLoginInputs.vue'
  import AdminLogin from './AdminLogin.vue'
  import LoginPrompt from './LoginPrompt.vue'

  @Component({
    components: {
      StudentLoginInputs,
      AdminLogin,
      LoginPrompt
    }
  })
  export default class StudentLogin extends Vue {

    showStudentLogin: boolean = true
    showAdminLogin: boolean = false
    showPrompt: boolean = false

    created () {
      bus.$on('switch-page', (page) => {
        if (page === LoginPages.STUDENT) {
          this.showStudentLogin = true
          this.showAdminLogin = false
          this.showPrompt = false
        } else if (page === LoginPages.ADMIN) {
          this.showAdminLogin = true
          this.showStudentLogin = false
          this.showPrompt = false
        } else if (page === LoginPages.PROMPT) {
          this.showPrompt = true
          this.showStudentLogin = false
          this.showAdminLogin = false
        }
      })
    }

    mounted () {
      /*如果存在cookie，则转到主页*/
      if (getStudentToken()) {
        this.$router.push('/student')
      } else if (getAdminToken()) {
        this.$router.push('/admin')
      }
    }
  }

  enum LoginPages {STUDENT = '1', ADMIN = '2', REGISTER = '3', PROMPT = '4'}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    a, a:hover {
        text-decoration: none;
    }

    a {
        color: #fff;
        transition: all 0.4s ease-in-out;
    }

    a:hover {
        color: #00a65a;
    }

    body, input, button {
        font: 12px arial;
        color: #333333;
        outline: 0;
        vertical-align: middle;
    }

    .clearFix:after {
        clear: both;
        content: ".";
        display: block;
        height: 0;
        visibility: hidden;
    }

    body {
        background-color: #fff;

        p {
            font-family: "Microsoft Yahei", serif;
        }
    }

    .total {
        height: 390px;
        position: absolute;
        top: 25%;
        left: 0;
        right: 0;
        z-index: 1000;
        overflow: hidden;
        text-align: center;

        .background {
            width: 459px;
            height: 390px;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            background: #000;
            opacity: .6;
            filter: Alpha(opacity=60);
            border-radius: 31px;
        }
    }

    .content {
        width: 419px;
        margin: 0 auto;
        padding: 19px 20px 30px;
        position: relative;

        .foo {
            width: 419px;
            margin: 10px auto;
        }

        .head {
            padding: 15px 0;
            margin-bottom: 33px;
            border-bottom: 1px solid #fff;

            .leftHead {
                float: left;
                margin-left: 10px;
                width: 183px;
                height: 58px;
                background: url(./img/NJULogo.png) center center;
                background-size: 183px 58px;
            }

            .rightHead {
                float: left;
                line-height: 30px;
                margin-top: 25px;
                margin-left: 18px;
                font-size: 26px;
                font-weight: bold;
                color: #fff;
                vertical-align: bottom;
            }
        }
    }

    .mainBackground {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background-size: cover;
        background: url(./img/bg1.jpg) center center;
    }
</style>
