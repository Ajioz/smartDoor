const notFound = (req, res) => res.status(404).send("Route does not exist");

export default notFound;


/**
 * 
 * const notFound = (req, res) => {
  // Check if the request is specifically for a missing resource
  if (req.method === "GET" && req.accepts("json")) {
    // Provide a specialized response for resource not found
    res.status(404).json({
      message: "Resource not found",
      // Optionally include additional details like:
      // - resourceType: "item" (or infer from request context)
      // - suggestions: ["Check for typos", "Search for similar items"]
    });
  } else {
    // Handle other 404 scenarios (e.g., missing routes)
    res.status(404).send("Route does not exist");
  }
};

export default notFound;

 * 
 */