const express = require("express")

const upload = (req, res, next) => {
    express.urlencoded({
        extended: true,
        limit: 10000,
        parameterLimit: 7,
    })(req, res, next);
};

module.exports = upload;
