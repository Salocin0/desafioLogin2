import express from "express";
import { productService } from "../services/products.service.js";
import { UserModel } from "../DAO/models/users.model.js";

export const routerVistaProducts = express.Router();

routerVistaProducts.get("/", async (req, res) => {
  const limit = req.query.limit || 3;
  const page = req.query.page || 1;
  const query = req.query.query;
  const sort = req.query.sort;
  const requestUrl = req.originalUrl;
  const allProducts = await productService.getAllProducts(limit, page, query, sort);
  const previusLink = await productService.getPrevLink(requestUrl, page, allProducts.hasPrevPage);
  const postLink = await productService.getNextLink(requestUrl, page, allProducts.hasNextPage);
  let user = null;
  if(req.cookies.userId!="admin"){
    const userId = req.cookies.userId;
    if (userId) {
      user = await UserModel.findById(userId);
      user.rol="Usuario"
    }
    
  }else{
    user = {
      firstName:"admin",
      lastName:"admin",
      rol:"Admin",
      email:"adminCoder@coder.com",
    }
  }
  console.log(user)
  const foundUser = {
    firstName:user.firstName,
    lastName:user.lastName,
    rol:user.rol,
    email:user.email,
  }
 
  
  res.status(200).render("products", {
    p: allProducts.docs.map((product) => ({
      name: product.title,
      description: product.description,
      price: product.price,
      id: product._id
    })),
    pagingCounter: allProducts.pagingCounter,
    page: allProducts.page,
    totalPages: allProducts.totalPages,
    hasPrevPage: allProducts.hasPrevPage,
    hasNextPage: allProducts.hasNextPage,
    prevPage: allProducts.prevPage,
    nextPage: allProducts.nextPage,
    prevLink: previusLink,
    nextLink: postLink,
    user: foundUser
  });
});
