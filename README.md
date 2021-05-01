# Material Design Icons

This library generates Vue 3 components for the icons provided by
https://materialdesignicons.com/

Note: This library may occasionally be out-of-sync with https://materialdesignicons.com/
if they publish new icons.

## Usage

1. Install the package.

   ```console
   npm i @foxandfly/mdi-vue
   ```

2. Import an icon component.

   * Option 1:

   ```javascript
   import MdiMenu from '@foxandfly/mdi-vue/icons/MdiMenu';
   ```

   * Option 2:

   ```javascript
   import { MdiMenu } from '@foxandfly/mdi-vue';
   ```

   > Option 1 is safer to use, but Option 2 is a bit cleaner. Make sure you utilize
     tree shaking if using the second approach or you will end up with a multi-MB bundle.

3. Then use it somewhere. e.g.

   ```html
   <template>
    <button>
      <MdiMenu />
      Menu
    </button>
   </template>

   <script>
   import { MdiMenu } from '@foxandfly/mdi-vue';
   import { defineComponent } from 'vue'

   export default defineComponent({
     components: {
       MdiMenu,
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