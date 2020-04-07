<template>
    <div>
        <div>
            <div class="q-gutter-y-md">
                <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
                    <q-tabs shrink stretch>
                        <q-route-tab
                            to="/recovery"
                            name="recovery"
                            icon="far fa-thumbs-up"
                            label="Recovery"
                        />
                        <q-route-tab
                            to="/extension"
                            name="extension"
                            icon="fas fa-puzzle-piece"
                            label="Extension"
                        />
                        <q-route-tab
                            to="/about"
                            name="about"
                            icon="fas fa-info-circle"
                            label="About"
                        />
                    </q-tabs>
                    <q-space />
                    <google-sign-in />
                </q-toolbar>
            </div>
        </div>
        <router-view />
    </div>
</template>

<script>
import GoogleSignIn from '../components/GoogleSignIn';

export default {
    components: {
        GoogleSignIn,
    },
};
</script>
