<template>
    <div class="row justify-between">
        <q-parallax>
            <template v-slot:media>
                <img src="statics/puzzle-like.jpg" class="blur" />
            </template>
            <h1 class="text-primary">Y o u L i k e</h1>
            <h5 class="text-white">Some catchy text here</h5>
        </q-parallax>
        <div class="q-pa-xl">
            <h1>Some introduction and a button to go to recovery</h1>
            <q-btn color="red" icon="far fa-thumbs-up" label="Go to likes recovery" to="/recovery" />
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style>
.blur {
    filter: blur(4px);
}
</style>