const path = require('path');

let project = 'mobile';
if (process.env.npm_config_project){
    project=process.env.npm_config_project;
}
console.log("当前项目为",project)
module.exports = function(merge){
    let projectConfig = {};
    switch (project){
    case "mobile":
        projectConfig= require("./mobile/index.js")
        break;
    case "pc":
        projectConfig= require("./pc/index.js")
        break;
    case "ww":
        projectConfig= require("./ww/index.js")

        break;
    }

    if (process.env.NODE_ENV === 'development'){
        return merge({},projectConfig,require('./dev'))
    }
    return merge({},projectConfig,require('./prod'))
}
