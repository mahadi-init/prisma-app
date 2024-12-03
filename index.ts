import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import prisma from "./prisma/client";

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(morgan("dev"));

// root api endpoint
app.get("/", (_, res) => {
  res.status(200).send("API IS OK");
});

// GET
app.get("/books", async (_, res, next) => {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

//POST
app.post("/create", async (req, res, next) => {
  try {
    const { name, author, price } = req.body;

    const books = await prisma.book.create({
      data: {
        name: name,
        author: author,
        price: price,
      },
    });

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

//UPDATE
app.put("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, author, price } = req.body;

    const books = await prisma.book.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        author: author,
        price: price,
      },
    });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

//DELETE
app.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const books = await prisma.book.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
