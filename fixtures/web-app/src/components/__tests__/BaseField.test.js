import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseField from '../ui/BaseField.vue';

describe('BaseField', () => {
  it('associates the error message with the input', () => {
    const wrapper = mount(BaseField, {
      props: { id: 'email', label: 'Email', error: 'Enter an email address' },
    });
    const input = wrapper.get('input');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('email-error');
    expect(wrapper.get('#email-error').text()).toBe('Enter an email address');
  });

  it('labels the input', () => {
    const wrapper = mount(BaseField, { props: { id: 'name', label: 'Name' } });
    expect(wrapper.get('label').attributes('for')).toBe('name');
  });
});
