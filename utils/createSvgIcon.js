import { h } from 'vue'

export default function (name, innerHTML) {
  return {
    name,
    render() {
      return h('svg', {
        class: 'mdi-icon',
        focusable: 'false',
        viewBox: '0 0 24 24',
        'aria-hidden': this.title ? null : true,
        role: this.title ? 'img' : null,
        innerHTML: this.innerHTML,
      })
    },
    props: { title: { type: String, required: false, default: '' } },
    computed: {
      innerHTML() {
        return innerHTML + (this.title ? '<title>' + this.title + '</title>' : '')
      },
    },
  }
}
