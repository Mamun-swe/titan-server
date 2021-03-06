const multer = require('multer')
const News = require('../../models/news')
var url = "http://localhost:3000"

var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/news')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname)
    }
});
var upload = multer({ storage: store }).single('file')


const createNews = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(501).json({ error: err });
        }
        const newNews = new News({
            title: req.body.title,
            content: req.body.content,
            file: req.file.filename,
            date: Date.now()
        })
        newNews.save()
            .then(data => {
                if (data) {
                    res.status(200).json({
                        success: true
                    })
                }
            })
            .catch(err => {
                if (err) {
                    res.status(501).json({
                        success: false
                    })
                }
            })
    })
}

const getNews = (req, res) => {
    News.find().sort({ _id: -1 })
        .then(docs => {
            const response = {
                images: docs.map(doc => {
                    return {
                        content: doc.content,
                        id: doc._id,
                        title: doc.title,
                        content: doc.content,
                        file: url + "/uploads/news/" + doc.file,
                        date: doc.date
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            if (err) {
                res.send({
                    message: 'error',
                    errMessage: err
                })
            }
        });
}


const removeSingleNews = (req, res) => {
    News.findByIdAndRemove({ _id: req.params.id })
        .then(data => {
            res.status(204).json({
                success: true
            })
        })
        .catch(err => {
            if (err) {
                res.send({
                    message: 'error',
                    errMessage: err
                })
            }
        })
}


const totalNewsCount = (req, res) => {
    News.count()
        .then(news => {
            res.json({
                news
            })
        })
        .catch(err => {
            if (err) {
                res.status(501).json({
                    message: 'error',
                    errMessage: err
                })
            }
        })
}

const getSingleNewsById = (req, res) => {
    News.findById({ _id: req.params.id }, { file: 0 })
        .then(news => {
            res.json({
                news
            })
        })
        .catch(err => {
            res.json({
                message: "error"
            })
        })
}

const newsUpdate = (req, res) => {
    let id = req.body._id;
    News.updateOne({ _id: id },
        {
            $set: {
                'title': req.body.title,
                'content': req.body.content
            }
        })
        .then(data => {
            if (data) {
                res.status(200).json({
                    message: 'ok'
                })
            }
        })
        .catch(err => {
            if (err) {
                res.send({
                    message: 'error',
                    errMessage: err
                })
            }
        })
}

module.exports = {
    createNews,
    getNews,
    removeSingleNews,
    totalNewsCount,
    getSingleNewsById,
    newsUpdate
}