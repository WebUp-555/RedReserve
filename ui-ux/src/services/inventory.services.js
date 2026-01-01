const API_URL = "http://localhost:5000/api/inventory"; 
// later replace with deployed backend URL

export const getInventory = async (token) => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization:` Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch inventory");
  }

  return res.json();
};

export const updateInventory = async (data, token) => {
  const res = await fetch(API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update inventory");
  }

  return res.json();
};