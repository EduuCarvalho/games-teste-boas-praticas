import supertest from "supertest";
import app from "../src/app"
import prisma from "config/database";
import createConsole from "./factories/console.factory";
import { faker } from "@faker-js/faker";

const api = supertest(app);

beforeEach(async () => {
    await prisma.console.deleteMany({});;
  });


describe("/GET consoles", () => {

    it("should respond with status 200", async () => {
       const newConsole = await createConsole();

        const result = await api.get("/consoles");
        expect(result.status).toBe(200)
        expect(result.body).toEqual([{
            id:newConsole.id,
            name:newConsole.name
        }])
    })

})

describe("GET console by ID", () => {

    it("should response with status 404 if console no exist", async () => {
        const result = await api.get("/consoles/0");
        expect(result.status).toBe(404)
    })

    it("should response with status 200 if console exist", async () => {
        const newConsole = await createConsole();
        const result = await api.get(`/consoles/${newConsole.id}`);
        expect(result.status).toBe(200)
        expect(result.body).toEqual({
            id:newConsole.id,
            name:newConsole.name
        })
    })
})

describe("POST console", () => {

    it("should response with 409 if console already exist", async () => {
        const newConsole = await createConsole();
        const result = await api.post("/consoles").send({name:newConsole.name});
        expect(result.status).toBe(409);
    })

    it("should response with 422 if invalid body", async () => {
        const result = await api.post("/consoles").send({name:435})
        expect(result.status).toBe(422);
    })

    it("should response with 201 if sucess", async () => {
        const result = await api.post("/consoles").send({name:faker.name.firstName()});
        expect(result.status).toBe(201);
    })
})

