<script setup lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue';
  import { ref, computed } from 'vue';
  const auth0 = useAuth0();

  const userMenu = ref();
  const toggleUserMenu = (event:unknown) => {
    userMenu.value.toggle(event);
  };

  const authenticatedMenu = [{
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            auth0.logout();
          }
      }]
    
  const unauthenticatedMenu = [{
          label: 'Login',
          icon: 'pi pi-sign-in',
          command: () => {
            auth0.loginWithRedirect();
          }
      }]

  const userMenuItems = computed<typeof authenticatedMenu>(() => {
    if (auth0.isAuthenticated.value) {
      return authenticatedMenu
    } else {
      return unauthenticatedMenu
    }
  });

</script>
<template>
  <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem" class="xl:mx-7">
    <template #start>
      <div class="flex align-items-center gap-2">
        <h1 class="header-title">
          Be The Disclosure <span class="font-light text-sm">(beta)</span>
        </h1>
        <p class="font-light font-xs m-0">
          Defeating adversarial censorship through peer-to-peer torrenting.
        </p>
      </div>
    </template>

    <template #end>
      <div class="flex align-items-center gap-2">
        <router-link
          v-slot="{ isActive }"
          to="/"
        >
          <Button
            :class="{ active: isActive }"
            :disabled="isActive"
            label="Torrents"
            severity="secondary"
            link
          />
        </router-link>
        <router-link
          v-slot="{ isActive }"
          to="/about"
        >
          <Button
            :class="{ active: isActive }"
            :disabled="isActive"
            severity="secondary"
            link
            label="How this works"
          />
        </router-link>
        <router-link
          v-slot="{ isActive }"
          to="/subscribe"
        >
          <Button
            :class="{ active: isActive }"
            :disabled="isActive"
            label="Subscribe"
            severity="secondary"
            link
          />
        </router-link>
        <router-link
          v-slot="{ isActive }"
          to="/upload"
        >
          <Button
            :class="{ active: isActive }"
            :disabled="isActive"
            label="Upload"
            severity="secondary"
            link
          />
        </router-link>
        <Avatar
          :image="auth0.user.value?.picture"
          :icon="auth0.isAuthenticated.value ? undefined : 'pi pi-user-plus'"
          class="p-overlay-badge"
          size="large"
          shape="circle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          @click="toggleUserMenu"
        />
        <Menu
          id="overlay_menu"
          ref="userMenu"
          :model="userMenuItems"
          :popup="true"
        />
      </div>
    </template>
  </Toolbar>
</template>


<style>
.page-header {
    width: 100%;
    padding: 20px;
    padding-left: 50px;
}

.shadow-div {
    box-shadow: 0 6px 4px -4px gray;
}

.header-title {
    font-size: 1.3rem;
    min-width: 0;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.75rem;
    text-transform: none;
}

.p-avatar {
  cursor:pointer;
  background-color:#e2e8f0;
}
</style>
