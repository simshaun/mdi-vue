# Material Design Icons

This library generates path-only exports of the SVG icons provided by
https://materialdesignicons.com/

The original goal is to act as a framework-agnostic intermediate step in an
automated, framework-specific component generation process.

In other words, this library exports the path data, and other libraries
or applications use the paths however they need.

Note: This library may occasionally be out-of-sync with https://materialdesignicons.com/
if they publish new icons.

## Usage

1. Install the package.

   ```console
   npm i @foxandfly/mdi
   ```

2. Import an icon.

   ```javascript
   import MenuIcon from '@foxandfly/mdi/MenuIcon';
   ```

3. Then use it to generate something. Below is just a contrived example, not
   something this library provides.

   ```javascript
   import MenuIcon from '@foxandfly/mdi/MenuIcon';

   export default createSvgIcon(MenuIcon, 'MenuIcon');
   ```

## How to transform icons

1. Fork and/or clone this repo.

2. Install dependencies.

   ```console
   npm install
   ```

3. Run the transformation script.

   ```console
   npm run transform
   ```

## Maintenance

Simply push a new tag and the GitHub Action will generate the icons and release on NPM.