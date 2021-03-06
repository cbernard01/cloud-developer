import express, {Router, Request, Response} from 'express';
import bodyParser from 'body-parser';

import {Car, cars as cars_list} from './cars';

(() => {
  let cars: Car[] = cars_list;

  //Create an express application
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies
  //are accessible as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name", (req: Request, res: Response) => {
    let {name} = req.params;

    if (!name) return res.status(400).send(`name is required`);
    else return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let {name} = req.query;

    if (!name) return res.status(400).send(`name is required`);
    else return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post("/persons", (req: Request, res: Response) => {
    const {name} = req.body;

    if (!name) return res.status(400).send(`name is required`);
    else return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query parameter
  app.get("/cars", (req: Request, res: Response) => {
    const {make} = req.query;
    let car_list = cars;

    if (make) car_list = cars.filter(car => car.make == make);
    return res.status(200).send(car_list);
  });


  // @TODO Add an endpoint to get a specific car
  // it should require id
  app.get("/cars/:id", (req: Request, res: Response) => {
    const {id} = req.params;

    if (!id) return res.status(404).send(`id is required`);

    const car = cars.filter(car => car.id === Number(id));

    if (car && car.length === 0) return res.status(200).send(`car with ID: ${id} not found`);
    else return res.status(200).send(car);
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, make, type, model, and cost
  app.post("/cars", (req: Request, res: Response) => {
    const {id, make, type, model, cost} = req.body;

    if (!id || !make || !type || !model || !cost) return res.status(400).send(`Please enter all values`);

    let new_car: Car = {type, make, model, id, cost};
    cars.push(new_car);
    return res.status(200).send(cars);
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
