const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeList");

router.get("/", (req, res) => {
  res.json({ items });
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.json({ newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    const listedItem = items.find((item) => item.name === req.params.name);
    if (listedItem === undefined) throw new ExpressError("Item not found", 404);
    return res.json({ item: listedItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    const listedItem = items.find((item) => item.name === req.params.name);
    if (listedItem === undefined) throw new ExpressError("Item not found", 404);
    listedItem.name = req.body.name;
    listedItem.price = req.body.price;
    return res.json({ item: listedItem });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  try {
    const listedItem = items.find((item) => item.name === req.params.name);
    if (listedItem === undefined) throw new ExpressError("Item not found", 404);
    items.splice(listedItem, 1);
    return res.json({ message: "Deleted" });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
