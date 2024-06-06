module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  context.res = {
    body: {
      visitors: 0,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
};
