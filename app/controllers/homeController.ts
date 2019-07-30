
import { Request, Response } from "express";
import { Page, NavigationModel } from "../public/js/navigation.js"

exports.index = function (req: Request, res: Response) {

    var model: NavigationModel = {
        pages: [
            new Page("EV market", "http://localhost:5001"),
            new Page("EV chargers", "http://localhost:3000/under_construction"),
            new Page("Energy", "http://localhost:3000/under_construction")
        ],

        encodedModel: ''
    };

    model.encodedModel = JSON.stringify(model);

    return res.render('index', model);
}