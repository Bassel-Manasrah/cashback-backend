function saveToCashBack(
  phoneNumber: string,
  numberOfLines: number,
  packageId: number,
  createdBy: string,
  fullName: string
): void {
  const url = "https://www.zolzolzol.co.il/api/saveCashBack";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const body = new URLSearchParams({
    date: currentDate,
    phone_number: phoneNumber,
    number_of_lines: numberOfLines.toString(),
    packageId: packageId.toString(),
    createdBy: createdBy.toString(),
    full_name: fullName,
  });

  fetch(url, {
    method: "POST",
    headers,
    body,
  })
    .then(async (response) => {
      const responseData = await response.text(); // Use .json() if the server returns JSON
      if (response.ok) {
        console.log("Request succeeded:", responseData);
      } else {
        console.error(
          "Request failed with status",
          response.status,
          ":",
          responseData
        );
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
    });
}

export default saveToCashBack;
