<template>

<img v-bind:src="src" class="box">

</template>


<script>

export default {
	props: ['src'],
}

</script>


<style scoped>
.box {
	padding: 0;
}
</style>
