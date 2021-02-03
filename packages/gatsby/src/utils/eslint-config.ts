import { printSchema, GraphQLSchema } from "graphql"
import { CLIEngine } from "eslint"
import path from "path"

const eslintRulePaths = path.resolve(`${__dirname}/eslint-rules`)
const eslintRequirePreset = require.resolve(`./eslint/required`)

export const eslintRequiredConfig: CLIEngine.Options = {
  rulePaths: [eslintRulePaths],
  useEslintrc: false,
  allowInlineConfig: false,
  // @ts-ignore
  emitWarning: true,
  baseConfig: {
    parser: require.resolve(`babel-eslint`),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: `module`,
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      graphql: true,
      __PATH_PREFIX__: true,
      __BASE_PATH__: true, // this will rarely, if ever, be used by consumers
    },
    extends: [eslintRequirePreset],
  },
}

export const eslintConfig = (
  schema: GraphQLSchema,
  usingJsxRuntime: boolean
): CLIEngine.Options => {
  return {
    useEslintrc: false,
    resolvePluginsRelativeTo: __dirname,
    rulePaths: [eslintRulePaths],
    baseConfig: {
      globals: {
        graphql: true,
        __PATH_PREFIX__: true,
        __BASE_PATH__: true, // this will rarely, if ever, be used by consumers
      },
      extends: [
        require.resolve(`eslint-config-react-app`),
        eslintRequirePreset,
      ],
      plugins: [`graphql`],
      rules: {
        // New versions of react use a special jsx runtime that remove the requirement
        // for having react in scope for jsx. Once the jsx runtime is backported to all
        // versions of react we can make this always be `off`.
        // I would also assume that eslint-config-react-app will switch their flag to `off`
        // when jsx runtime is stable in all common versions of React.
        "react/react-in-jsx-scope": usingJsxRuntime ? `off` : `error`, // Conditionally apply for reactRuntime?
        "import/no-webpack-loader-syntax": [0],
        "graphql/template-strings": [
          `error`,
          {
            env: `relay`,
            schemaString: printSchema(schema, { commentDescriptions: true }),
            tagName: `graphql`,
          },
        ],
        "react/jsx-pascal-case": `warn`,
        // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/master/docs/rules
        "jsx-a11y/accessible-emoji": `warn`,
        "jsx-a11y/alt-text": `warn`,
        "jsx-a11y/anchor-has-content": `warn`,
        "jsx-a11y/anchor-is-valid": `warn`,
        "jsx-a11y/aria-activedescendant-has-tabindex": `warn`,
        "jsx-a11y/aria-props": `warn`,
        "jsx-a11y/aria-proptypes": `warn`,
        "jsx-a11y/aria-role": `warn`,
        "jsx-a11y/aria-unsupported-elements": `warn`,
        // TODO: It looks like the `autocomplete-valid` rule hasn't been published yet
        // "jsx-a11y/autocomplete-valid": [
        //   "warn",
        //   {
        //     inputComponents: [],
        //   },
        // ],
        "jsx-a11y/click-events-have-key-events": `warn`,
        "jsx-a11y/control-has-associated-label": [
          `warn`,
          {
            ignoreElements: [
              `audio`,
              `canvas`,
              `embed`,
              `input`,
              `textarea`,
              `tr`,
              `video`,
            ],
            ignoreRoles: [
              `grid`,
              `listbox`,
              `menu`,
              `menubar`,
              `radiogroup`,
              `row`,
              `tablist`,
              `toolbar`,
              `tree`,
              `treegrid`,
            ],
            includeRoles: [`alert`, `dialog`],
          },
        ],
        "jsx-a11y/heading-has-content": `warn`,
        "jsx-a11y/html-has-lang": `warn`,
        "jsx-a11y/iframe-has-title": `warn`,
        "jsx-a11y/img-redundant-alt": `warn`,
        "jsx-a11y/interactive-supports-focus": [
          `warn`,
          {
            tabbable: [
              `button`,
              `checkbox`,
              `link`,
              `progressbar`,
              `searchbox`,
              `slider`,
              `spinbutton`,
              `switch`,
              `textbox`,
            ],
          },
        ],
        // "jsx-a11y/label-has-for": `warn`, was deprecated and replaced with jsx-a11y/has-associated-control in v6.1.0
        "jsx-a11y/label-has-associated-control": `warn`,
        "jsx-a11y/lang": `warn`,
        "jsx-a11y/media-has-caption": `warn`,
        "jsx-a11y/mouse-events-have-key-events": `warn`,
        "jsx-a11y/no-access-key": `warn`,
        "jsx-a11y/no-autofocus": `warn`,
        "jsx-a11y/no-distracting-elements": `warn`,
        "jsx-a11y/no-interactive-element-to-noninteractive-role": `warn`,
        "jsx-a11y/no-noninteractive-element-interactions": [
          `warn`,
          {
            body: [`onError`, `onLoad`],
            iframe: [`onError`, `onLoad`],
            img: [`onError`, `onLoad`],
          },
        ],
        "jsx-a11y/no-noninteractive-element-to-interactive-role": `warn`,
        "jsx-a11y/no-noninteractive-tabindex": `warn`,
        "jsx-a11y/no-onchange": `warn`,
        "jsx-a11y/no-redundant-roles": `warn`,
        "jsx-a11y/no-static-element-interactions": `warn`,
        "jsx-a11y/role-has-required-aria-props": `warn`,
        "jsx-a11y/role-supports-aria-props": `warn`,
        "jsx-a11y/scope": `warn`,
        "jsx-a11y/tabindex-no-positive": `warn`,
      },
    },
  }
}
