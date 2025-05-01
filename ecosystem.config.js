require("dotenv").config();

module.exports = {
    apps : [{
        name   : `tenli-${process.env.NODE_ENV === "development" ? "dev" : "prod"}`,
        script : "npm run dev"
    }]
}