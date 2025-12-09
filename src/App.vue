<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import es from 'quasar/lang/es'

const $q = useQuasar()
$q.lang.set(es)
</script>
