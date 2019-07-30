import { NextFunction } from "connect";
import { Express, Request, Response } from "express";

var express = require('express');

var router = express.Router();

var home_controller = require('../controllers/homeController');

router.get('/', home_controller.index);

router.get('/under_construction', (req: Request, res: Response) => {

    res.render('under_construction')
})

module.exports = router;
