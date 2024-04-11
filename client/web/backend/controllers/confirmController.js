export const confirm = (req, res) => {
  return res.status(200).json({
    data: "success",
    msg: "Let's try again",
  });
};
