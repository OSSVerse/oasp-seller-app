//require('dotenv').config();

const nodeEnvironment = process.env.NODE_ENV || 'development';
const projectBaseDirectory = global.__basedir;
const appEnvironment = process.env.APP_ENV ?? 'local';


//console.log("===========process.env.NODE_ENV========", process.env.NODE_ENV);
//console.log("===========process.env.APP_ENV========", process.env.APP_ENV);
if (appEnvironment === 'local') {
    require('dotenv').config();
}

console.log("=======appEnvironment========", appEnvironment);
console.log("===========process.env.NODE_ENV========", process.env.NODE_ENV);
console.log("===========process.env.APP_ENV========", process.env.APP_ENV);

const environmentConfig = require('./environments/base');
const mergedEnvironmentConfig = {
    ...environmentConfig,
    nodeEnvironment,
    appEnvironment,
    projectBaseDirectory,
};
Object.freeze(mergedEnvironmentConfig);
exports.mergedEnvironmentConfig = mergedEnvironmentConfig;
