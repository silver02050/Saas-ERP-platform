// import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";



export const createBranch = async (data) => {
  console.log("Create Fn run")
  await axios
    .post("/api/admins/branch", data)
    .then((response) => {
      console.log("data", response.data); // Handle response data
      // if (response.status >= 200 || response.status < 300) {
      //   console.log("Creating Branch Success. refetching branch data.")
      //   queryClient.invalidateQueries("branchData");
      // }

      return response.data;
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
};

export const updateBranch = async (data) => {
  console.log("Update Fn run")
  await axios
    .patch("/api/admins/branch", data)
    .then((response) => {
      console.log("data", response.data); // Handle response data
      // if (response.status >= 200 || response.status < 300) {
      //   console.log("Creating Branch Success. refetching branch data.")
      //   queryClient.invalidateQueries("branchData");
      // }

      return response.data;
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
};



export const getBranch = async (email) => {

  try {
    if (!email) {
      console.log("No branch ID");
      return;
    }

    console.log("Fetching Branch");
    ///////////////
    // const { accessToken } = await getAccessToken();
    // console.log("🚀 ~ GET ~ accessToken:", accessToken)

    const res = await axios.get(`/api/admins/branch?email=${email}`);
    console.log(res.data.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admin data:", error.message);
    throw error;
  }

};

  /// For dashboard

export const getBranchData = async (_id) => {
  try {
    if (!_id) {
      console.log("No branch ID");
      return;
    }

    console.log("Fetching Branch Data");

    const res = await axios.get(`/api/admins/branch/data?id=${_id}`);
    console.log("📊",res.data.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admin data:", error.message);
    throw error;
  }
};

////////////// Fetch records

export const getRecords = async (branch, page=1, limit="10", search="") => {
  try {
    if (!branch) {
      console.log("Error");
      return;
    }

    console.log("Fetching records");

    const res = await axios.get(`/api/admins/branch/records?branch=${branch}&page=${page}&limit=${limit}&search=${search}`);
    console.log(res.data.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admin data:", error.message);
    throw error;
  }
};

///////////// Fetch activities logs

export const getActivitiesLogs = async (branch) => {
  try {
    if (!branch) {
      console.log("No Branch IDError");
      return;
    }

    console.log("Fetching Activities Logs");

    const res = await axios.get(`/api/admins/branch/activities?branch=${branch}`);
    console.log(res.data.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admin data:", error.message);
    throw error;
  }
};

///////////// KEY And NODE

export const generateKey = async (data) => {
  console.log("generateKey Fn run")
  await axios
    .patch("/api/admins/branch/key", data)
    .then((response) => {
      console.log("data", response.data); // Handle response data
      // if (response.status >= 200 || response.status < 300) {
      //   console.log("Creating Branch Success. refetching branch data.")
      //   queryClient.invalidateQueries("branchData");
      // }

      return response.data;
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
};

export const deleteKey = async (data) => {
  console.log("delete Fn run")
  await axios
    .patch("/api/admins/branch/key/delete", data)
    .then((response) => {
      console.log("data", response.data); // Handle response data
      // if (response.status >= 200 || response.status < 300) {
      //   console.log("Creating Branch Success. refetching branch data.")
      //   queryClient.invalidateQueries("branchData");
      // }

      return response.data;
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
};

export const addBranch = async (data) => {
  console.log("generateKey Fn run")
  await axios
    .patch("/api/admins/branch/node", data)
    .then((response) => {
      console.log("data", response.data); // Handle response data
      // if (response.status >= 200 || response.status < 300) {
      //   console.log("Creating Branch Success. refetching branch data.")
      //   queryClient.invalidateQueries("branchData");
      // }

      return response.data;
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
};

export const removeBranch = async (data) => {
  console.log("delete Fn run")
  await axios
    .patch("/api/admins/branch/node/delete", data)
    .then((response) => {
      console.log("data", response.data); // Handle response data
      // if (response.status >= 200 || response.status < 300) {
      //   console.log("Creating Branch Success. refetching branch data.")
      //   queryClient.invalidateQueries("branchData");
      // }

      return response.data;
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
};