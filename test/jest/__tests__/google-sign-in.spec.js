import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { QCard, QAvatar, QIcon, QCardActions, QBtn } from 'quasar';
import { SIGN_IN, LOG_OFF } from '../../../src/store/mutation-types';
import GoogleSignIn from '../../../src/components/google-sign-in';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.component('q-card', QCard);
localVue.component('q-avatar', QAvatar);
localVue.component('q-icon', QIcon);
localVue.component('q-card-actions', QCardActions);
localVue.component('q-btn', QBtn);

describe('GoogleSignIn', () => {
    let wrapper;
    let store;
    let actions;

    actions = {
        [SIGN_IN]: jest.fn(),
        [LOG_OFF]: jest.fn(),
    };
    store = new Vuex.Store({
        state: {
            user: {
                name: 'Anonymous User',
                image: 'far fa-user',
                isSignedIn: false,
            },
        },
        actions,
    });
    wrapper = shallowMount(GoogleSignIn, { store, localVue });

    it('Should create', () => {
        expect(wrapper).toBeDefined();
    });

    it('Should show Sign In button on init', () => {
        const btnText = wrapper.find(QBtn).text();

        expect(btnText).toEqual('Sign In');
    });

    it('Should dispatch sign in action on click', () => {
        wrapper.find(QBtn).trigger('click');

        expect(actions[SIGN_IN]).toHaveBeenCalled();
    });
});
