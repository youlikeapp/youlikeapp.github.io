# you-like-app

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Vue style guide notes:

-   Base components (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with a specific prefix, such as Base, App, or V.
    MyButton (wrong),
    VButton, AppButton, BaseButton (fine)

-   Components that should only ever have a single active instance should begin with the The prefix, to denote that there can be only one.

-   Child components that are tightly coupled with their parent should include the parent component name as a prefix.

-   Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

-   Prop names should always use camelCase during declaration, but kebab-case in templates and JSX.

-   Directive shorthands (: for v-bind:, @ for v-on: and # for v-slot) should be used always or never.
