import { shallowMount } from '@vue/test-utils';
import GoogleSignIn from '../../../src/components/google-sign-in';

describe('GoogleSignIn', () => {
    const wrapper = shallowMount(GoogleSignIn);

    it('Should create', () => {
        expect(wrapper).toBeDefined();
    });
});
