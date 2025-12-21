<template>
  <div class="login-container">
    <div class="login-box">
      <h1>吾等與貓毛</h1>
      <p class="subtitle">志工系統</p>

      <!-- 登入表單 -->
      <template v-if="!showReset">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            :disabled="loading"
            @keyup.enter="signIn"
          />
        </div>

        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="密碼"
            :disabled="loading"
            @keyup.enter="signIn"
          />
        </div>

        <button
          class="login-btn"
          @click="signIn"
          :disabled="loading || !email || !password"
        >
          {{ loading ? '登入中...' : '登入' }}
        </button>

        <p class="forgot-link" @click="showReset = true">忘記密碼？</p>
      </template>

      <!-- 重置密碼表單 -->
      <template v-else>
        <p class="reset-info">輸入你的 Email，我們會寄送重置連結給你</p>

        <div class="form-group">
          <input
            v-model="resetEmail"
            type="email"
            placeholder="Email"
            :disabled="loading"
            @keyup.enter="sendReset"
          />
        </div>

        <button
          class="login-btn"
          @click="sendReset"
          :disabled="loading || !resetEmail"
        >
          {{ loading ? '發送中...' : '發送重置信' }}
        </button>

        <p class="forgot-link" @click="showReset = false">← 返回登入</p>
      </template>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'blank',
  head: {
    title: '登入',
  },

  data() {
    return {
      email: '',
      password: '',
      resetEmail: '',
      loading: false,
      error: null,
      success: null,
      showReset: false
    }
  },

  async mounted() {
    const { data: { session } } = await this.$supabase.auth.getSession()
    if (session) {
      this.$router.push('/')
    }
  },

  methods: {
    async signIn() {
      if (!this.email || !this.password) return

      this.loading = true
      this.error = null

      try {
        const { data, error } = await this.$supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })

        if (error) {
          if (error.message === 'Invalid login credentials') {
            this.error = 'Email 或密碼錯誤'
          } else {
            this.error = error.message
          }
        } else if (data.session) {
          this.$router.push('/')
        }
      } catch (err) {
        this.error = '登入時發生錯誤，請稍後再試'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async sendReset() {
      if (!this.resetEmail) return

      this.loading = true
      this.error = null
      this.success = null

      try {
        const { error } = await this.$supabase.auth.resetPasswordForEmail(
          this.resetEmail,
          { redirectTo: window.location.origin + '/reset-password' }
        )

        if (error) {
          this.error = error.message
        } else {
          this.success = '重置信已發送，請檢查你的信箱！'
        }
      } catch (err) {
        this.error = '發送失敗，請稍後再試'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7f8 0%, #e8ecef 100%);
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;

  h1 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 28px;
  }

  .subtitle {
    color: #657181;
    margin: 0 0 30px 0;
    font-size: 14px;
  }
}

.reset-info {
  color: #657181;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;

  input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #6da2c2;
    }

    &::placeholder {
      color: #aaa;
    }
  }
}

.login-btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  background: #6da2c2;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #5a8fb0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.forgot-link {
  margin-top: 16px;
  color: #6da2c2;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #5a8fb0;
  }
}

.error {
  margin-top: 16px;
  color: #b33a39;
  font-size: 14px;
}

.success {
  margin-top: 16px;
  color: #34a853;
  font-size: 14px;
}
</style>
