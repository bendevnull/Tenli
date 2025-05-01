const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'app.log');
const errorLogFilePath = path.join(__dirname, 'error.log');

// Create a write stream for the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
const errorLogStream = fs.createWriteStream(errorLogFilePath, { flags: 'a' });

export default class Logger {
    static log(message: string, ...optionalParams: any[]) {
        const date = new Date();
        const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(`[${formattedDate}] ${message}`);
        logStream.write(`[${formattedDate}] ${message}\n`);
    }

    static error(message: string, ...optionalParams: any[]) {
        const date = new Date();
        const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.error(`[${formattedDate}] ERROR: ${message}`);
        errorLogStream.write(`[${formattedDate}] ERROR: ${message}\n`);
        logStream.write(`[${formattedDate}] ERROR: ${message}\n`);
    }

    static warn(message: string, ...optionalParams: any[]) {
        const date = new Date();
        const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.warn(`[${formattedDate}] WARNING: ${message}`);
        logStream.write(`[${formattedDate}] WARNING: ${message}\n`);
    }
}