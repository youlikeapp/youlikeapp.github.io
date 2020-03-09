<template>
    <div>
        <google-sign-in />
        <router-view />
    </div>
    <!-- <div class="q-pa-md doc-container">
        <div class="row justify-center">
            <div class="col-xs-12">
                <div class="q-pa-md q-gutter-sm">
                    <q-bar dark class="bg-negative text-white">
                        <q-btn color="deep-orange" push>
                            <div class="row items-center no-wrap">
                                <q-icon left name="fas fa-sign-in-alt" />
                                <div class="text-center">
                                    Log In
                                </div>
                            </div>
                        </q-btn>
                        <div class="col text-center text-weight-bold">
                            <q-btn
                                dense
                                flat
                                round
                                icon="far fa-thumbs-up"
                                size="12px"
                                color="white"
                            />
                            YouLike
                        </div>
                    </q-bar>
                    <q-tabs
                        inline-label
                        class="bg-negative text-white shadow-2"
                    >
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
                    <div class="q-ma-md">
                        <q-scroll-area style="height: 80vh">
                            <router-view />
                        </q-scroll-area>
                    </div>
                </div>
            </div>
        </div>
    </div>-->
</template>

<script>
import GoogleSignIn from '../components/google-sign-in';

export default {
    components: {
        GoogleSignIn,
    },
};
</script>
