import { shallowMount } from '@vue/test-utils'
import DataTable from '@/components/DataTable.vue'
import faker from 'faker';

describe('DataTable.vue', () => {

  const items = [
    {
      id: "17019E51-E9B9-2E41-ECA4-3691F74BABA1",
      name: "Zizzy Walsh",
      description: "Mauris",
      date: "2017-07-18T08:53:37-07:00",
      amount: 946.99
    }, {
      id: "C0DC95CC-E432-998F-05EB-8BC8D37F0FCF",
      name: "Athena Smith",
      description: "id risus quis diam luctus lobortis. Class aptent taciti",
      date: "2018-12-07T07:08:35-08:00",
      amount: 594.32
    }]

  it('renders tr for each item in props.items + the header', () => {
    const wrapper = shallowMount(DataTable, {
      propsData: { items }
    })
    expect(wrapper.findAll('tr')).toHaveLength(items.length + 1)
  })

  it('sorts the table in the expected order when a "th" is clicked', () => {
    const wrapper = shallowMount(DataTable, {
      propsData: { items }
    })
    wrapper.find('th:nth-child(2)').trigger('click')
    expect(wrapper.vm.localItems[0]).toBe(items[1])
  })

  it('filters the table when a search is made', () => {
    const wrapper = shallowMount(DataTable, {
      propsData: { items }
    })
    const input = wrapper.find('.search-box');
    input.setValue('Athena Smith')
    expect(wrapper.vm.localItems).toHaveLength(1)
  })

  it('creates editable cell(s) depending on the flags set', () => {
    const wrapper = shallowMount(DataTable, {
      propsData: {
        items, flags: {
          name: {
            isEditable: true
          }
        }
      }
    })
    expect(wrapper.findAll('textarea.table-value')).toHaveLength(2)
  })

  it('updates the shown records according to the selected rows per page', () => {
    let items = []
    for (let i = 0; i < 13; i++) {
      items.push({
        id: faker.random.uuid(),
        name: faker.fake('{{name.lastName}}, {{name.firstName}}'),
        description: faker.lorem.sentence(),
        date: faker.date.past(),
        amount: faker.finance.amount()
      })
    }
    const wrapper = shallowMount(DataTable, {
      propsData: {
        items, flags: {
          name: {
            isEditable: true
          }
        }
      }
    })
    let option = wrapper.find('option[value="50"]')
    option.element.selected = true
    wrapper.find('.pagination__options').trigger('change')
    expect(wrapper.vm.localItems).toHaveLength(13)

    option = wrapper.find('option[value="10"]')
    option.element.selected = true
    wrapper.find('.pagination__options').trigger('change')
    expect(wrapper.vm.localItems).toHaveLength(10)
  })

  it('correctly updates the shown records when navigating the pages', () => {
    let items = []
    for (let i = 0; i < 100; i++) {
      items.push({
        id: faker.random.uuid(),
        name: faker.fake('{{name.lastName}}, {{name.firstName}}'),
        description: faker.lorem.sentence(),
        date: faker.date.past(),
        amount: faker.finance.amount()
      })
    }

    const wrapper = shallowMount(DataTable, {
      propsData: {
        items
      }
    })

    let option = wrapper.find('option[value="10"]')
    option.element.selected = true
    wrapper.find('.pagination__options').trigger('change')

    wrapper.findAll('.controls-icon').at(1).trigger('click')
    expect(wrapper.vm.localItems[0]).toBe(items[10])
    wrapper.findAll('.controls-icon').at(0).trigger('click')
    expect(wrapper.vm.localItems[0]).toBe(items[0])
  })

  it('disables the page navigation correctly', () => {
    let items = []
    for (let i = 0; i < 100; i++) {
      items.push({
        id: faker.random.uuid(),
        name: faker.fake('{{name.lastName}}, {{name.firstName}}'),
        description: faker.lorem.sentence(),
        date: faker.date.past(),
        amount: faker.finance.amount()
      })
    }
    const wrapper = shallowMount(DataTable, {
      propsData: {
        items, flags: {
          name: {
            isEditable: true
          }
        }
      }
    })
    expect(wrapper.findAll('.controls-icon').at(0).classes())
      .toContain('disabled')


    let option = wrapper.find('option[value="50"]')
    option.element.selected = true
    wrapper.find('.pagination__options').trigger('change')

    wrapper.findAll('.controls-icon').at(1).trigger('click')

    expect(wrapper.findAll('.controls-icon').at(1).classes())
      .toContain('disabled')
  })

  it('matches snapshot', () => {
    const items = [{
      id: "C0DC95CC-E432-998F-05EB-8BC8D37F0FCF",
      name: "Eve Bryan",
      description: "id risus quis diam luctus lobortis. Class aptent taciti",
      date: "2018-12-07T07:08:35-08:00",
      amount: 594.32
    },
    {
      id: "17019E51-E9B9-2E41-ECA4-3691F74BABA1",
      name: "Denise Walsh",
      description: "Mauris",
      date: "2017-07-18T08:53:37-07:00",
      amount: 946.99
    }]
    const wrapper = shallowMount(DataTable, {
      propsData: { items }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
