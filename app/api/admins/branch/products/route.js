import BRANCH from "@/model/branchData";
import ADMIN from "@/model/admin";
import { NextResponse, NextRequest } from "next/server";

import { connectToDB } from "@/lib/database/connectToDB";
import PRODUCT from "@/model/product";
import { getSession } from "@auth0/nextjs-auth0";

/// /api/admins/branch/products
export const POST = async (Request) => {
  try {
    const body = await Request.json();
    const { name, description, category, price, quantity, notes, email } = body;
    console.log(
      "👽 Creating a new Product = ",
      name,
      description,
      category,
      price,
      quantity,
      notes,
      email
    );
    await connectToDB();
    const branch = await BRANCH.findOne({ manager: email }); //check whether the branch was exist with given mananger email
    
    if (!branch) {
      return NextResponse.json(
        { error: "Branch doesn't exist." },
        { status: 404 }
      );
    }
    
    const res = new NextResponse();
    const session = await getSession(res);

    if(session.user.email != branch.manager){
      return NextResponse.json({
        status: 401,
        message: "Failed to add product.",
        errorCode: 401,
        details: {
          error: "Unauthourized",
        },
      });
    }

    const newProduct = new PRODUCT({
      name: name,
      description: description,
      category: category,
      price: price,
      quantity: quantity,
      notes: notes,
      branch: branch._id,
    });
    const createdProduct = await newProduct.save();
    console.log("🚀 ~ POST ~ createdProduct:", createdProduct)

    return NextResponse.json({
      meta: {
        status: 201,
        branch: createdProduct.branch,
        productId: createdProduct._id,
      },
      data: { createdProduct },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error in Creating Product", error: error },
      { status: 500 }
    );
  }
};

export const PATCH = async (Request) => {
  try {
    const body = await Request.json();
    const { _id, name, description, category, price, quantity, notes } =
      body;
    console.log(
      "👽 Updating a Product = ",
      _id,
      name,
      description,
      category,
      price,
      quantity,
      notes
    );
    await connectToDB();

    const existingProduct = await PRODUCT.findById({ _id: _id });
    // console.log("🚀 ~ PATCH ~ existingBranch:", existingBranch)

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product didn't found." },
        { status: 401 }
      );
    }

    const updateFields = {};

    /// This filter unmatched values before actual update to db
    for (const key in body) {
      if (body.hasOwnProperty(key) || existingProduct.hasOwnProperty(key)) {
        if (existingProduct[key] !== body[key]) {
          updateFields[key] = body[key];
        }
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "There is no updated fields." },
        { status: 422 }
      );
    }

    const updatedProduct = await PRODUCT.findOneAndUpdate(
      { _id: _id },
      { $set: updateFields },
      { new: true }
    );
    console.log("🚀 ~ PATCH ~ updateFields:", updateFields);
    console.log("🚀 ~ PATCH ~ updatedProduct:", updatedProduct);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // console.log(createdBranch);
    return NextResponse.json({
      meta: {
        status: 201,
        branch: updatedProduct.branch,
        productId: updatedProduct._id,
      },
      data: { updatedProduct },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error in product route while updating",
        error: error,
      },
      { status: 500 }
    );
  }
};

///// Get Products Data with pagination
//// `/api/admins/branch/products?branch=${branch}&page=${page}&limit=${limit}`
export const GET = async (req, res) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Extract query parameters
    const search = searchParams.get("search");
    const branch = searchParams.get("branch");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Connect to the database
    await connectToDB();
    console.log(
      "🚀 ~ GET ~ search:",
      search,
      "Branch: ",
      branch,
      "Page:",
      page,
      "limit:",
      limit
    );

    // Count total documents
    const totalProducts = await PRODUCT.countDocuments({ branch });

    // Validate pagination
    if ((page - 1) * limit > totalProducts) {
      return NextResponse.json({
        status: "204",
        message: "Failed to retrieve product data.",
        errorCode: 204,
        details: {
          error: "Product doesn't exist",
        },
      });
    }

    if(limit == 9999){
      if(search.length < 1){
        return NextResponse.json({
          meta: {
            status: 201,
            message:
              "This must be search operation done by branch.",
            totalProducts: 0,
            branchId: branch,
          },
          data: [],
        });
      }
    }

    // Construct query
    let query = { branch };
    if (search) {
      query = {
        $and: [
          { branch },
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
              { notes: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    }

    const products = await PRODUCT.find(query)
      .skip(search ? 0 : (page - 1 ) * limit)
      .limit(search ? undefined : parseInt(limit));

    console.log("🚀 ~ GET ~ query:", query);

    // Return response
    return NextResponse.json({
      meta: {
        status: 201,
        message:
          "If this was a search operation, page and limit will be neglected.",
        ...(!search == undefined && { page: page }),
        ...(!search == undefined && { count: limit }),
        totalProducts,
        branchId: branch,
      },
      data: { products },
    });
  } catch (error) {
    throw error;
  }
};
