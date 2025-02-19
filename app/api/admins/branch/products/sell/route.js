import { connectToDB } from "@/lib/database/connectToDB";
import BRANCH from "@/model/branchData";
import PRODUCT from "@/model/product";
import RECORD from "@/model/record";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const PATCH = async (Request) => {
  try {
    const body = await Request.json();
    const { _id, quantity, sellNotes } =
      body;
    console.log(
      "🧾 Selling a Product = ",
      _id,
      quantity,
      sellNotes
    );
    await connectToDB();

    const existingProduct = await PRODUCT.findById({ _id: _id });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product didn't found." },
        { status: 401 }
      );
    }

    const existingBranch = await BRANCH.findOne({ _id: existingProduct.branch });

    const res = new NextResponse();
    const session = await getSession(res);

    if(session.user.email != existingBranch.manager){
      return NextResponse.json({
        status: 401,
        message: "Failed.",
        errorCode: 401,
        details: {
          error: "Unauthourized",
        },
      });
    }

    let afterSaleQuantity = existingProduct.quantity - quantity;

    console.log("🚀 ~ PATCH ~ afterSaleQuantity:", afterSaleQuantity);

    if (afterSaleQuantity < 0) {
      return NextResponse.json(
        { error: "There is no enough unit." },
        { status: 400 }
      );
    }

    const soldProduct = await PRODUCT.findOneAndUpdate(
      { _id: _id },
      { $set: { quantity: afterSaleQuantity } },
      { new: true }
    );

    if (soldProduct) {
      const record = await RECORD.create({
        productName: soldProduct.name,
        category: soldProduct.category,
        quantity: quantity,
        totalPrice: soldProduct.price * quantity,
        sellNotes: sellNotes,
        branch: soldProduct.branch,
      });
      console.log("🚀 ~ PATCH ~ record:", record);
    }

    if (afterSaleQuantity < 1) {
      console.log("🚀 ~ PATCH ~ afterSaleQuantity2:", afterSaleQuantity);
      const deleteProduct = await PRODUCT.findByIdAndDelete({ _id });
      console.log("🚀 ~ PATCH ~ deleteProduct:", deleteProduct);
      return NextResponse.json({
        meta: {
          status: 204,
          message: `"Deleted product ${soldProduct.productName}`,
          branch: soldProduct.branch,
          productId: soldProduct._id,
        },
        data: { soldProduct },
      });
    }
    console.log("🚀 ~ PATCH ~ soldProduct:", soldProduct);

    if (!soldProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // console.log(createdBranch);
    return NextResponse.json({
      meta: {
        status: 201,
        branch: soldProduct.branch,
        productId: soldProduct._id,
      },
      data: { soldProduct },
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
