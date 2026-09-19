<script setup lang="ts">
const props = defineProps<{ productSlug?: string }>()
const { t, l, locale } = useLocale()
const { allProducts } = useCatalogue()

const form = reactive({
  company: '',
  name: '',
  email: '',
  phone: '',
  product: props.productSlug ?? '',
  quantity: '',
  message: '',
  website: '', // honeypot
})
const status = ref<'idle' | 'sending' | 'ok' | 'err'>('idle')
const error = ref('')

const submit = async () => {
  status.value = 'sending'
  error.value = ''
  try {
    await $fetch('/api/inquiry', { method: 'POST', body: { ...form, locale: locale.value } })
    status.value = 'ok'
  } catch (e) {
    status.value = 'err'
    error.value = (e as { data?: { message?: string } })?.data?.message ?? ''
  }
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="submit">
    <div class="form__grid">
      <label>
        <span>{{ t('form.company') }}</span>
        <input v-model.trim="form.company" type="text" name="company" autocomplete="organization" required />
      </label>
      <label>
        <span>{{ t('form.name') }}</span>
        <input v-model.trim="form.name" type="text" name="name" autocomplete="name" required />
      </label>
      <label>
        <span>{{ t('form.email') }}</span>
        <input v-model.trim="form.email" type="email" name="email" autocomplete="email" required />
      </label>
      <label>
        <span>{{ t('form.phone') }}</span>
        <input v-model.trim="form.phone" type="tel" name="phone" autocomplete="tel" />
      </label>
      <label>
        <span>{{ t('form.product') }}</span>
        <select v-model="form.product" name="product">
          <option value="">–</option>
          <option v-for="p in allProducts()" :key="p.slug" :value="p.slug">{{ l(p.name) }}</option>
        </select>
      </label>
      <label>
        <span>{{ t('form.quantity') }}</span>
        <input v-model.trim="form.quantity" type="text" name="quantity" />
      </label>
      <label class="form__full">
        <span>{{ t('form.message') }}</span>
        <textarea v-model.trim="form.message" name="message" rows="4" />
      </label>
      <label class="form__hp" aria-hidden="true">
        <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
      </label>
    </div>

    <div class="form__actions">
      <button class="btn" type="submit" :disabled="status === 'sending' || status === 'ok'">
        {{ status === 'sending' ? t('form.sending') : t('form.send') }}
      </button>
      <p v-if="status === 'ok'" class="form__msg" role="status">{{ t('form.ok') }}</p>
      <p v-else-if="status === 'err'" class="form__msg form__msg--err" role="alert">
        {{ error || t('form.err') }}
      </p>
    </div>
  </form>
</template>

<style scoped>
.form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;
}
.form__full {
  grid-column: 1 / -1;
}
.form__hp {
  position: absolute;
  left: -9999px;
}
label {
  display: grid;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-2);
}
input,
select,
textarea {
  font: inherit;
  font-size: 15px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--ink);
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--ink-3);
  padding: 8px 0;
  border-radius: 0;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-bottom-color: var(--ink);
}
textarea {
  resize: vertical;
}
.form__actions {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;
}
.form__msg {
  font-size: 14px;
}
.form__msg--err {
  color: var(--paprika);
}
@media (max-width: 640px) {
  .form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
