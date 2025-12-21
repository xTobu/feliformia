<template>
  <div class="settings-page">
    <h1>設定</h1>

    <!-- 名稱設定 -->
    <section class="settings-section">
      <h2>個人資料</h2>
      <div class="form-group">
        <label>名稱</label>
        <input
          v-model="nickname"
          type="text"
          placeholder="請輸入要顯示的名稱"
          :disabled="saving"
        />
      </div>
      <button
        class="btn save-btn"
        @click="saveProfile"
        :disabled="saving || !isNicknameValid"
      >
        {{ saving ? "儲存中..." : "儲存名稱" }}
      </button>
      <p v-if="profileSuccess" class="success">{{ profileSuccess }}</p>
      <p v-if="profileError" class="error">{{ profileError }}</p>
    </section>

    <!-- 修改密碼 -->
    <section class="settings-section">
      <h2>修改密碼</h2>
      <div class="form-group">
        <label>新密碼</label>
        <input
          v-model="newPassword"
          type="password"
          placeholder="輸入新密碼（至少 6 碼）"
          :disabled="updatingPassword"
        />
      </div>
      <div class="form-group">
        <label>確認新密碼</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="再次輸入新密碼"
          :disabled="updatingPassword"
        />
      </div>
      <button
        class="btn save-btn"
        @click="updatePassword"
        :disabled="updatingPassword || !isPasswordValid"
      >
        {{ updatingPassword ? "更新中..." : "更新密碼" }}
      </button>
      <p v-if="passwordSuccess" class="success">{{ passwordSuccess }}</p>
      <p v-if="passwordError" class="error">{{ passwordError }}</p>
    </section>

    <nuxt-link to="/" class="back-link">← 返回首頁</nuxt-link>
  </div>
</template>

<script>
export default {
  name: "SettingsPage",
  head: {
    title: "設定",
  },
  data() {
    return {
      // 名稱
      nickname: "",
      saving: false,
      profileSuccess: null,
      profileError: null,

      // 密碼
      newPassword: "",
      confirmPassword: "",
      updatingPassword: false,
      passwordSuccess: null,
      passwordError: null,
    };
  },

  computed: {
    isNicknameValid() {
      if (!this.nickname) return false;
      // 移除半形和全形空格後檢查
      const trimmed = this.nickname.replace(/[\s\u3000]/g, "");
      return trimmed.length > 0;
    },
    isPasswordValid() {
      return (
        this.newPassword.length >= 6 &&
        this.newPassword === this.confirmPassword
      );
    },
  },

  async mounted() {
    await this.loadProfile();
  },

  methods: {
    async loadProfile() {
      try {
        const {
          data: { user },
        } = await this.$supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await this.$supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (data) {
          this.nickname = data.nickname || "";
        }
      } catch (err) {
        console.error("載入 profile 失敗:", err);
      }
    },

    async saveProfile() {
      if (!this.isNicknameValid) {
        this.profileError = "請輸入名稱";
        return;
      }

      this.saving = true;
      this.profileSuccess = null;
      this.profileError = null;

      try {
        const {
          data: { user },
        } = await this.$supabase.auth.getUser();
        if (!user) {
          this.profileError = "請先登入";
          return;
        }

        const cleanNickname = this.nickname.replace(
          /^[\s\u3000]+|[\s\u3000]+$/g,
          ""
        );

        const { error } = await this.$supabase.from("profiles").upsert({
          id: user.id,
          nickname: cleanNickname,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          this.profileError = error.message;
        } else {
          this.profileSuccess = "名稱已儲存！";
          this.$store.dispatch("auth/setNickname", this.nickname.trim());
        }
      } catch (err) {
        this.profileError = "儲存失敗，請稍後再試";
        console.error(err);
      } finally {
        this.saving = false;
      }
    },

    async updatePassword() {
      if (!this.isPasswordValid) {
        if (this.newPassword.length < 6) {
          this.passwordError = "密碼至少需要 6 個字元";
        } else {
          this.passwordError = "兩次輸入的密碼不一致";
        }
        return;
      }

      this.updatingPassword = true;
      this.passwordSuccess = null;
      this.passwordError = null;

      try {
        const { error } = await this.$supabase.auth.updateUser({
          password: this.newPassword,
        });

        if (error) {
          this.passwordError = error.message;
        } else {
          this.passwordSuccess = "密碼已更新成功！";
          this.newPassword = "";
          this.confirmPassword = "";
        }
      } catch (err) {
        this.passwordError = "更新失敗，請稍後再試";
        console.error(err);
      } finally {
        this.updatingPassword = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.settings-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
}

.settings-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #657181;
    margin: 0 0 16px 0;
  }
}

.form-group {
  margin-bottom: 16px;
  text-align: left;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #657181;
  }

  input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;

    &:focus {
      outline: none;
      border-color: #6da2c2;
    }
  }
}

.save-btn {
  width: 100%;
  padding: 12px;
  line-height: 1.5;
  font-size: 15px;
}

.error {
  color: #b33a39;
  font-size: 14px;
  margin-top: 12px;
}

.success {
  color: #34a853;
  font-size: 14px;
  margin-top: 12px;
}

.back-link {
  display: inline-block;
  margin-top: 10px;
  color: #657181;
  font-size: 14px;
}
</style>
