## Wizzy

![Wizard](https://media0.giphy.com/media/l0ExsgrTuACbtPaqQ/giphy.gif?cid=3640f6095bcf5bad583333314dbc1b00)

Simply CLI tool that will recursively create index files in a directory for `React` components.

## Usage

`wizzy --d=PATH__TO__YOUR__DIRECTORY`

This will crawl your directory and create `index.js` files with `ES6` exports like:

```javascript
export { default as CamelCaseDirectory } from './camel-case-directory';
```

### Note

- This follows the convention of directories separated by `dashes (-)` will translate to a `React` component using camel casing.

#### Example

```
                    bla-bloo-blob-splat -> BlaBlooBlobSplat
```

- Your current `index.js` files are safe. `Wizzy` will skip over them if they are present

- This automatically ignores any directories named `__tests__`

### Example

Using `wizzy --d=./startDir` the following folder structure

```
.
├── startDir
|   ├── form
|   |   └── form.js
|   |   ├── button
|   |   |   └── button.js
|   ├── input
|   |   └── input.js
```

will be changed to

```
.
├── startDir
|   ├── form
|   |   └── form.js
|   |   └── index.js (export { default as Form } from './form)
|   |   ├── button
|   |   |   └── button.js
|   |   |   └── index.js (export { default as Button } from './button)
|   ├── input
|   |   └── input.js
|   |   └── index.js (export { default as Input } from './input)
```
