//make async fetch request to the Google Book API by ISBN
//return result as JSON
export const getBookByISBN = async (isbn: string) => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    return await response.json();
}