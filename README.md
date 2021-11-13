# Material Design Icons

[![npm](https://img.shields.io/npm/v/@foxandfly/mdi-vue)](https://www.npmjs.com/package/@foxandfly/mdi-vue)

This library generates Vue 3 components for Google's Material Design icons library.
https://github.com/google/material-design-icons

## Usage

1. Install the package.

   ```console
   npm i @foxandfly/mdi-vue
   ```

2. Import an icon component.

   * Option 1:

   ```javascript
   import Map from '@foxandfly/mdi-vue/Map';
   ```

   * Option 2:

   ```javascript
   import { Map } from '@foxandfly/mdi-vue';
   ```

   > Option 1 is safer to use, but Option 2 is a bit cleaner. Make sure you utilize
     tree shaking if using the second approach or you will end up with a multi-MB bundle.

3. Then use it somewhere. e.g.

   ```html
   <template>
    <button>
      <Map />
      Map
    </button>
   </template>

   <script>
   import { Map } from '@foxandfly/mdi-vue';
   import { defineComponent } from 'vue'

   export default defineComponent({
     components: {
       Map,
     },
   })
   </script>
   ```

## How to generate icons

1. Fork and/or clone this repo.

2. Install dependencies.

   ```console
   npm install
   ```

3. Run the generator script.

   ```console
   npm run generate
   ```

## Maintenance

Simply push a new tag and the GitHub Action will generate the components and release on NPM.