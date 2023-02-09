import supertest from "supertest";
import app from "../src/app"
import prisma from "config/database";
import { faker } from "@faker-js/faker";
import createGame from "./factories/games.factory";
import createConsole from "./factories/console.factory";

const api = supertest(app);

beforeEach(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({})
  });

  describe("/GET games", () => {

    it("should respond with status 200", async () => {
        const newConsole = await createConsole();
       const newGame = await createGame(newConsole.id);

        const result = await api.get("/games");
        expect(result.status).toBe(200)
        expect(result.body).toEqual([{
            id:newGame.id,
            title:newGame.title,
            consoleId:newGame.consoleId,
            Console: {
                id: newConsole.id,
                name:newConsole.name
            }
        }])
    })

})
describe("GET game by ID" ,() => {

    it("should response with status 404 if game no exist", async () => {
        const result = await api.get("/games/0");
        expect(result.status).toBe(404)
    })

    it("should response with status 200 if game exist", async () => {
        const newConsole = await createConsole();
        const newGame = await createGame(newConsole.id);
        const result = await api.get(`/games/${newGame.id}`);
        expect(result.status).toBe(200)
        expect(result.body).toEqual({
            id:newGame.id,
            title:newGame.title,
            consoleId:newGame.consoleId,
        })
    })
})

describe("POST game", () => {

    it("should response with 409 if game already exist", async () => {
        const newConsole = await createConsole();
        const newGame = await createGame(newConsole.id);
        const result = await api.post("/games").send({title:newGame.title,consoleId:newConsole.id});
        expect(result.status).toBe(409);
    })

    it("should response with 422 if invalid body", async () => {
        const newConsole = await createConsole();
        const result = await api.post("/games").send({title:435,consoleId:newConsole.id})
        expect(result.status).toBe(422);
    })
    it("should response with 409 if console Id not exist", async () => {
        const result = await api.post("/games").send({title:faker.name.firstName(),consoleId:0})
        expect(result.status).toBe(409);
    })

    it("should response with 201 if sucess", async () => {
        const newConsole = await createConsole();
        const result = await api.post("/games").send({title:faker.name.firstName(),consoleId:newConsole.id});
        expect(result.status).toBe(201);
    })
})
