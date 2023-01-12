const fs = require("fs");
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'ap-south-1' });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
function readS3File(path) {
    return new Promise(function (resolve, reject) {
        s3.getObject({ Bucket: process.env.BUCKET_NAME, Key: `public${path}` }, (err, fdata) => {
            if (err) {
                console.log(err);
                reject("error")
            } else {
                resolve(fdata);
            }
        })
    })
}
async function uploadFileManager(req,res,next) {
    if (!(req.file && req.file.filename)) return next();
    console.log(req.file.aws_filename);
    const body = fs.readFileSync(`${__dirname}/${req.file.aws_filename}`);
    const key = `${req.file.aws_filename}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body:body
    }
    s3.upload(params,async (err, data) => {
        if (err) {
            console.log(err);
            next();
        } else {
            fs.unlinkSync(`${__dirname}/${req.file.aws_filename}`);
            next();
        }
    });
}
async function uploadFile(filename) {
    if (!filename) return "done";
    const body = fs.readFileSync(`${__dirname}/${filename}`);
    const key = `${filename}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: body
    }
    s3.upload(params, async (err, data) => {
        if (err) {
            console.log(err);
            return;
        } else {
            fs.unlinkSync(`${__dirname}/${filename}`);
            return;
        }
    });
}
function readS3FileServer(req,res) {
    s3.getObject({ Bucket: process.env.BUCKET_NAME, Key: `public${decodeURI(req.path)}` }, (err, fdata) => {
        if (err) {
            console.log(err);
            console.log(decodeURI(req.path))
            res.sendStatus(500);
        } else {
            res.set("Content-Type", fdata.ContentType);
            res.set("Content-Length", fdata.ContentLength);
            res.set("Accept-Ranges", fdata.AccesptRanges);
            res.set("Last-Modified", fdata.LastModified);
            res.set("ETag", fdata.ETag);
            res.send(fdata.Body);
        }
    })
}
module.exports = { readS3File,readS3FileServer,uploadFileManager ,uploadFile};
