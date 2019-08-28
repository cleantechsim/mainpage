
import { Request, Response } from "express";
import { Page, NavigationModel } from "../public/js/navigation.js"

exports.index = function (req: Request, res: Response) {

    var host = "www.cleantechsim.org";

    var model: NavigationModel = {
        pages: [
	    new Page("EV market", "http://" + host + "/evmarket"),
	    new Page("EV charger stats", "http://" + host + "/evcharger_stats"),
            new Page("Energy", "http://" + host + "/under_construction")
        ],

        encodedModel: ''
    };

    model.encodedModel = JSON.stringify(model);

    return res.render('index', model);
}
