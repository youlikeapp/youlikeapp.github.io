<template>
    <div>
        <h1>О проекте</h1>
        <div>
            <div>
                <p>Здравствуй, дорогой друг!</p>
                <p>Не здороваюсь.</p>
                <p>Привет, дорогой россиянин!</p>
                <p>Мур-мур-мур, котятки. :3</p>
            </div>
            <p>
                Оригинальное приветствие я так и не придумал, поэтому просто
                здравствуйте.
            </p>
            <h2>Коротко о сути</h2>
            <p>
                Возможно, вам уже доводилось слышать о том, что на YouTube
                пропадают лайки с видео. Лично мне доподлинно неизвестно,
                существует ли проблема на самом деле. Чтобы в этом убедиться (а
                заодно и людям помочь), я создал этот небольшой проект,
                позволяющий проверить наличие лайков на указанных видео и
                восстановить их.
            </p>
            <h2>Коротко о планах</h2>
            <p>
                Сейчас доступен минимальный необходимый функционал, но если в
                дальнейшем развитии будет заинтересована достаточно большая
                группа людей, то я планирую как минимум решить вопрос с квотой
                на запросы к YouTube Data API (либо попробовать реализовать
                альтернативный способ восстановления лайков без его
                использования).
            </p>
            <h2>О том, как можно помочь</h2>
            <h4>Способ первый. Easy.</h4>
            <p>Вы можете поделиться ссылкой на этот проект в соцсетях.</p>
            <div>
                <social-sharing
                    url="https://youlikeapp.github.io"
                    title="YouLike - Восстановление лайков на YouTube."
                    hashtags="youlike, youtube, missinglikes"
                    inline-template
                >
                    <div>
                        <network network="vk">
                            <font-awesome-icon :icon="['fab', 'vk']" />
                            VKontakte
                        </network>
                        <network network="twitter">
                            <font-awesome-icon :icon="['fab', 'twitter']" />
                            Twitter
                        </network>
                        <network network="facebook">
                            <font-awesome-icon :icon="['fab', 'facebook']" />
                            Facebook
                        </network>
                        <network network="odnoklassniki">
                            <font-awesome-icon
                                :icon="['fab', 'odnoklassniki']"
                            />
                            Odnoklassniki
                        </network>
                        <network network="googleplus">
                            <font-awesome-icon :icon="['fab', 'google-plus']" />
                            Google +
                        </network>
                        <network network="telegram">
                            <font-awesome-icon :icon="['fab', 'telegram']" />
                            Telegram
                        </network>
                    </div>
                </social-sharing>
            </div>
            <h4>Способ второй. Medium.</h4>
            <p>
                Вы можете сообщать о проблемах и пожеланиях на этот ящик:
                <a href="mailto:youlikeapp@gmail.com">youlikeapp@gmail.com</a>
            </p>
            <h4>Способ третий. Hard.</h4>
            <p>
                <a
                    href="https://github.com/youlikeapp/youlikeapp.github.io"
                    target="_blank"
                    >Исходники проекта</a
                >
                находятся на GitHub, поэтому любой желающий может попробовать
                модифицировать его и сделать пулл-реквест. И да, там же можно
                писать о проблемах/пожеланиях, если не пугает буржуйский язык.
                =)
            </p>
            <p>
                Ссылка на репозиторий расширения для Google Chrome:
                <a
                    href="https://github.com/Plastiquewind/youlike-chrome-extension"
                    target="_blank"
                    >https://github.com/Plastiquewind/youlike-chrome-extension</a
                >.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'About',
};
</script>

<style scoped></style>
