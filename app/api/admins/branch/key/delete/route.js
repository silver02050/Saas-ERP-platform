import { connectToDB } from "@/lib/database/connectToDB";
import ACTIVITYLOG from "@/model/activities";
import BRANCH from "@/model/branchData";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const PATCH = async (Request) => {
    try {
      const body = await Request.json();
      const { _id, branchId } = body;
      console.log("🗝️ Deleting KEY", _id, branchId);
      await connectToDB();
  
      const existingBranch = await BRANCH.findOne({ _id: branchId });

      const res = new NextResponse();
      const session = await getSession(res);
  
      if(session.user.email != existingBranch.manager){
        return NextResponse.json({
          status: 401,
          message: "Failed to delete.",
          errorCode: 401,
          details: {
            error: "Unauthourized",
          },
        });
      }
  
      const updatedBranch = await BRANCH.findOneAndUpdate(
        {_id: branchId},
        { $pull: { keys: {_id: _id} } },
        { new: true }
      );
      console.log("🚀 ~ PATCH ~ updatedBranch:", updatedBranch);
  
      if (!updatedBranch) {
        return NextResponse.json(
          { error: "Branch with deleted key not found." },
          { status: 404 }
        );
      }

      const log = new ACTIVITYLOG({
        branch: branchId,
        process: "Key Removed"
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
          message: "Internal Server Error in delete key route while updating",
          error: error,
        },
        { status: 500 }
      );
    }
  };
  