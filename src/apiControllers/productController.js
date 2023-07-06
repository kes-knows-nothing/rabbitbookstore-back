export const home = (req, res) => {
  return res.send("Home")
}


export const bookTest = async (req, res) => {
    const api_url =
    "hhttps://openapi.naver.com/v1/search/book.json?query=hello&display=10&start=1"
    const response = await fetch(api_url, {
      headers: {
        "X-Naver-Client-Id": "aOgbaTGx7pFGhiOht6a1",
        "X-Naver-Client-Secret": "mXLXNlMsv2",
      },
    });
    console.log(response)
    return res.send("Hello")

}