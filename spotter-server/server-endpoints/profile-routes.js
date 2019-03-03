const express = require("express");
const profileEditRoutes = express.Router();
const search = require("../search/search-spotify.js");

module.exports = function() {
  profileEditRoutes.post("/edit/:type", function(req, res) {
    let inputType = req.params.type;

    if (inputType === "username") {
      res.json({ username: req.body.username });
      return;
    }

    let inputTitle = req.body.title;

    search.searchSpotify(inputType, inputTitle).then(searchList => {
      console.log(searchList);
      res.json({ searchResults: searchList });
    });
  });

  return profileEditRoutes;
};
