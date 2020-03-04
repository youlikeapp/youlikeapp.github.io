<template>
    <div>
        <h1>About</h1>
        <ul>
            <li v-for="el in socials" :key="el.provider">{{el.title}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'About',
    data: () => {
        return {
            socials: [
                {
                    provider: 'vk',
                    icon: 'vk',
                    title: 'ВКонтакте',
                },
                {
                    provider: 'twitter',
                    icon: 'twitter',
                    title: 'Twitter',
                },
                {
                    provider: 'facebook',
                    icon: 'facebook',
                    title: 'Facebook',
                },
                {
                    provider: 'ok',
                    icon: 'odnoklassniki',
                    title: 'Одноклассники',
                },
                {
                    provider: 'google',
                    icon: 'google-plus',
                    title: 'Google+',
                },
                {
                    provider: 'telegram',
                    icon: 'telegram',
                    title: 'Telegram',
                },
            ],
        };
    },
};
</script>

<style scoped></style>
