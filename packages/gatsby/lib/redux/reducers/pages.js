const _ = require("lodash");

module.exports = (state = [], action) => {
  switch (action.type) {
    case "UPSERT_PAGE":
      const index = _.findIndex(state, p => {
        return p.path === action.payload.path;
      });
      // If the path already exists, overwrite it.
      // Otherwise, add it to the end.
      if (index !== -1) {
        return [
          ...state
            .slice(0, index)
            .concat(action.payload)
            .concat(state.slice(index + 1)),
        ];
      } else {
        return [...state.concat(action.payload)];
      }
    default:
      return state;
  }
};
