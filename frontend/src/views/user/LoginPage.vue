
<script setup lang="ts">
    import { useAuth0 } from '@auth0/auth0-vue';
    const auth0 = useAuth0();
    console.log('user is ', auth0)
    const logout = () => {

      auth0.logout({ 
        logoutParams: { 
          // @ts-ignore
          returnTo: window.location.origin 
        } 
      });
        
    }
</script>


<template>
  <div>
    <button @click="auth0.loginWithRedirect">
      Log in
    </button>
    <p>ass{{ auth0.user.value }}</p>
    <button @click="logout">
      Log out
    </button>
  </div>
</template>