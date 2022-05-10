export async function _makeRequest({ url, reqBody }) {

  const result = {
    body: null,
    success: false,
    errorMessage:"Something Went wrong"
  }
  try {

    const data = JSON.stringify(reqBody);

    const payload = {
      method: "post",
      body: data,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const rbody = await fetch(url, payload);
    let response = await rbody.json();

    if (response.errors) {
      result.errorMessage = response.errors
      return result
    }

    if (response.data) {
      result.body = response.data
      result.success = true
      result.errorMessage = null
      return result
    }
  } catch (error) {
    console.log(error);
    result.errorMessage = "server error"
    return result
  }
  return result
}