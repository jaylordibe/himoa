<script setup>
import { ref } from 'vue';
import BaseButton from './ui/BaseButton.vue';
import BaseField from './ui/BaseField.vue';
import { signIn } from '../auth/session';

const email = ref('');
const password = ref('');
const failure = ref('');
const submitting = ref(false);

async function submit() {
  submitting.value = true;
  failure.value = '';
  try {
    await signIn(email.value, password.value);
  } catch {
    failure.value = 'Email or password is incorrect.';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <BaseField id="email" v-model="email" label="Email" type="email" />
    <BaseField id="password" v-model="password" label="Password" type="password" />
    <p v-if="failure" class="sign-in__failure">{{ failure }}</p>
    <BaseButton type="submit" :disabled="submitting">Sign in</BaseButton>
  </form>
</template>

<style scoped>
.sign-in__failure {
  color: red;
  font-size: 13px;
}
</style>
