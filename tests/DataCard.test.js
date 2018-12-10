import { shallowMount } from '@vue/test-utils'
import DataCard from '@/components/DataCard.vue'

describe('DataCard.vue', () => {

  it('applies correct color class', () => {
    const wrapper = shallowMount(DataCard, {
      propsData: { title: 'Test title', content: 'Test content', color: 'blue' }
    })
    expect(wrapper.find('.card').classes()).toContain('card--blue')
  })

  it('matches snapshot', () => {
    const wrapper = shallowMount(DataCard, {
      propsData: { title: 'Test title', content: 'Test content', color: 'blue' }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
