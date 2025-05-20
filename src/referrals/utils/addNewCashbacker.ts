const addNewCashbacker = async (name: string, phoneNumber: string) => {
  const url = "https://www.zolzolzol.co.il/api/addNewCashbacker";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({
    name: name,
    phone: phoneNumber,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (response.ok) {
      const data = await response.json();
      const id = data.data.id;
      console.log("CASHBACKER ID:", id);
      return id;
    } else {
      console.error(
        "Request failed with status",
        response.status,
        ":",
        await response.text()
      );
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export default addNewCashbacker;
