<template>
  <div class="reset-container">
    <div class="reset-box">
      <h1>設定新密碼</h1>

      <div class="form-group">
        <input
          v-model="password"
          type="password"
          placeholder="新密碼（至少 6 碼）"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="確認新密碼"
          :disabled="loading"
          @keyup.enter="updatePassword"
        />
      </div>

      <button
        class="btn"
        @click="updatePassword"
        :disabled="loading || !isValid"
      >
        {{ loading ? "更新中..." : "更新密碼" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  layout: "blank",
  head: {
    title: '重設密碼',
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
      loading: false,
      error: null,
      success: null,
    };
  },

  computed: {
    isValid() {
      return (
        this.password.length >= 6 && this.password === this.confirmPassword
      );
    },
  },

  methods: {
    async updatePassword() {
      if (!this.isValid) {
        if (this.password.length < 6) {
          this.error = "密碼至少需要 6 個字元";
        } else {
          this.error = "兩次輸入的密碼不一致";
        }
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const { error } = await this.$supabase.auth.updateUser({
          password: this.password,
        });

        if (error) {
          this.error = error.message;
        } else {
          this.success = "密碼已更新！3 秒後跳轉到登入頁...";
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      } catch (err) {
        this.error = "更新失敗，請稍後再試";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7f8 0%, #e8ecef 100%);
  padding: 20px;
}

.reset-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;

  h1 {
    margin: 0 0 30px 0;
    font-size: 24px;
  }
}

.form-group {
  margin-bottom: 16px;

  input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;

    &:focus {
      outline: none;
      border-color: #6da2c2;
    }
  }
}

.btn {
  width: 100%;
  padding: 14px;
  line-height: 1.5;
  font-size: 16px;
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
