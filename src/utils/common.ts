const CreateRandomString = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const DownloadFile = (data: string, filename: string, type: string): void => {
  const file = new Blob([data], { type: type });

  const a = document.createElement("a");
  const url = URL.createObjectURL(file);

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

export { CreateRandomString, DownloadFile };
