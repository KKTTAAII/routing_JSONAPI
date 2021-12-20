process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeList");

let mockItem = { name: "tv", price: 899 };

beforeEach(function () {
  items.push(mockItem);
});

afterEach(function () {
  items.length = 0;
});

describe("GET items", () => {
  test("Get all items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [mockItem] });
  });
});

describe("GET an item", () => {
  test("Get item by name", async () => {
    const resp = await request(app).get(`/items/${mockItem.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item: mockItem });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/dhsigndskj`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST new item", () => {
  test("Add a new item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Dog", price: 59 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ newItem: { name: "Dog", price: 59 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH item", () => {
  test("Updating item", async () => {
    const res = await request(app)
      .patch(`/items/${mockItem.name}`)
      .send({ name: "sofa", price: 599 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "sofa", price: 599 } });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app)
      .patch(`/items/dngjkgn`)
      .send({ name: "washer" });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE item", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${mockItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
    expect(items).toEqual([]);
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/sbgdfh`);
    expect(res.statusCode).toBe(404);
  });
});
