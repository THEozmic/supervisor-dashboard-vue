import { shallowMount } from '@vue/test-utils'
import Dashboard from '@/components/Dashboard.vue'

describe('Dashboard.vue', () => {
  it('matches snapshot', () => {
    const wrapper = shallowMount(Dashboard)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
