export const MakeSuccess = (res, data) => {
  return res.status(200).json({
    status: "success",
    data,
  });
};

export const MakeFail = (res, statusCode, code, msg) => {
  return res.status(statusCode).json({
    status: "fail",
    code,
    msg,
  });
};
