import { connectToDB } from "@/lib/database/connectToDB";
import ACTIVITYLOG from "@/model/activities";
import BRANCH from "@/model/branchData";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const PATCH = async (Request) => {
    try {
      const body = await Request.json();
      const { _id, branchId } = body;
      console.log("🧩 removing Node", _id, branchId);
      await connectToDB();
  
      const existingBranch = await BRANCH.findOne({ _id: branchId });

      const res = new NextResponse();
      const session = await getSession(res);
  
      if(session.user.email != existingBranch.manager){
        return NextResponse.json({
          status: 401,
          message: "Failed to update.",
          errorCode: 401,
          details: {
            error: "Unauthourized",
          },
        });
      }
  
      const updatedBranch = await BRANCH.findOneAndUpdate(
        {_id: branchId},
        { $pull: { childBranch: _id } },
        { new: true }
      );
      console.log("🚀 ~ PATCH ~ updatedBranch:", updatedBranch);
  
      if (!updatedBranch) {
        return NextResponse.json(
          { error: "Childbranch not found." },
          { status: 404 }
        );
      }
  
      const log = new ACTIVITYLOG({
        branch: branchId,
        process: "Branch Removed"
      })

      const createdLog = await log.save();

      return NextResponse.json({
        meta: {
          status: 201,
          branch: updatedBranch.companyName,
          branchId: updatedBranch._id,
        },
        data: updatedBranch,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "Internal Server Error in delete node route while updating",
          error: error,
        },
        { status: 500 }
      );
    }
  };
  