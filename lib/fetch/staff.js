import axios from "axios";



export const createStaff = async (data) => {
  console.log("Create Fn run")
  await axios
    .post("/api/admins/branch/staffs", data)
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
export const updateStaff = async (data) => {
  console.log("Update Fn run")
  await axios
    .patch("/api/admins/branch/staffs", data)
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

export const getStaff = async (branch, page=1, limit="10", search="") => {
  try {
    if (!branch) {
      console.log("Error");
      return;
    }

    console.log("Fetching products");

    const res = await axios.get(`/api/admins/branch/staffs?branch=${branch}&page=${page}&limit=${limit}&search=${search}`);
    console.log(res.data.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching staff data:", error.message);
    throw error;
  }
};

export const removeStaff = async (data) => {
  const { _id } = data;
  console.log("🚀 ~ removeStaff ~ data:", data);
  console.log("delete Fn run");
  
  await axios
    .delete(`/api/admins/branch/staffs?id=${_id}`)
    .then((response) => {
      console.log("data", response.data); 
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
};
